const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createSimulationClock}=require('./clock.js');
function run(fps,speed=1){const c=createSimulationClock(1/60);let count=0;for(let i=0;i<fps*10;i++)c.advance(1/fps,speed,false,()=>count++);return count;}
test('equal simulated time at 30, 60 and 144 FPS',()=>{for(const fps of [30,60,144])assert.equal(run(fps),600)});
test('pace changes advance simulation without resetting it',()=>{assert.equal(run(30,4),2400);assert.equal(run(144,.5),300)});
test('pause does not accrue hidden time',()=>{const c=createSimulationClock(1/60);let n=0;c.advance(100,4,true,()=>n++);c.advance(1/60,1,false,()=>n++);assert.equal(n,1)});
test('visibility reset discards partial step',()=>{const c=createSimulationClock(1/60);let n=0;c.advance(1/120,1,false,()=>n++);c.reset();c.advance(1/120,1,false,()=>n++);assert.equal(n,0)});
