# The living atlas update

Tiny Gods now has one reading panel for the chronicle, people, villages, and beliefs. Follow a person, enter a settlement, pause, change pace, fit the map, or hide the panel without restarting the simulation. The sidebar applies starting conditions only when you explicitly begin a world.

The procedural coastline and terrain are cached at higher detail; villages gain a layered landscape. The chronicle keeps the latest 500 events and exports a text record (not a save game). Beliefs display their source separately. Mythic figures now require lived achievements, rather than appearing solely from starting personality scores.

Simulation updates use fixed 60 Hz steps, independent of display refresh rate. Hungry agents seek available food before socializing. Founding history preserves the actual founder, and the city-age transition is reachable.

Run: `python -m streamlit run app.py`

Checks: `node --test test_clock.cjs`

`terrarium.py` owns the explicit layer order and assembles the self-contained browser app. `clock.js` and `landscape.js` provide isolated helpers; `atlas.js` and `atlas.css` own the new presentation. The historical simulation layers remain in place. Fixed steps improve consistency, but this is not a claim of complete replay determinism: some older visual layers also maintain derived state.

---

# 🌱 Tiny Gods

**A living civilization terrarium in your browser.**

Tiny Gods is a self-contained Streamlit showcase for emergence, history, culture and myth. A seeded miniature world begins with autonomous wanderers. They gather food, form relationships, teach, fight, found settlements, raise children, split into daughter communities, trade, build roads, remember legends, form dynasties and slowly turn real events into stories about themselves.

Then you can descend **Under the Glass** and walk into the same settlement as a close 2.5D village.

## Run it

```bash
pip install -r requirements.txt
streamlit run app.py
```

## Controls

- **Click an agent** — inspect traits, home, thought, memory and lineage
- **Click a settlement** — select it and expose **ENTER VILLAGE**
- **Double-click a settlement** — shortcut into Under the Glass
- **Inside a village** — inspect **People / Buildings / Stories / Rituals / Trade**
- **Esc** — return to God View
- **Drag / wheel** — pan and zoom
- **Space** — pause / resume
- **Genesis Console** — change population, cooperation, aggression, scarcity, innovation, climate stability and time flow

## What emerges

Tiny Gods layers systems rather than scripting a story. Individuals become families; families seed settlements; settlements inherit culture and architecture; neighboring communities trade, ally or feud; repeated trade becomes roads; successful communities split and migrate; influential lives become legends; legends can seed houses and dynasties; factual history becomes cultural memory; memory travels between kin and trade partners and drifts into myth.

In v0.9, unusually consequential **living** agents can also appear as fictional mythic archetypes—the world's emergent pantheon. The pantheon is not a separate cast: the glowing divine figure is still the underlying agent. Cultures may later attribute ordinary historical deeds to divine intervention, preserving a deliberate gap between **what happened** and **what people say happened**.

## Under the Glass

Settlement close view is generated from the same live state as the world map. Population controls how much is built; culture shapes architecture; prosperity affects detail; houses leave compounds; monuments and later landmarks persist; gardens, fences, hearths, markets, roads, caravans, construction, ruins, weather and role-based villagers make the settlement readable as a place with a past.

Residents have visible daily roles such as builder, trader, keeper, traveler and teacher. Those roles have intentionally weak feedback into the simulation so the street scene is not merely decorative.

## v0.9 — The Pantheon / Overdrive

- Mythic visual archetypes for high-impact living agents
- Domain-specific divine effects and a Living Pantheon ledger
- Tiny humanoid villagers with role colors and house marks
- Miniature village skylines, smoke and windows visible in God View
- Visible omens tied to divine-attribution stories
- Settlement specializations: Sanctuary, Crossroads, Stronghold, Archive, Granary and Commons
- Landmark buildings such as Great Hearths, Way Gates, High Watches and Houses of Memory
- Visible kin-regions and a Long Count world-history HUD
- Village inspection tabs for People, Buildings, Stories, Rituals and Trade

## v0.8 — Memory & Myth

Settlements preserve factual history separately from cultural memory. Founders, migrations, pacts, feuds, legends, monuments and rituals can become stories. Stories can travel through kinship and trade, with wording and interpretation slowly diverging from a common historical root.

## v0.7 — Under the Glass

God View gained a settlement-scale 2.5D mode. Villages expose architecture, civic spaces, caravans, weather, daily life, construction, archaeology, dynasty compounds and local events while remaining synchronized with the same world simulation.

## Earlier evolution

- **v0.6 — Dynasties & Echoes:** legends can seed houses and inherited prestige.
- **v0.5 — Ages & Legends:** Wandering, Hearth, Clan, Road and City ages; monuments and remembered dead.
- **v0.4 — Spectacle & Memory:** roads, influence fields, moving weather and persistent world history.
- **v0.3 — Culture & Kin:** inherited customs, migration splits, diplomacy and trade caravans.
- **v0.2 — Generations & Ghosts:** children, inheritance, trails, ruins and campfires.

## Why Streamlit + Canvas?

Streamlit owns the host UI and Genesis Console. The terrarium is an embedded HTML5 Canvas simulation, which keeps deployment trivial while allowing a much richer animated world than ordinary dashboard components. No Node build, database, API key, secret or external asset pipeline is required.

## Model note

Tiny Gods is a toy agent-based system and emergent storytelling experiment, not a scientific forecast. A given seed and rule set reproduce the same initial world, which makes different civilizations easy to compare and share.

---

**Change the rules. Press rebirth. Watch history become myth.**
