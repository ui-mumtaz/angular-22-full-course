"""Narrate a lesson in the user's own cloned voice (Chatterbox, local, MIT licence).

Usage:
  python narrate.py <script.md | text.txt> <out.wav> [--ref voice/ref.wav] [--limit N]

- For a lesson .md, only the "## Narration script" section is read; [SCREEN: ...] notes,
  markdown, and code are stripped, so only spoken words are synthesised.
- Text is split into sentence groups (~250 chars) so the model stays stable; each chunk is
  cloned from the same reference and joined with short natural pauses.
- Chatterbox embeds an inaudible Perth watermark in its output (marks it as AI-generated).
"""
import argparse, re, sys, time
import torch, torchaudio
from chatterbox.tts import ChatterboxTTS

sys.stdout.reconfigure(encoding="utf-8", errors="replace")   # ₹, –, … in progress lines on Windows

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("out")
ap.add_argument("--ref", default="voice/ref.wav")
ap.add_argument("--limit", type=int, default=0, help="only the first N chunks (for tests)")
ap.add_argument("--dry", action="store_true", help="print the spoken chunks and exit")
ap.add_argument("--exaggeration", type=float, default=0.45)   # calm teacher delivery
ap.add_argument("--cfg", type=float, default=0.4)             # lower = slower, closer to the reference pace
ap.add_argument("--temperature", type=float, default=0.8)     # Chatterbox default; voice C uses 0.85
ap.add_argument("--per-sentence", action="store_true", help="one sentence per TTS call (voice C: slower, more expressive)")
a = ap.parse_args()

def speakable(code: str) -> str:
    """Turn inline code into words the TTS can say, e.g. `@if` → 'at-if', `name()` → 'name',
    `product-card.ts` → 'product-card dot ts', `$event` → 'dollar event', `=>` → 'arrow'."""
    s = code
    if s.strip() == "()":
        return "brackets"
    if s.strip() in ("**", "'**'"):
        return "double star"
    if s.strip() in ("''", '""'):
        return "an empty string"
    s = re.sub(r'<a\s+routerLink="([^"]+)"[^>]*>([^<]+)</a>', r" an a tag with routerLink equals \1, and the text \2 ", s)   # <a routerLink="/products">Products</a>
    s = re.sub(r"/:(\w+)", r"/ colon \1", s)                                   # products/:id → products slash colon id
    s = re.sub(r"(?<=\w)\?(\w+)=([\w/-]+)", r" question mark \1 equals \2", s)   # /products/2?tab=reviews, /login?returnUrl=/about
    s = re.sub(r"(?<![\w?])\?(\w+)=([\w/-]+)", r" question mark \1 equals \2", s)  # ?sort=price
    s = re.sub(r"(?<![\w?)])\?(?=[a-z])", " question mark ", s)                 # ?tab
    s = re.sub(r"\[\((\w+)\)\]=\"([^\"]+)\"", r" \1 equals \2 ", s)   # [(value)]="qty" → value equals qty
    s = re.sub(r"\[(\w+)\]=\"([^\"]+)\"", r" \1 equals \2 ", s)   # [product]="p" → product equals p
    s = re.sub(r"\((\w+)\)=\"([^\"]+)\"", r" \1 equals \2 ", s)   # (addToCart)="onAdd($event)" → addToCart equals onAdd($event)
    s = re.sub(r"<([\w-]+)\s+(\w+ equals [^/>]+?)\s*/?>", r" \1, with \2 ", s)   # <app-card [product]="p" /> → app-card, with product equals p
    s = re.sub(r"<([\w-]+)\s+select=\"\[?([\w-]+)\]?\"\s*/?>", r" \1, select \2 ", s)   # <ng-content select="[card-title]"> → ng-content, select card-title
    s = re.sub(r"<(\w+)\s+([a-z][\w]*-[\w-]+|app[A-Z]\w*)(?:=\"[^\"]*\")?\s*/?>", r" \1 \2 ", s)   # <h2 card-title> / <p appHighlight="…"> → h2 card-title / p appHighlight
    s = re.sub(r"<\/?([\w-]+)[^>]*\/?>", r" \1 ", s)          # <app-card /> → app-card
    for sym, word in [("{{ }}", " double curly braces "), (".%", " dot percent "), ("!important", " exclamation important "), ("!==", " not equals "), ("!", " not "), ("...", " dot dot dot "), ("'…'", " three dots "), (" < ", " less than "), (" > ", " greater than "), ("===", " equals "), ("!==", " not equals "), ("=>", " arrow "), (" = ", " equals "),
                      ("??", " double question mark "), ("?.", " question-dot "), ("**", " to the power of "),
                      ("{{", " "), ("}}", " "), ("[(", " "), (")]", " "), ("()", ""),
                      ("@", " at-"), ("$", " dollar "), ("#", " hash "), ("&&", " and "), ("||", " or "), (" | ", " pipe "), (" + ", " plus "), (" - ", " minus "), (" * ", " times "), ("₹", " rupees ")]:
        s = s.replace(sym, word)
    s = re.sub(r"(?<=[\w)\]])\.(?=\w)", " dot ", s)             # this.count / file.ts / angular.dev / ).length
    s = re.sub(r"(?<=\w)/(?=\w)", " slash ", s)                 # src/app
    s = re.sub(r"[\[\]{}()<>;:=|'\"]", " ", s)                 # leftover punctuation
    return re.sub(r"\s+", " ", s).replace("at- ", "at-").strip()


raw = open(a.src, encoding="utf-8").read()
if a.src.endswith(".md"):
    m = re.search(r"## Narration script\s*(.*?)\n---", raw, re.S)
    raw = m.group(1) if m else raw
text = re.sub(r"^>.*$", "", raw, flags=re.M)                  # editor notes (first: they mention [SCREEN])
text = re.sub(r"\*\*\[SCREEN:.*?\]\*\*", "\n", text)        # screen notes (may contain [] inside)
text = re.sub(r"```.*?```", "", text, flags=re.S)
text = re.sub(r"``\s?(.+?)\s?``", lambda m: speakable(m.group(1).strip("`")), text)   # `` `a ${b}` `` (code with backticks inside) first, or the single-backtick pairing shifts
text = re.sub(r"`([^`]+)`", lambda m: speakable(m.group(1)), text)   # inline code → how a teacher says it
text = text.replace("**", "")
# pronunciation fixes for CLI words the TTS mangles (applied to spoken text only)
camel = lambda w: re.sub(r"(?<=[a-z])(?=[A-Z])", " ", w)
for pat, rep in [(r"(\*?)\b[Nn]g([A-Z][A-Za-z]*)", lambda m: ("star " if m.group(1) else "") + "N G " + camel(m.group(2))),   # *ngIf, NgTemplateOutlet, ngClass
                 (r"\bng-(?=[a-z])", "N G "), (r"₹55,00,000\.00", "fifty-five lakh rupees"), (r"55,00,000", "55, comma, 00, comma, 000"), (r"1,25,000", "one lakh twenty-five thousand"), (r"5,500,000", "5, comma, 500, comma, 000"),
                 (r"₹([\w,-]+(?: lakh| thousand)?)(\.\d+)?", lambda m: f"rupees {m.group(1)}{m.group(2) or ''}" if m.group(2) else f"{m.group(1)} rupees"),
                 (r"\bLOCALE_ID\b", "locale ID"), (r"\bli\b", "L I"), (r"\bul\b", "U L"), (r"\bxyz\b", "X Y Z"), (r"\bupi\b", "U P I"), (r"\$(\d[\d,]*)(\.\d+)?", lambda m: f"{m.group(1)} dollars" + (f", point {' '.join(m.group(2)[1:])}" if m.group(2) else "")), (r"\bNov\b", "November"), (r"\bINR\b", "I N R"), (r"\bgst\b", "G S T"), (r"✓", " check mark "), (r"(?<![\d,.])799(?![\d,])", "seven ninety-nine"), (r"\b(NG|TS)(\d)(\d)(\d)(\d)\b", lambda m: " ".join(m.group(1)) + " " + " ".join(["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"][int(x)] for x in m.groups()[1:])), (r"https? ?//", ""), (r"\bdummyjson\b", "dummy JSON"), (r"(?<=\w)/(?=\s|$)", " slash"), (r"\bcod\b", "C O D"), (r"\ben-IN\b", "E N, I N"), (r"\bapp(?=[A-Z])", "app "), (r"(?<![\w-])@(?=[a-z])", "at "), (r"\bbg-", "B G "),
                 (r"\bnode_modules\b", r"node modules"), (r"\bscss\b", r"S C S S"), (r"\btsconfig", r"T S config"), (r"\bREADME", r"readme"), (r"\bmd\b", r"M D"), (r"\bico\b", r"I C O"), (r"(?<![\w-])--(?=[A-Za-z])", r"dash dash "), (r"\bcd\b", r"C D"), (r"localhost:(\d+)", r"localhost \1"), (r"Ctrl\+", r"Control "), (r"\bCtrl\b", r"Control"), (r"\bsrc\b", r"S R C"), (r"\bng\b", "N G"), (r"\bngModel\b", "N G Model"), (r"_ngcontent\b", "N G content"), (r"_nghost\b", "N G host"), (r"\bnpm\b", "N P M"), (r"\bnvm\b", "N V M"), (r"\bnpx\b", "N P X"),
                 (r"(?<![\w-])-(?=[A-Za-z])", "dash "), (r"\bv(\d{2})\b", r"v \1"), (r"\bsudo\b", "sue-doo"), (r"\.ps1\b", " dot P S 1"), (r"slash cli\b", "slash C L I"),
                 (r"Signal<(\w+)\[\]>", r"Signal of \1 array"), (r"Signal<(\w+)>", r"Signal of \1"), (r"\s?×\s?", " times "), (r"♥", " heart "), (r"\b2897\b", "two thousand eight hundred ninety-seven"), (r"(?<![\d,.])1299(?![\d,])", "twelve ninety-nine"),
                 (r"(?<![\w&])#(\d+)\b", r"number \1"), (r"(?<!\w)_([A-Z]\w*)", r"underscore \1"), (r"\b10:45\b", "ten forty-five"),
                 (r"\b[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+\b", lambda m: m.group(0).replace("_", " ")), (r"dummy JSON\.com", "dummy JSON dot com"), (r"\bmyshop\b", "my shop"), (r"\bv1\b", "V one"),
                 (r"(?<![\d,.])999(?!\d|,\d)", "nine ninety-nine"), (r"(\d+)%", r"\1 percent"),
                 (r"(?<![\w.])\./", "dot slash "), (r"(?<!\w)\.then\b", "dot then"), (r"\b521\b", "five twenty-one"), (r"\b3418\b", "three thousand four hundred eighteen"), (r"\bSDKs\b", "S D Ks"),
                 (r"(?<![\w./])/(?=[a-z])", "slash "), (r"(?<![\w./])/(?=[,.:]|\s|$)", "slash"), (r"\b404\b", "four oh four"), (r"\bPreloadAllModules\b", "Preload All Modules"),
                 (r"\b(CanActivate|CanMatch|CanDeactivate|Resolve)Fn\b", lambda m: re.sub(r"(?<=[a-z])(?=[A-Z])", " ", m.group(1)) + " F N"), (r"\bUrlTree\b", "Url Tree"),
                 (r"\b99999\b", "nine nine nine nine nine"), (r"\bRedirectCommand\b", "Redirect Command"), (r"\btext-3xl\b", "text three X L")]:
    text = re.sub(pat, rep, text)
text = re.sub(r"\b[a-z]+(?:[A-Z][a-z]+){1,}\b", lambda m: re.sub(r"(?<=[a-z])(?=[A-Z])", " ", m.group(0)), text)
paras = [re.sub(r"\s+", " ", p).strip() for p in re.split(r"\n\s*\n", text) if p.strip()]

chunks = []                                   # (text, pause_after_seconds)
for p in paras:
    # split only where . ! ? is followed by whitespace, so "Node.js", "angular.dev", "₹1.5" stay intact
    sents = [s for s in re.split(r"(?<=[.!?])\s+|(?<=[.!?][\"”'])\s+", p) if s.strip()]
    cur = ""
    for s in sents:
        s = s.strip()
        if cur and (a.per_sentence or len(cur) + len(s) > 250):
            chunks.append((cur, 0.38 if a.per_sentence else 0.25)); cur = s
        else:
            cur = (cur + " " + s).strip()
    if cur:
        chunks.append((cur, 0.6))             # longer breath between paragraphs
if a.limit:
    chunks = chunks[:a.limit]

if a.dry:
    for c, _ in chunks:
        print(c)
    sys.exit(0)

device = "cuda" if torch.cuda.is_available() else "cpu"
t0 = time.time()
model = ChatterboxTTS.from_pretrained(device=device)
print(f"model loaded on {device} in {time.time() - t0:.0f}s; {len(chunks)} chunks", flush=True)

pieces, sr = [], model.sr
for i, (c, pause) in enumerate(chunks, 1):
    t = time.time()
    wav = model.generate(c, audio_prompt_path=a.ref, exaggeration=a.exaggeration, cfg_weight=a.cfg, temperature=a.temperature)
    pieces += [wav, torch.zeros(1, int(sr * pause))]
    print(f"[{i}/{len(chunks)}] {wav.shape[-1] / sr:.1f}s audio in {time.time() - t:.0f}s: {c[:60]}", flush=True)
out = torch.cat(pieces, dim=-1)
torchaudio.save(a.out, out, sr)
print(f"wrote {a.out}: {out.shape[-1] / sr:.1f}s total, {time.time() - t0:.0f}s elapsed")
