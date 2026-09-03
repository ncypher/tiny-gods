// Tiny Gods v0.3 — Culture & Kin
// Injected into the terrarium script so it shares the simulation's lexical world.
const TG_CULTURES=['Ember Rite','Moss Covenant','Open Hand','Wayfarer Kin','Stone Memory','River Oath','Lantern Folk','Quiet Root','Sky Mark','Hearth Circle'];
const TG_SIGILS=['◇','△','○','✦','⌁','⊙','⋔','⋈','☼','⌂'];
world.splits=world.splits||0; world.pacts=world.pacts||0; world.feuds=world.feuds||0;

function tgCulture(parent=null){
  if(parent){return {
    name:R()<.72?parent.name:TG_CULTURES[Math.floor(R()*TG_CULTURES.length)],
    sigil:R()<.82?parent.sigil:TG_SIGILS[Math.floor(R()*TG_SIGILS.length)],
    communal:clamp(parent.communal+rr(-.14,.14),0,1),
    bold:clamp(parent.bold+rr(-.14,.14),0,1),
    wandering:clamp(parent.wandering+rr(-.16,.16),0,1)
  }}
  return {name:TG_CULTURES[Math.floor(R()*TG_CULTURES.length)],sigil:TG_SIGILS[Math.floor(R()*TG_SIGILS.length)],communal:rr(.25,.9),bold:rr(.15,.85),wandering:rr(.15,.85)};
}
function tgDecorate(s,parent=null){
  if(s.culture)return s;
  s.culture=tgCulture(parent?parent.culture:null); s.parent=parent||null; s.relations=new Map(); s.foundedDay=Math.floor(day)+1; s.lastSplitDay=day;
  log(`◈ ${s.n} keeps ${s.culture.sigil} ${s.culture.name}: ${s.culture.communal>.62?'sharing':s.culture.bold>.62?'boldness':'wandering'} shapes the camp.`);
  return s;
}
function tgRel(a,b){return !a||!b||a===b?0:(a.relations?.get(b.id)??0)}
function tgSetRel(a,b,v){if(!a.relations)a.relations=new Map();if(!b.relations)b.relations=new Map();v=clamp(v,-1,1);a.relations.set(b.id,v);b.relations.set(a.id,v)}
function tgSimilarity(a,b){return 1-(Math.abs(a.culture.communal-b.culture.communal)+Math.abs(a.culture.bold-b.culture.bold)+Math.abs(a.culture.wandering-b.culture.wandering))/3}
function tgSite(s){for(let i=0;i<90;i++){let an=rr(0,TAU),d=rr(190,370),x=s.x+Math.cos(an)*d,y=s.y+Math.sin(an)*d;if(x>60&&x<world.w-60&&y>60&&y<world.h-60&&isLand(x,y)&&world.settlements.every(o=>o===s||o.abandoned||Math.hypot(o.x-x,o.y-y)>145))return{x,y}}return null}
function tgSplit(s){
  if(s.abandoned||s.pop<10||day-(s.lastSplitDay||0)<18)return;
  let pressure=s.pop/18+CFG.scarcity*.45+s.culture.wandering*.35;if(R()>.004*pressure)return;
  let site=tgSite(s);if(!site)return;
  let members=world.agents.filter(a=>a.alive&&a.home===s).sort((a,b)=>(b.curious+b.social*.2)-(a.curious+a.social*.2));
  let migrants=members.slice(0,Math.min(5,Math.max(3,Math.floor(s.pop*.28))));if(migrants.length<3)return;
  let child={id:world.settlements.length,n:name()+' '+(['Reach','Vale','Ford','Rest','Watch'][Math.floor(R()*5)]),x:site.x,y:site.y,pop:migrants.length,store:Math.min(.35,s.store*.22),age:0,hue:(s.hue+Math.floor(rr(-28,29))+360)%360,peak:migrants.length,abandoned:false};
  tgDecorate(child,s);s.store=Math.max(0,s.store-child.store);world.settlements.push(child);
  for(const a of migrants){a.home=child;addMemory(a,`Left ${s.n} to found ${child.n}`)}
  s.lastSplitDay=day;world.splits++;tgSetRel(s,child,.55);
  log(`⇢ ${child.n} split from ${s.n}; ${child.culture.sigil} ${child.culture.name} traveled with them.`);
}
function tgDiplomacy(dt){
  let active=world.settlements.filter(s=>!s.abandoned&&s.pop>0&&s.culture);
  for(let i=0;i<active.length;i++)for(let j=i+1;j<active.length;j++){
    let a=active[i],b=active[j],dist=Math.hypot(a.x-b.x,a.y-b.y);if(dist>620)continue;
    let old=tgRel(a,b),sim=tgSimilarity(a,b),kin=(a.parent===b||b.parent===a||a.parent&&a.parent===b.parent)?.18:0;
    let drift=((sim-.5)*.035+kin-CFG.scarcity*.018*(a.culture.bold+b.culture.bold))*dt,v=clamp(old+drift,-1,1);tgSetRel(a,b,v);
    if(old<.62&&v>=.62){world.pacts++;log(`⋈ ${a.n} and ${b.n} formed a pact between ${a.culture.name} and ${b.culture.name}.`)}
    if(old>-.58&&v<=-.58){world.feuds++;log(`⚔ ${a.n} and ${b.n} entered a feud over land and custom.`)}
  }
}

const tgBaseUpdate=update;
update=function(dt){
  tgBaseUpdate(dt);
  for(const s of world.settlements)tgDecorate(s,s.parent||null);
  for(const s of [...world.settlements])tgSplit(s);
  tgDiplomacy(dt);
  // Culture slowly shapes behavior without erasing individual variation.
  for(const a of world.agents){if(!a.alive||!a.home?.culture)continue;let c=a.home.culture,k=Math.min(.0018*dt,1);a.social=lerp(a.social,c.communal,k);a.aggro=lerp(a.aggro,c.bold*.72,k);a.curious=lerp(a.curious,c.wandering,k)}
};

function tgOverlay(){
  ctx.save();ctx.translate(W/2,H/2);ctx.scale(camera.z,camera.z);ctx.translate(-world.w/2-camera.x,-world.h/2-camera.y);
  for(let i=0;i<world.settlements.length;i++)for(let j=i+1;j<world.settlements.length;j++){
    let a=world.settlements[i],b=world.settlements[j];if(a.abandoned||b.abandoned||a.pop<1||b.pop<1||!a.culture||!b.culture)continue;
    let rel=tgRel(a,b);if(Math.abs(rel)<.28)continue;ctx.save();ctx.setLineDash(rel>0?[8,7]:[2,8]);ctx.lineWidth=.8+Math.abs(rel)*1.4;ctx.strokeStyle=rel>0?`rgba(120,235,201,${.12+.2*Math.abs(rel)})`:`rgba(255,105,91,${.12+.22*Math.abs(rel)})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.restore();
  }
  for(const s of world.settlements){if(s.pop<1||!s.culture)continue;let rad=15+Math.sqrt(s.pop)*4;ctx.font='bold 13px ui-monospace';ctx.fillStyle=`hsla(${s.hue} 85% 78% / .9)`;ctx.fillText(s.culture.sigil,s.x-rad-2,s.y-rad-26);ctx.font='8px ui-monospace';ctx.fillStyle='rgba(205,231,219,.65)';ctx.fillText(s.culture.name,s.x-rad+14,s.y-rad-27)}
  ctx.restore();
  let alive=world.agents.filter(a=>a.alive).length,camps=world.settlements.filter(s=>s.pop>0).length;
  document.getElementById('stats').innerHTML=[['DAY',Math.floor(day)+1],['ALIVE',alive],['CAMPS',camps],['SPLITS',world.splits],['PACTS',world.pacts],['FEUDS',world.feuds]].map(([k,v])=>`<div class="stat glass"><small>${k}</small><strong>${v}</strong></div>`).join('');
  if(selected?.home?.culture){let meta=document.querySelector('#agentcard .meta');if(meta&&!meta.dataset.culture){meta.dataset.culture='1';meta.innerHTML+=`<br><span style="color:#b9f9df">${selected.home.culture.sigil} ${selected.home.culture.name}</span>`}}
}
const tgBaseDraw=draw;draw=function(){tgBaseDraw();tgOverlay()};
log('◈ Culture awakens: camps can now inherit customs, split, ally, and feud.');