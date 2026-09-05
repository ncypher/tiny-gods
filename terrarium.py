"""Explicit assembly order for the shared-state simulation and its presentation."""
import json
from pathlib import Path

ROOT = Path(__file__).parent
LAYERS = (
    "culture_v03.js", "spectacle_v04.js", "ages_v05.js", "legends_v05.js",
    "dynasties_v06.js", "card_compat_v08.js", "under_glass_v07.js",
    "under_glass_entry_fix_v08.js", "identity_v07.js", "archaeology_v07.js",
    "construction_v07.js", "daily_life_v07.js", "role_effects_v07.js",
    "house_life_v07.js", "rituals_v07.js", "memory_myth_v08.js",
    "myth_transmission_v08.js", "pantheon_v09.js", "atmosphere_v09.js",
    "overdrive_v09.js", "cinematic_v09.js", "finale_v09.js", "atlas.js",
)


def build_html(config):
    html = (ROOT / "terrarium.html").read_text(encoding="utf-8")
    html = html.replace("__TINY_GODS_CONFIG__", json.dumps(config).replace("<", "\\u003c"))
    marker = "</script></body></html>"
    if html.count(marker) != 1:
        raise ValueError("Terrarium must contain exactly one layer insertion point")
    scripts = "\n".join((ROOT / name).read_text(encoding="utf-8") for name in LAYERS)
    html = html.replace(marker, "\n" + scripts + "\n" + marker)
    helpers = "\n".join((ROOT / name).read_text(encoding="utf-8") for name in ("clock.js", "landscape.js"))
    html = html.replace("const CFG=", helpers + "\nconst CFG=", 1)
    return html.replace("</head>", "<style>" + (ROOT / "atlas.css").read_text(encoding="utf-8") + "</style></head>")
