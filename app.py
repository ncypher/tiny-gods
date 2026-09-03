import json
import random
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components

ROOT = Path(__file__).parent

st.set_page_config(
    page_title="Tiny Gods — Agent Terrarium",
    page_icon="🌱",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown(
    """
    <style>
      .stApp { background: radial-gradient(circle at 50% -20%, #17243a 0%, #080c13 44%, #05070b 100%); }
      [data-testid="stSidebar"] { background: linear-gradient(180deg,#0b1019 0%,#090d14 100%); border-right: 1px solid rgba(255,255,255,.08); }
      [data-testid="stSidebar"] * { color: #dce8e3; }
      .block-container { padding-top: 1.1rem; max-width: 1600px; }
      h1,h2,h3 { letter-spacing: -.03em; }
      .tg-kicker { color:#7cf8c7; font: 700 12px/1.2 ui-monospace,monospace; letter-spacing:.16em; text-transform:uppercase; }
      .tg-title { font: 800 clamp(34px,5vw,68px)/.95 ui-sans-serif,system-ui; color:#f5fff9; margin:.18rem 0 .35rem; }
      .tg-sub { color:#9eb0aa; max-width:850px; font-size:15px; }
      .tg-pill {display:inline-block;padding:5px 9px;border:1px solid rgba(124,248,199,.22);border-radius:999px;color:#b9f9df;background:rgba(124,248,199,.06);font:600 11px ui-monospace,monospace;margin-right:5px}
      footer { visibility:hidden; }
    </style>
    """,
    unsafe_allow_html=True,
)

with st.sidebar:
    st.markdown("### ⚙️ Genesis Console")
    if "seed" not in st.session_state:
        st.session_state.seed = 73481
    seed = st.number_input("World seed", min_value=1, max_value=99999999, value=int(st.session_state.seed), step=1)
    col_a, col_b = st.columns(2)
    if col_a.button("🎲 Randomize", use_container_width=True):
        st.session_state.seed = random.randint(1, 99_999_999)
        st.rerun()
    if col_b.button("↻ Rebirth", use_container_width=True):
        st.session_state.seed = int(seed)
        st.rerun()

    st.divider()
    population = st.slider("Founding population", 12, 90, 38)
    cooperation = st.slider("Cooperation", 0, 100, 68)
    aggression = st.slider("Aggression", 0, 100, 22)
    scarcity = st.slider("Scarcity", 0, 100, 34)
    innovation = st.slider("Innovation", 0, 100, 61)
    climate = st.slider("Climate stability", 0, 100, 72)
    speed = st.select_slider("Time flow", options=[0.5, 1.0, 2.0, 4.0], value=1.0, format_func=lambda x: f"{x:g}×")

    st.divider()
    st.caption("The simulation is deterministic for a given seed + rule set. Share a world by sharing those values.")

config = {
    "seed": int(seed),
    "population": population,
    "cooperation": cooperation / 100,
    "aggression": aggression / 100,
    "scarcity": scarcity / 100,
    "innovation": innovation / 100,
    "climate": climate / 100,
    "speed": speed,
}

st.markdown(
    """
    <div class="tg-kicker">EMERGENT SYSTEMS LAB / TERRARIUM 01</div>
    <div class="tg-title">Tiny Gods</div>
    <div class="tg-sub">A living browser terrarium of autonomous little beings. Change the rules, start a world, and watch settlement, scarcity, cooperation, conflict, memory, culture, migration, diplomacy, trade and history emerge from simple local behavior.</div>
    <div style="margin-top:10px"><span class="tg-pill">CLICK AGENTS OR CAMPS</span><span class="tg-pill">DRAG TO PAN</span><span class="tg-pill">WHEEL TO ZOOM</span><span class="tg-pill">SPACE = PAUSE</span></div>
    """,
    unsafe_allow_html=True,
)

html = (ROOT / "terrarium.html").read_text(encoding="utf-8")
html = html.replace("__TINY_GODS_CONFIG__", json.dumps(config))
culture_patch = (ROOT / "culture_v03.js").read_text(encoding="utf-8")
spectacle_patch = (ROOT / "spectacle_v04.js").read_text(encoding="utf-8")
html = html.replace("</script></body></html>", "\n" + culture_patch + "\n" + spectacle_patch + "\n</script></body></html>")
components.html(html, height=880, scrolling=False)

with st.expander("What is actually happening under the glass?"):
    st.markdown(
        """
        Every inhabitant has energy, age, curiosity, sociability, aggression, memory and a small relationship network. They wander toward food and neighbors; cooperate or fight according to local conditions; carry resources back toward camps; form families; and occasionally transmit innovations. Dense cooperation can nucleate settlements, while successful settlements can later split into culturally related daughter communities.

        Camps develop inherited customs, sigils and diplomatic relationships. Related or compatible settlements can form pacts and exchange resources; scarcity, distance and cultural divergence can instead drive feuds. Roads strengthen through repeated trade, settlement architecture grows with population, cultural influence becomes visible on the landscape, moving weather systems cross the world, and major events persist in a world-history strip.

        The model is deliberately a **toy agent-based system**, not a scientific forecast. Its useful purpose is to make emergence legible: identical rules can create very different histories from different seeds, while identical seeds reproduce the same initial world.
        """
    )

st.caption("Built as a self-contained Streamlit showcase. No accounts, API keys, external assets or tracking required.")