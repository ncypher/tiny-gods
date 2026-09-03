# 🌱 Tiny Gods

**A living agent terrarium in your browser.**

Tiny Gods is a self-contained Streamlit showcase for playing with emergence. A seeded miniature world is populated by autonomous wanderers with energy, curiosity, sociability, aggression, memory, relationships, food gathering, knowledge transfer and settlement formation.

Change the world's rules. Press rebirth. Watch history happen.

## Run it

```bash
pip install -r requirements.txt
streamlit run app.py
```

## Controls

- **Click an agent** — inspect its traits, home, thought and latest memory
- **Drag** — pan across the terrarium
- **Mouse wheel** — zoom
- **Space** — pause / resume
- **Genesis Console** — change population, cooperation, aggression, scarcity, innovation, climate stability and simulation speed

## Why Streamlit + Canvas?

Streamlit owns the host UI and rule controls. The terrarium is an embedded HTML5 Canvas simulation, which keeps the deployment trivial while allowing a much richer animated world than ordinary dashboard elements.

## Model note

Tiny Gods is a toy agent-based model for exploring emergence, not a scientific forecast. The same seed and rule settings reproduce the same initial terrain and inhabitants, making worlds easy to compare and share.

## Streamlit Community Cloud

Point Community Cloud at `app.py`. No secrets, API keys, databases, Node build or external system packages are required.

---

Built for curiosity. Break the rules and see what survives.

## v0.2 — Generations & Ghosts

The terrarium now records its own history in the landscape. Repeated movement lays down persistent footpaths; settlements develop distinct colors and territory halos; compatible adults in stable camps can have children with inherited traits and visible parentage; abandoned settlements leave ruins; and campfires glow after dark. The simulation speed control now advances the whole model rather than only the celestial clock.

Newborn agents carry a generation number, inherited social/aggression/curiosity tendencies, settlement membership, and parent references. Extinct settlements retain their name, former peak population, and physical location as ruins.
