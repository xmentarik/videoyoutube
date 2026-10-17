"""Parse a TTS script (markdown) into src/tcf/script_pN.json for the Remotion video.

usage: python3 scripts/parse_tcf_script.py scripts/TCF_Canada_CO_A1_Partie2_script_TTS.md src/tcf/script_p2.json
"""
import json, re, sys

src, out = sys.argv[1], sys.argv[2]
md = open(src, encoding="utf-8").read()

def clean(t):
    t = re.sub(r"\[[^\]]*\]", "", t)
    return re.sub(r"[ \t]+", " ", t).strip()

blocks = []  # (id, header line, text)
lines = md.split("\n")
i = 0
cur_section = None
sections = {}
while i < len(lines):
    m = re.match(r"^`?(?:### )?`([a-z0-9_]+)`\s*·\s*(.+)$", lines[i].strip())
    if m and i + 1 < len(lines) and lines[i + 1].strip() == "```":
        bid, kind = m.group(1), m.group(2)
        j = i + 2
        body = []
        while lines[j].strip() != "```":
            body.append(lines[j]); j += 1
        blocks.append((bid, kind, "\n".join(body)))
        i = j + 1
        continue
    sm = re.match(r"^## \d+\. SECTION (\d+) : (.+?) \(Q(\d+) à Q(\d+)\)", lines[i])
    if sm:
        sections[int(sm.group(1))] = {"title": sm.group(2), "from": int(sm.group(3)), "to": int(sm.group(4))}
    i += 1

answers = {int(q): a for q, a in re.findall(r"### QUESTION (\d+) \(réponse : ([ABCD])\)", md)}

segments = []
questions = {}
for bid, kind, body in blocks:
    qm = re.match(r"q(\d+)_(\d)_(\w+)", bid)
    seg = {"id": bid, "text": clean(body)}
    if qm:
        n, part = int(qm.group(1)), int(qm.group(2))
        q = questions.setdefault(n, {"n": n, "answer": answers[n]})
        seg["q"] = n
        if part == 1:
            seg["kind"] = "document"
            q["docType"] = "dialogue" if kind.startswith("Dialogue") else ("message" if kind.startswith("Message") else "annonce")
            q["voice"] = "PAUL" if "PAUL" in kind else ("SOPHIE" if "SOPHIE" in kind else "both")
            if q["docType"] == "dialogue":
                q["lines"] = [{"who": l.split(":", 1)[0].strip(), "text": clean(l.split(":", 1)[1])} for l in body.split("\n") if ":" in l]
            else:
                q["lines"] = [{"who": q["voice"].capitalize(), "text": clean(body)}]
        elif part == 2:
            seg["kind"] = "question"
            t = clean(body)
            parts = re.split(r"\s([ABCD]) : ", " " + t.split("?", 1)[1]) if "?" in t else []
            q["prompt"] = t.split("?", 1)[0].split(".", 1)[1].strip() + " ?"
            q["choices"] = [parts[k + 1].strip().rstrip(".") for k in range(1, len(parts) - 1, 2)]
            assert len(q["choices"]) == 4, (bid, parts)
        else:
            seg["kind"] = "answer"
            t = clean(body)
            expl = re.sub(r"^La bonne réponse est [ABCD] : [^.!]*[.!]\s*", "", t)
            q["explanation"] = expl
    else:
        base = re.sub(r"^p\d+_", "", bid)  # part 2+ ids are prefixed: p2_intro_01
        seg["kind"] = base.split("_")[0]  # intro / section / pause / outro
        if base.startswith("section_"):
            seg["section"] = int(base.split("_")[1])
    segments.append(seg)

json.dump({"sections": sections, "questions": [questions[k] for k in sorted(questions)], "segments": segments},
          open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(segments), "segments,", len(questions), "questions,", len(sections), "sections")
