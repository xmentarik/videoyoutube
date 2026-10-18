"""Parse the A1 job-interview dialogues script into src/dialogues/script.json.

usage: python3 scripts/parse_dialogues.py   (reads scripts/dialogues_employe_candidate_A1.md)
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
md = open(os.path.join(ROOT, "scripts", "dialogues_employe_candidate_A1.md"), encoding="utf-8").read()


def clean(t):
    return re.sub(r"\s+", " ", re.sub(r"\[[^\]]*\]", "", t)).strip()


sections = []
for n, title, a, b in re.findall(r"^## SECTION (\d+) : (.+?) \(D(\d+) à D(\d+)\)", md, re.M):
    sections.append({"n": int(n), "title": title, "from": int(a), "to": int(b)})

# vocabulary table: | D01–D10 | Présentation | mot, mot, ... |
for row in re.findall(r"^\| D\d+–D\d+ \| (.+?) \| (.+?) \|$", md, re.M):
    s = sections[len([x for x in sections if "theme" in x])]
    s["theme"], s["vocab"] = row[0], [w.strip() for w in row[1].split(",")]

dialogues = []
for n, title, body in re.findall(r"### DIALOGUE (\d+) · (.+?)\n`d\d+_dialogue`\n```\n(.*?)\n```", md, re.S):
    n = int(n)
    lines = [{"who": l.split(":", 1)[0].strip(), "text": clean(l.split(":", 1)[1])} for l in body.split("\n") if ":" in l]
    section = next(s["n"] for s in sections if s["from"] <= n <= s["to"])
    dialogues.append({"n": n, "title": title.strip(), "section": section, "lines": lines})

json.dump({"sections": sections, "dialogues": dialogues}, open(os.path.join(ROOT, "src", "dialogues", "script.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
print(len(dialogues), "dialogues,", sum(len(d["lines"]) for d in dialogues), "lines,", len(sections), "sections")
