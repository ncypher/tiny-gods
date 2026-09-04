# Under the Glass

`v0.7-under-the-glass` introduces a second visual representation of the same Tiny Gods simulation state.

## Entering a settlement

Double-click an active settlement in god view. The renderer descends into a 2.5D close view without spawning a second simulation.

The close view derives its scene from live settlement state:

- population controls the number of visible structures and inhabitants
- culture controls banner identity and settlement labeling
- dynasties tint visible house members
- monuments appear when the settlement actually raised one
- founder information is preserved
- food stores remain visible in the settlement readout
- day/night follows the world clock

Press `Esc` or use **RETURN TO WORLD** to leave close view.

## Design constraint

Under the Glass should remain a visualization layer over the real world model. New close-view features should prefer projecting existing state rather than creating disconnected decorative state.
