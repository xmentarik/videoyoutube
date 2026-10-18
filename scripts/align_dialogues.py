"""Find when each dialogue line is spoken in public/dialogues/partN.wav → src/dialogues/timing.json.

usage: python3 scripts/align_dialogues.py   (pip install librosa)

partN.wav = the 10 dialogues of section N read back to back (Paul + Sophie, multi-speaker TTS).
No speech recognition: speech chunks are split on silences, each chunk gets a male/female
score from its pitch, and a dynamic program assigns consecutive chunks to the known lines,
scoring speaker match (Paul = male, Sophie = female, weighted by voiced frames), duration vs.
text length (punctuation counts as pauses, e.g. spelled letters) and a pause at each turn.
"""
import json
import math
import os
import re

import librosa
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR, HOP = 16000, 160
FEMALE_HZ = 165  # Paul's chunks sit around 70–135 Hz, Sophie's around 190–300 Hz


def chunks_of(path):
    y, _ = librosa.load(path, sr=SR)
    iv = librosa.effects.split(y, top_db=35, frame_length=1024, hop_length=HOP)
    f0, _, _ = librosa.pyin(y, fmin=70, fmax=400, sr=SR, frame_length=1024, hop_length=HOP)
    out = []
    for a, b in iv:
        f = f0[a // HOP: b // HOP]
        f = f[~np.isnan(f)]
        female = float(np.mean(f >= FEMALE_HZ)) if len(f) >= 5 else None
        out.append((a / SR, b / SR, female, len(f) * HOP / SR))
    return out


def weight(text):
    """Text length in "characters", each punctuation mark counting as a short pause."""
    return len(text) + 6 * len(re.findall(r"[,.?!…]", text))


def align(lines, chunks):
    n, m = len(lines), len(chunks)
    chars = [weight(l["text"]) for l in lines]
    rate = (chunks[-1][1] - chunks[0][0]) / sum(chars)
    target = [1.0 if l["who"] == "Sophie" else 0.0 for l in lines]
    INF = float("inf")
    best = [[INF] * (m + 1) for _ in range(n + 1)]
    back = [[0] * (m + 1) for _ in range(n + 1)]
    best[0][0] = 0.0
    for i in range(n):
        exp = chars[i] * rate
        for j in range(m):
            if best[i][j] == INF:
                continue
            gap = chunks[j][0] - chunks[j - 1][1] if j else 1.0
            mismatch = 0.0
            for k in range(j, m):
                s, e, fem, voiced = chunks[k]
                if fem is not None:
                    mismatch += abs(fem - target[i]) * voiced
                span = e - chunks[j][0]
                if span > 3 * exp + 3:
                    break
                c = best[i][j] + 10 * mismatch + 2 * math.log(span / exp) ** 2 - 2.5 * min(gap, 0.7)
                if c < best[i + 1][k + 1]:
                    best[i + 1][k + 1], back[i + 1][k + 1] = c, j
    spans, k = [], m
    for i in range(n, 0, -1):
        j = back[i][k]
        spans.append((j, k))
        k = j
    spans.reverse()
    res = []
    for i, (j, k) in enumerate(spans):
        seg = chunks[j:k]
        fem = [c[2] for c in seg if c[2] is not None]
        res.append({
            "start": round(seg[0][0], 3),
            "end": round(seg[-1][1], 3),
            "female": round(float(np.mean(fem)), 2) if fem else None,
            "ratio": round((seg[-1][1] - seg[0][0]) / (chars[i] * rate), 2),
        })
    return res


script = json.load(open(os.path.join(ROOT, "src", "dialogues", "script.json"), encoding="utf-8"))
timing, warnings = {}, []
for sec in script["sections"]:
    rel = f"dialogues/part{sec['n']}.wav"
    ds = [d for d in script["dialogues"] if d["section"] == sec["n"]]
    flat = [(d["n"], i, l) for d in ds for i, l in enumerate(d["lines"])]
    res = align([l for _, _, l in flat], chunks_of(os.path.join(ROOT, "public", rel)))
    for (dn, i, l), r in zip(flat, res):
        want = 1.0 if l["who"] == "Sophie" else 0.0
        if (r["female"] is not None and abs(r["female"] - want) > 0.5) or not 0.45 <= r["ratio"] <= 2.2:
            warnings.append(f"D{dn:02d} ligne {i + 1} ({l['who']}) : voix={r['female']} durée×{r['ratio']}")
    for d in ds:
        rs = [r for (dn, _, _), r in zip(flat, res) if dn == d["n"]]
        timing[f"d{d['n']:02d}"] = {"file": rel, "lines": [[r["start"], r["end"]] for r in rs]}
json.dump(timing, open(os.path.join(ROOT, "src", "dialogues", "timing.json"), "w"), indent=1)
print(len(timing), "dialogues alignés")
print("\n".join(warnings) or "aucune ligne suspecte")
