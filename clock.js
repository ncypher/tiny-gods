// Pure clock: rendering, focus, and reading never consume the simulation random stream.
function createSimulationClock(step) {
  let remainder = 0;
  return {
    advance(elapsed, speed, paused, update) {
      if (paused) return 0;
      remainder += Math.max(0, elapsed) * speed;
      let ticks = 0;
      while (remainder + 1e-10 >= step) {
        update(step);
        remainder = Math.max(0, remainder - step);
        ticks++;
      }
      return ticks;
    },
    reset() { remainder = 0; }
  };
}
if (typeof module !== 'undefined') module.exports = { createSimulationClock };
