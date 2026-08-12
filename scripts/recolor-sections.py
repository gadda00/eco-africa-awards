#!/usr/bin/env python3
"""Batch-update section files to use the new warm African palette."""
from pathlib import Path

REPLACEMENTS = [
    # Emerald -> forest
    ("from-emerald-500/15 via-card/60 to-amber-500/10", "from-forest/12 via-card/60 to-gold/10"),
    ("from-emerald-500/15", "from-forest/12"),
    ("from-emerald-500/12", "from-forest/12"),
    ("from-emerald-500/10", "from-forest/10"),
    ("from-emerald-500/8", "from-forest/8"),
    ("from-emerald-500/5", "from-forest/5"),
    ("to-emerald-500/10", "to-gold/10"),
    ("to-emerald-500/5", "to-forest/5"),
    ("via-emerald-700/5", "via-forest-light/5"),
    ("from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500", "from-forest to-forest-light hover:from-forest hover:to-forest-light"),
    ("from-emerald-500 to-emerald-600 hover:from-emerald-400", "from-forest to-forest-light"),
    ("from-emerald-500 to-emerald-600", "from-forest to-forest-light"),
    ("from-emerald-500 via-emerald-600", "from-forest via-forest-light"),
    ("from-emerald-500 to-amber-500", "from-forest to-gold"),
    ("from-emerald-500", "from-forest"),
    ("to-emerald-500", "to-forest"),
    ("via-emerald-500", "via-forest"),
    ("bg-emerald-500/30", "bg-forest/30"),
    ("bg-emerald-500/25", "bg-forest/25"),
    ("bg-emerald-500/20", "bg-forest/20"),
    ("bg-emerald-500/15", "bg-forest/15"),
    ("bg-emerald-500/12", "bg-forest/12"),
    ("bg-emerald-500/10", "bg-forest/10"),
    ("bg-emerald-500/8", "bg-forest/8"),
    ("bg-emerald-500/5", "bg-forest/5"),
    ("bg-emerald-500", "bg-forest"),
    ("ring-emerald-500/60", "ring-forest/60"),
    ("ring-emerald-500/50", "ring-forest/50"),
    ("ring-emerald-500/40", "ring-forest/40"),
    ("ring-emerald-500/30", "ring-forest/30"),
    ("ring-emerald-500/20", "ring-forest/20"),
    ("border-emerald-500/60", "border-forest/60"),
    ("border-emerald-500/50", "border-forest/50"),
    ("border-emerald-500/40", "border-forest/40"),
    ("border-emerald-500/30", "border-forest/30"),
    ("border-emerald-500/20", "border-forest/20"),
    ("text-emerald-400", "text-forest"),
    ("text-emerald-300", "text-forest-light"),
    ("text-emerald-200", "text-forest-light"),
    ("text-emerald-500", "text-forest"),
    # Amber -> gold
    ("from-amber-500/15", "from-gold/15"),
    ("from-amber-500/12", "from-gold/12"),
    ("from-amber-500/10", "from-gold/10"),
    ("from-amber-500/8", "from-gold/8"),
    ("from-amber-500/5", "from-gold/5"),
    ("to-amber-500/15", "to-gold/15"),
    ("to-amber-500/10", "to-gold/10"),
    ("to-amber-500/5", "to-gold/5"),
    ("to-amber-500/0", "to-transparent"),
    ("from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500", "from-gold to-terracotta hover:from-gold-light hover:to-terracotta"),
    ("from-amber-500 to-amber-600 hover:from-amber-400", "from-gold to-terracotta hover:from-gold-light"),
    ("from-amber-500 to-amber-600", "from-gold to-terracotta"),
    ("from-amber-500 to-emerald-500", "from-gold to-forest"),
    ("from-amber-500", "from-gold"),
    ("to-amber-500", "to-gold"),
    ("via-amber-500", "via-gold"),
    ("bg-amber-500/40", "bg-gold/40"),
    ("bg-amber-500/30", "bg-gold/30"),
    ("bg-amber-500/25", "bg-gold/25"),
    ("bg-amber-500/20", "bg-gold/20"),
    ("bg-amber-500/15", "bg-gold/15"),
    ("bg-amber-500/12", "bg-gold/12"),
    ("bg-amber-500/10", "bg-gold/10"),
    ("bg-amber-500/8", "bg-gold/8"),
    ("bg-amber-500/5", "bg-gold/5"),
    ("bg-amber-500", "bg-gold"),
    ("ring-amber-500/60", "ring-gold/60"),
    ("ring-amber-500/50", "ring-gold/50"),
    ("ring-amber-500/40", "ring-gold/40"),
    ("ring-amber-500/30", "ring-gold/30"),
    ("ring-amber-500/20", "ring-gold/20"),
    ("border-amber-500/60", "border-gold/60"),
    ("border-amber-500/50", "border-gold/50"),
    ("border-amber-500/40", "border-gold/40"),
    ("border-amber-500/30", "border-gold/30"),
    ("border-amber-500/20", "border-gold/20"),
    ("text-amber-400", "text-gold"),
    ("text-amber-300", "text-gold-light"),
    ("text-amber-200", "text-gold-light"),
    ("text-amber-500", "text-gold"),
    # Orange -> terracotta
    ("from-orange-500/25", "from-terracotta/25"),
    ("from-orange-500/15", "from-terracotta/15"),
    ("from-orange-500/10", "from-terracotta/10"),
    ("from-orange-500/5", "from-terracotta/5"),
    ("from-orange-700/5", "from-terracotta/5"),
    ("via-orange-700/5", "via-terracotta/5"),
    ("to-orange-700/5", "to-terracotta/5"),
    ("bg-orange-500/20", "bg-terracotta/20"),
    ("bg-orange-500/15", "bg-terracotta/15"),
    ("bg-orange-500/10", "bg-terracotta/10"),
    ("bg-orange-500/5", "bg-terracotta/5"),
    ("ring-orange-500/40", "ring-terracotta/40"),
    ("ring-orange-500/30", "ring-terracotta/30"),
    ("border-orange-500/40", "border-terracotta/40"),
    ("border-orange-500/30", "border-terracotta/30"),
    ("text-orange-400", "text-terracotta"),
    ("text-orange-300", "text-terracotta"),
    # Yellow -> savanna/terracotta
    ("from-yellow-500/25", "from-savanna/30"),
    ("from-yellow-500/15", "from-savanna/20"),
    ("from-yellow-500/10", "from-savanna/15"),
    ("from-yellow-700/5", "from-savanna/8"),
    ("via-yellow-700/5", "via-savanna/8"),
    ("to-yellow-700/5", "to-savanna/8"),
    ("bg-yellow-500/20", "bg-savanna/25"),
    ("bg-yellow-500/15", "bg-savanna/20"),
    ("bg-yellow-500/10", "bg-savanna/15"),
    ("ring-yellow-500/40", "ring-savanna/50"),
    ("ring-yellow-500/30", "ring-savanna/40"),
    ("border-yellow-500/40", "border-savanna/50"),
    ("border-yellow-500/30", "border-savanna/40"),
    ("text-yellow-400", "text-gold"),
    # Teal -> sky
    ("from-teal-500/25", "from-sky/15"),
    ("from-teal-500/15", "from-sky/10"),
    ("from-teal-500/10", "from-sky/8"),
    ("from-teal-700/5", "from-sky/5"),
    ("via-teal-700/5", "via-sky/5"),
    ("to-teal-700/5", "to-sky/5"),
    ("bg-teal-500/20", "bg-sky/15"),
    ("bg-teal-500/15", "bg-sky/10"),
    ("bg-teal-500/10", "bg-sky/8"),
    ("ring-teal-500/40", "ring-sky/40"),
    ("ring-teal-500/30", "ring-sky/30"),
    ("border-teal-500/40", "border-sky/40"),
    ("border-teal-500/30", "border-sky/30"),
    ("text-teal-400", "text-sky"),
    # Gradient text helper
    ("text-gradient-emerald", "text-gradient-sunset"),
    # Grid -> dots for warm theme
    ("bg-grid opacity-[0.05]", "bg-dots opacity-30"),
    ("bg-grid opacity-[0.06]", "bg-dots opacity-30"),
    ("bg-grid opacity-[0.07]", "bg-dots opacity-30"),
    # Text colors
    ("text-background font-semibold", "text-cream font-semibold"),
    ("text-background", "text-cream"),
]

SECTIONS_DIR = Path("/home/z/my-project/src/components/sections")
FILES_TO_UPDATE = [
    "selection.tsx", "timeline.tsx", "winners.tsx", "ai-features.tsx",
    "ceremony.tsx", "sponsors.tsx", "faq.tsx", "contact.tsx",
]

for fname in FILES_TO_UPDATE:
    fpath = SECTIONS_DIR / fname
    if not fpath.exists():
        print(f"SKIP: {fname}")
        continue
    text = fpath.read_text()
    orig = text
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    if text != orig:
        fpath.write_text(text)
        print(f"UPDATED: {fname}")
    else:
        print(f"NO CHANGES: {fname}")

print("Done.")
