import json
import random
from pathlib import Path
import streamlit as st
import streamlit.components.v1 as components
ROOT=Path(__file__).parent
st.set_page_config(page_title="Tiny Gods — Agent Terrarium",page_icon="🌱",layout="wide",initial_sidebar_state="expanded")
st.markdown("""<style>.stApp{background:radial-gradient(circle at 50% -20%,#17243a 0%,#080c13 44%,#05070b 100%)}[data-testid="stSidebar"]{background:linear-gradient(180deg,#0b1019 0%,#090d14 100%);border-right:1px solid rgba(255,255,255,.08)}[data-testid="stSidebar"] *{color:#dce8e3}.block-container{padding-top:1.1rem;max-width:1600px}.tg-kicker{color:#7cf8c7;font:700 12px ui-monospace;letter-spacing:.16em}.tg-title{font:800 clamp(34px,5vw,68px)/.95 ui-sans-serif;color:#f5fff9;margin:.18rem 0 .35rem}.tg-sub{color:#9eb0aa;max-width:940px}.tg-pill{display:inline-block;padding:5px 9px;border:1px solid rgba(124,248,199,.22);border-radius:999px;color:#b9f9df;background:rgba(124,248,199,.06);font:600 11px ui-monospace;margin-right:5px}footer{visibility:hidden}</style>""",unsafe_allow_html=True)
with st.sidebar:
 st.markdown("### ⚙️ Genesis Console")
 if "seed" not in st.session_state:st.session_state.seed=73481
 seed=st.number_input("World seed",1,99999999,int(st.session_state.seed),1);a,b=st.columns(2)
 if a.button("🎲 Randomize",use_container_width=True):st.session_state.seed=random.randint(1,99_999_999);st.rerun()
 if b.button("↻ Rebirth",use_container_width=True):st.session_state.seed=int(seed);st.rerun()
 st.divider();population=st.slider("Founding population",12,90,38);cooperation=st.slider("Cooperation",0,100,68);aggression=st.slider("Aggression",0,100,22);scarcity=st.slider("Scarcity",0,100,34);innovation=st.slider("Innovation",0,100,61);climate=st.slider("Climate stability",0,100,72);speed=st.select_slider("Time flow",[0.5,1.0,2.0,4.0],1.0,format_func=lambda x:f"{x:g}×")
config={"seed":int(seed),"population":population,"cooperation":cooperation/100,"aggression":aggression/100,"scarcity":scarcity/100,"innovation":innovation/100,"climate":climate/100,"speed":speed}
st.markdown("""<div class="tg-kicker">EMERGENT SYSTEMS LAB / TERRARIUM 01</div><div class="tg-title">Tiny Gods</div><div class="tg-sub">A living civilization terrarium where wanderers become families, families become settlements, settlements become cultures, history becomes myth, and exceptional lives become gods. Descend into villages, inspect the people and built world, then climb back out to watch regions, roads, dynasties, landmarks and beliefs evolve across the long count.</div><div style="margin-top:10px"><span class="tg-pill">CLICK VILLAGE → ENTER</span><span class="tg-pill">MYTHIC FIGURES = REAL AGENTS</span><span class="tg-pill">PEOPLE · BUILDINGS · STORIES · RITUALS · TRADE</span><span class="tg-pill">ESC = RETURN</span></div>""",unsafe_allow_html=True)
html=(ROOT/"terrarium.html").read_text(encoding="utf-8").replace("__TINY_GODS_CONFIG__",json.dumps(config))
patches=["culture_v03.js","spectacle_v04.js","ages_v05.js","legends_v05.js","dynasties_v06.js","card_compat_v08.js","under_glass_v07.js","under_glass_entry_fix_v08.js","identity_v07.js","archaeology_v07.js","construction_v07.js","daily_life_v07.js","role_effects_v07.js","house_life_v07.js","rituals_v07.js","memory_myth_v08.js","myth_transmission_v08.js","pantheon_v09.js","atmosphere_v09.js","overdrive_v09.js","cinematic_v09.js","finale_v09.js"]
patch="\n".join((ROOT/p).read_text(encoding="utf-8") for p in patches);html=html.replace("</script></body></html>","\n"+patch+"\n</script></body></html>");components.html(html,height=880,scrolling=False)
with st.expander("What is actually happening under the glass?"):
 st.markdown("""Tiny Gods remains one live toy agent simulation underneath the spectacle. Individuals gather, socialize, teach, fight, form families and found camps. Settlements inherit customs, split, trade, ally, feud, build roads and accumulate history. Legends can seed dynasties; factual events can become myths; myths travel and drift; exceptional living agents are rendered as a pantheon; and Under the Glass reinterprets the same live state as a close 2.5D village.

The final showcase layer adds settlement specializations such as sanctuaries, crossroads, strongholds, archives and granaries; landmark buildings; visible kin-regions; a long-count history HUD; stronger divine silhouettes; and deeper visual continuity between God View and village life. Tiny Gods is deliberately not a scientific model—it is an emergent storytelling toy.""")
st.caption("Tiny Gods v0.9 · self-contained Streamlit showcase · procedural Canvas visuals · no external assets, accounts, API keys or tracking required.")