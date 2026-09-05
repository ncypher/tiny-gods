"""Streamlit host. Genesis is committed explicitly; live controls stay in the world."""
import random

import streamlit as st
import streamlit.components.v1 as components

from terrarium import build_html

st.set_page_config(page_title="Tiny Gods · The living atlas", page_icon="🌿", layout="wide", initial_sidebar_state="collapsed")
st.markdown("""<style>
.stApp{background:#0d181c;color:#e6e7da}
[data-testid="stSidebar"]{background:#122126}
.block-container{padding-top:3.5rem;padding-bottom:0;max-width:1800px}
.tg-heading{display:flex;align-items:baseline;gap:20px;margin-bottom:12px;border-bottom:1px solid #ffffff18;padding-bottom:14px}
.tg-heading h1{font:normal 38px Georgia,serif;color:#f0e8d1;margin:0;padding:0}
.tg-heading p{font:13px/1.5 system-ui;color:#9dafad;margin:0}
@media(max-width:650px){.tg-heading{display:block}.tg-heading h1{font-size:30px}.block-container{padding-left:12px;padding-right:12px}}
</style>""", unsafe_allow_html=True)

if "genesis" not in st.session_state:
    st.session_state.genesis = dict(seed=73481, population=38, cooperation=.68, aggression=.22, scarcity=.34, innovation=.61, climate=.72, speed=1.0, incarnation=0)

with st.sidebar:
    st.title("Shape a beginning")
    st.caption("These are starting conditions, not commands. People will make their own history.")
    current = st.session_state.genesis
    with st.form("genesis_form"):
        seed = st.number_input("World seed", 1, 99_999_999, current["seed"])
        population = st.slider("Founding population", 12, 90, current["population"])
        weights = {}
        for key, label, help_text in [
            ("cooperation", "Cooperation", "More inclination to form friendships, share, and build families."),
            ("aggression", "Aggression", "Greater likelihood of conflict between neighbors."),
            ("scarcity", "Scarcity", "Less replenishment and more pressure to find food."),
            ("innovation", "Curiosity", "More exploration and opportunities to learn."),
            ("climate", "Climate stability", "Fewer disruptive weather events."),
        ]:
            weights[key] = st.slider(label, 0, 100, round(current[key] * 100), help=help_text) / 100
        st.caption("Beginning again replaces the current world. Download its chronicle first if you want to keep its story.")
        begin = st.form_submit_button("Begin this world", use_container_width=True, type="primary")
        surprise = st.form_submit_button("Begin with a surprise seed", use_container_width=True)
    if begin or surprise:
        st.session_state.genesis = dict(seed=random.randint(1, 99_999_999) if surprise else int(seed), population=population, **weights, speed=1.0, incarnation=current["incarnation"] + 1)
    st.caption("Pause, pace, zoom, and reading controls are inside the atlas. Editing this form does not interrupt the running world.")

st.markdown('<div class="tg-heading"><h1>Tiny Gods</h1><p>THE LIVING ATLAS &nbsp; / &nbsp; First they survive. Then they remember. Eventually, they believe.</p></div>', unsafe_allow_html=True)
components.html(build_html(st.session_state.genesis), height=880, scrolling=False)
with st.expander("A small guide to a long history"):
    st.markdown("""Start by following a person. Food, friendship, and curiosity shape their days; shared lives can become villages. Enter a village to watch the same residents up close.

The **Chronicle** records events as they occur. **People** lets you follow a living individual; **Villages** takes you to a settlement. **Beliefs** separates cultural stories from their recorded sources. No particular ending is promised.

Use **Pause** to read, change the pace without restarting, or hide the reading panel for a quiet view. Open the sidebar to shape a new beginning. Space pauses the world; Escape returns from a village. Download the chronicle before beginning again—it is a story record, not a saved game.

This is a procedural storytelling toy, not a scientific civilization model. Everything runs locally in your browser; no API keys or external artwork are needed.""")
