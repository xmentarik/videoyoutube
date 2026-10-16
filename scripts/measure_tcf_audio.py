"""Measure the TCF voice files and write src/tcf/audio.json.

usage: python3 scripts/measure_tcf_audio.py [audio_dir]   (default: public/tcf/audio)

Each file must be named after its script block: intro_01.wav, q01_1_document.wav,
q01_2_question.mp3, ... For every file we store its duration and, for questions and
dialogues, the onset of each choice (A–D) / each line, snapped from a proportional
text estimate to the nearest speech onset found by ffmpeg silencedetect.
"""
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
audio_dir = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "public", "tcf", "audio")
public = os.path.join(ROOT, "public")
script = json.load(open(os.path.join(ROOT, "src", "tcf", "script.json"), encoding="utf-8"))
questions = {q["n"]: q for q in script["questions"]}


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def onsets(path):
    """Start times of speech chunks (after silences >= 0.25 s)."""
    err = subprocess.run(["ffmpeg", "-hide_banner", "-nostdin", "-i", path, "-af", "silencedetect=noise=-38dB:d=0.25", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    starts = [0.0] + [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", err)]
    return starts


def snap(estimates, chunks, window=1.0):
    marks, last = [], -1.0
    for e in estimates:
        cands = [c for c in chunks if abs(c - e) <= window and c > last]
        m = min(cands, key=lambda c: abs(c - e)) if cands else max(e, last + 0.2)
        marks.append(round(m, 3))
        last = m
    return marks


def proportional(text, needles, dur):
    out, frm = [], 0
    for n in needles:
        i = text.find(n, frm)
        i = frm if i < 0 else i
        frm = i + 1
        out.append(i / max(1, len(text)) * dur)
    return out


files = {}
for name in os.listdir(audio_dir):
    stem, ext = os.path.splitext(name)
    if ext.lower() in (".wav", ".mp3", ".m4a", ".ogg"):
        files[stem] = os.path.join(audio_dir, name)

result, missing = {}, []
for seg in script["segments"]:
    path = files.get(seg["id"])
    if not path:
        missing.append(seg["id"])
        continue
    d = duration(path)
    entry = {"file": os.path.relpath(path, public).replace(os.sep, "/"), "duration": round(d, 3)}
    q = questions.get(seg.get("q"))
    if q and seg["kind"] == "question":
        est = proportional(seg["text"], [f" {l} : " for l in "ABCD"], d)
        entry["marks"] = snap(est, onsets(path))
    elif q and seg["kind"] == "document" and len(q["lines"]) > 1:
        joined = " ".join(l["text"] for l in q["lines"])
        est = proportional(joined, [l["text"] for l in q["lines"]], d)
        entry["marks"] = snap(est, onsets(path))
    result[seg["id"]] = entry

json.dump(result, open(os.path.join(ROOT, "src", "tcf", "audio.json"), "w"), indent=1)
total = sum(e["duration"] for e in result.values())
print(f"{len(result)} fichiers mesurés ({total / 60:.1f} min de voix), {len(missing)} manquants")
if missing:
    print("manquants :", ", ".join(missing[:20]), "…" if len(missing) > 20 else "")
