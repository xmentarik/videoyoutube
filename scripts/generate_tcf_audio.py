"""Generate the 130 TCF voice files from the TTS script.

usage:
  [GEMINI_API_KEY=...] python3 scripts/generate_tcf_audio.py gemini [--part=2] [--only=q01,q02] [--force]
  python3 scripts/generate_tcf_audio.py edge [--part=2] [--only=intro]         (pip install edge-tts)

Files land in public/tcf/audio/<block_id>.wav, named exactly like the script blocks.
Then run: python3 scripts/measure_tcf_audio.py --part=N, then render TcfA1PartieN.
"""
import base64
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
import wave

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PART = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--part=")), "1")
SCRIPT = os.path.join(ROOT, "scripts", f"TCF_Canada_CO_A1_Partie{PART}_script_TTS.md")
OUT = os.path.join(ROOT, "public", "tcf", "audio")

GEMINI_MODEL = os.environ.get("GEMINI_TTS_MODEL", "gemini-2.5-flash-preview-tts")
GEMINI_VOICES = {"Narratrice": "Kore", "Paul": "Charon", "Sophie": "Leda"}
EDGE_VOICES = {"Narratrice": "fr-FR-DeniseNeural", "Paul": "fr-CA-AntoineNeural", "Sophie": "fr-CA-SylvieNeural"}


def parse():
    md = open(SCRIPT, encoding="utf-8").read()
    # the "Voix suggérée : …" line between the heading and the block is optional
    styles = dict(re.findall(r"### (NARRATRICE|PAUL|SOPHIE)\n(?:[^`\n][^\n]*\n)?```\n([\s\S]*?)\n```", md))
    blocks = []
    for m in re.finditer(r"`([a-z0-9_]+)`\s*·\s*([^\n]+)\n```\n(.*?)\n```", md, re.S):
        bid, kind, text = m.group(1), m.group(2), m.group(3).strip()
        if kind.startswith("Dialogue"):
            speaker = "dialogue"
        elif "PAUL" in kind:
            speaker = "Paul"
        elif "SOPHIE" in kind:
            speaker = "Sophie"
        else:
            speaker = "Narratrice"
        blocks.append({"id": bid, "speaker": speaker, "text": text})
    return blocks, {"Narratrice": styles["NARRATRICE"], "Paul": styles["PAUL"], "Sophie": styles["SOPHIE"]}


def write_wav(path, pcm, rate=24000):
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(pcm)


def gemini(block, styles, key):
    if block["speaker"] == "dialogue":
        prompt = (
            "Lis ce dialogue en français, comme un enregistrement d'examen TCF de niveau A1.\n"
            f"Paul : {styles['Paul']}\nSophie : {styles['Sophie']}\n"
            "Les indications entre crochets décrivent le ton : ne les lis pas.\n\n" + block["text"]
        )
        speech = {
            "multiSpeakerVoiceConfig": {
                "speakerVoiceConfigs": [
                    {"speaker": s, "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": GEMINI_VOICES[s]}}} for s in ("Paul", "Sophie")
                ]
            }
        }
    else:
        s = block["speaker"]
        prompt = f"{styles[s]}\nLes indications entre crochets décrivent le ton : ne les lis pas.\nLis ce texte en français :\n\n{block['text']}"
        speech = {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": GEMINI_VOICES[s]}}}
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": speech},
    }
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
    for attempt in range(6):
        headers = {"Content-Type": "application/json"}
        if key:  # otherwise the environment's network secret adds x-goog-api-key
            headers["x-goog-api-key"] = key
        req = urllib.request.Request(url, json.dumps(body).encode(), headers)
        try:
            data = json.load(urllib.request.urlopen(req, timeout=180))
            part = data["candidates"][0]["content"]["parts"][0]["inlineData"]
            rate = int(re.search(r"rate=(\d+)", part.get("mimeType", "")).group(1)) if "rate=" in part.get("mimeType", "") else 24000
            return base64.b64decode(part["data"]), rate
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:300]
            if e.code in (429, 500, 503):
                wait = 20 * (attempt + 1)
                print(f"  {e.code}, nouvel essai dans {wait}s… {msg[:120]}")
                time.sleep(wait)
                continue
            raise SystemExit(f"Gemini a refusé {block['id']} ({e.code}) : {msg}")
    raise SystemExit(f"Échec répété pour {block['id']}")


def edge(block, path):
    import asyncio

    import edge_tts

    def clean(t):
        return re.sub(r"\s+", " ", re.sub(r"\[[^\]]*\]", "", t)).strip()

    async def say(text, voice, out):
        await edge_tts.Communicate(text, voice, rate="-12%", proxy=os.environ.get("HTTPS_PROXY")).save(out)

    with tempfile.TemporaryDirectory() as tmp:
        if block["speaker"] == "dialogue":
            parts = []
            for i, line in enumerate(l for l in block["text"].split("\n") if ":" in l):
                who, text = line.split(":", 1)
                p = os.path.join(tmp, f"{i}.mp3")
                asyncio.run(say(clean(text), EDGE_VOICES[who.strip()], p))
                parts.append(p)
            gap = os.path.join(tmp, "gap.wav")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", "0.45", gap], check=True)
            inputs, filt = [], []
            for i, p in enumerate(parts):
                inputs += ["-i", p] + (["-i", gap] if i < len(parts) - 1 else [])
            n = len(parts) * 2 - 1
            filt = "".join(f"[{k}:a]aresample=24000,aformat=channel_layouts=mono[a{k}];" for k in range(n))
            filt += "".join(f"[a{k}]" for k in range(n)) + f"concat=n={n}:v=0:a=1[out]"
            subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", filt, "-map", "[out]", path], check=True)
        else:
            p = os.path.join(tmp, "a.mp3")
            asyncio.run(say(clean(block["text"]), EDGE_VOICES[block["speaker"]], p))
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", p, "-ar", "24000", "-ac", "1", path], check=True)


def main():
    engine = sys.argv[1] if len(sys.argv) > 1 else "gemini"
    only = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--only=")), None)
    force = "--force" in sys.argv
    blocks, styles = parse()
    if only:
        prefixes = only.split(",")
        blocks = [b for b in blocks if any(b["id"].startswith(p) for p in prefixes)]
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    os.makedirs(OUT, exist_ok=True)
    for i, b in enumerate(blocks, 1):
        path = os.path.join(OUT, f"{b['id']}.wav")
        if os.path.exists(path) and not force:
            continue
        print(f"[{i}/{len(blocks)}] {b['id']} ({b['speaker']})")
        if engine == "gemini":
            pcm, rate = gemini(b, styles, key)
            write_wav(path, pcm, rate)
        else:
            edge(b, path)
    print("terminé :", OUT)


if __name__ == "__main__":
    main()
