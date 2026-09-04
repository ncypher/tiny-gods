// Tiny Gods v0.7 — Role Effects
// Gives street-level roles small but real consequences in the simulation.
world._tgV7RolePulse=world._tgV7RolePulse||new Map();
function tgV7RoleCounts(s){let out={builder:0,trader:0,keeper:0,traveler:0,teacher:0,resident:0};for(const a of world.agents){if(!a.alive||a.home!==s)continue;let r=tgV7Role(a,s);out[r]=(out[r]||0)+1}return out}
function tgV7RoleEffects(dt){for(const s of world.settlements){if(s.abandoned||s.pop<1)continue;let c=tgV7RoleCounts(s),n=Math.max(1,s.pop),scale=dt/n;
  // Builders shorten active project durations very gently.
  if(c.builder&&typeof tgV7BuildState==='function'){let st=tgV7BuildState(s);for(const p of st.projects||[]){if(p.kind!=='hut'&&p.kind!=='civic')continue;p.start-=scale*c.builder*.018}}
  // Traders improve settlement stores and make incoming trade slightly more valuable.
  if(c.trader){s.store=clamp((s.store||0)+scale*c.trader*.0009,0,2);for(const car of world.caravans||[]){if(car.kind==='trade'&&car.to===s&&car.cargo!=null)car.cargo=clamp(car.cargo+scale*c.trader*.0006,0,.35)}}
  // Hearth keepers stabilize communal culture and soften aggressive drift a little.
  if(c.keeper&&s.culture){s.culture.communal=clamp(s.culture.communal+scale*c.keeper*.00045,0,1);s.culture.bold=clamp(s.culture.bold-scale*c.keeper*.00016,0,1)}
  // Teachers very slowly lift low-knowledge residents toward the settlement's knowledgeable peers.
  if(c.teacher){let learners=world.agents.filter(a=>a.alive&&a.home===s&&a.knowledge<3);for(const a of learners){if(R()<scale*c.teacher*.0009)a.knowledge=Math.min(3,a.knowledge+1)}}
  // Travelers slightly strengthen non-hostile nearby relations as contact accumulates.
  if(c.traveler){for(const o of world.settlements){if(o===s||o.abandoned||o.pop<1)continue;let d=Math.hypot(s.x-o.x,s.y-o.y);if(d>620)continue;let rel=tgRel(s,o);if(rel<-.35)continue;tgSetRel(s,o,clamp(rel+scale*c.traveler*.0005,-1,1))}}
  s.roleEconomy=c;
}}
const tgV7RoleEffectsBaseUpdate=update;update=function(dt){tgV7RoleEffectsBaseUpdate(dt);tgV7RoleEffects(dt)};
function tgV7EffectSummary(s){if(!s?.roleEconomy)return;let c=s.roleEconomy,parts=[];if(c.builder)parts.push(`⚒ build ${c.builder}`);if(c.trader)parts.push(`⇄ trade ${c.trader}`);if(c.teacher)parts.push(`✦ teach ${c.teacher}`);if(c.keeper)parts.push(`🔥 keep ${c.keeper}`);if(c.traveler)parts.push(`⌁ roam ${c.traveler}`);if(!parts.length)return;ctx.save();ctx.font='8px ui-monospace';ctx.fillStyle='rgba(185,248,219,.72)';ctx.fillText(`role effects · ${parts.join('  ')}`,22,108);ctx.restore()}
const tgV7RoleEffectsBaseClose=tgV7Close;tgV7Close=function(){tgV7RoleEffectsBaseClose();tgV7EffectSummary(tgV7Settlement)};
log('↯ Daily life now feeds back into the world: work, trade, teaching, tending and travel have small consequences.');