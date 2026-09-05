// Tiny Gods v0.9 — Finale
// Settlement specializations, regional identity, landmark silhouettes, long-count framing, and richer mythic bodies.
(function(){
world.specializations=world.specializations||new Map();
world.landmarks=world.landmarks||[];
const TG_SPECS={
  sanctuary:{label:'SANCTUARY',sigil:'✣',desc:'A communal center of hearth, ritual, and kin.'},
  crossroads:{label:'CROSSROADS',sigil:'⌁',desc:'A road-bound settlement shaped by travelers and exchange.'},
  stronghold:{label:'STRONGHOLD',sigil:'▲',desc:'A compact settlement that prizes defense and resolve.'},
  archive:{label:'ARCHIVE',sigil:'✦',desc:'A place where memory, teaching, and stories accumulate.'},
  granary:{label:'GRANARY',sigil:'♨',desc:'A settlement known for stores, gardens, and provisioning.'},
  commons:{label:'COMMONS',sigil:'⌂',desc:'A balanced settlement without a single dominant calling.'}
};
function tgV9Spec(s){
  if(!s||s.abandoned)return 'commons';
  let myths=(s.myths||[]).length,learners=world.agents.filter(a=>a.alive&&a.home===s&&(a.knowledge||0)>=2).length,c=s.culture||{communal:.5,bold:.5,wandering:.5};
  if(myths>=3||learners>=2)return 'archive';
  if((s.store||0)>.72&&s.pop>=5)return 'granary';
  if(c.wandering>.67||world.caravans.some(x=>x.from===s||x.to===s))return 'crossroads';
  if(c.bold>.68)return 'stronghold';
  if(c.communal>.68)return 'sanctuary';
  return 'commons';
}
function tgV9Specialize(){
  for(const s of world.settlements){
    if(s.abandoned||s.pop<4)continue;
    let kind=tgV9Spec(s),old=world.specializations.get(s.id);
    world.specializations.set(s.id,kind);s.specialization=kind;
    if(!old&&kind!=='commons'){
      s.history?.unshift(`${s.n} became known as a ${TG_SPECS[kind].label.toLowerCase()} on day ${Math.floor(day)+1}`);
      log(`${TG_SPECS[kind].sigil} ${s.n} became known as a ${TG_SPECS[kind].label.toLowerCase()}.`);
    }
    if(!s.landmark&&s.pop>=9&&(kind!=='commons'||s.monument)){
      let names={sanctuary:'Great Hearth',crossroads:'Way Gate',stronghold:'High Watch',archive:'House of Memory',granary:'Green Court',commons:'Founders Hall'};
      s.landmark={name:names[kind]||names.commons,kind,day:Math.floor(day)+1};world.landmarks.push({settlement:s,...s.landmark});
      s.history?.unshift(`${s.landmark.name} rose on day ${s.landmark.day}`);
      log(`◆ ${s.landmark.name} rose in ${s.n}.`);
    }
  }
}
const tgFinalUpdate=update;update=function(dt){tgFinalUpdate(dt);tgV9Specialize()};
function tgFinalWorldPoint(x,y){return{x:(x-world.w/2-camera.x)*camera.z+W/2,y:(y-world.h/2-camera.y)*camera.z+H/2}}
function tgFinalLandmark(s){if(!s.landmark||typeof tgV7Mode!=='undefined'&&tgV7Mode!=='world')return;let p=tgFinalWorldPoint(s.x,s.y),z=clamp(camera.z,.55,1.6);if(p.x<-60||p.x>W+60||p.y<-70||p.y>H+70)return;ctx.save();ctx.translate(p.x,p.y);ctx.shadowBlur=13;ctx.shadowColor=`hsla(${s.hue} 80% 70% / .4)`;ctx.strokeStyle=`hsla(${s.hue} 75% 78% / .72)`;ctx.fillStyle='rgba(210,202,180,.72)';ctx.lineWidth=1.2*z;let k=s.landmark.kind;
  if(k==='stronghold'){ctx.fillRect(-5*z,-28*z,10*z,25*z);ctx.beginPath();ctx.moveTo(-7*z,-28*z);ctx.lineTo(0,-37*z);ctx.lineTo(7*z,-28*z);ctx.closePath();ctx.fill()}
  else if(k==='crossroads'){ctx.beginPath();ctx.arc(0,-15*z,8*z,Math.PI,0);ctx.stroke();ctx.fillRect(-2*z,-15*z,4*z,15*z)}
  else if(k==='archive'){ctx.fillRect(-9*z,-19*z,18*z,17*z);ctx.beginPath();ctx.moveTo(-12*z,-19*z);ctx.lineTo(0,-30*z);ctx.lineTo(12*z,-19*z);ctx.closePath();ctx.fill();ctx.fillStyle=`hsl(${s.hue} 75% 70%)`;ctx.fillRect(-2*z,-15*z,4*z,10*z)}
  else if(k==='granary'){ctx.beginPath();ctx.ellipse(0,-11*z,11*z,6*z,0,0,TAU);ctx.fill();ctx.fillRect(-11*z,-12*z,22*z,10*z);ctx.beginPath();ctx.moveTo(-13*z,-13*z);ctx.lineTo(0,-25*z);ctx.lineTo(13*z,-13*z);ctx.closePath();ctx.fill()}
  else {ctx.beginPath();ctx.arc(0,-12*z,9*z,0,TAU);ctx.stroke();ctx.fillRect(-2*z,-22*z,4*z,22*z)}
  ctx.restore();
}
function tgFinalRegions(){if(typeof tgV7Mode!=='undefined'&&tgV7Mode!=='world')return;let active=world.settlements.filter(s=>!s.abandoned&&s.pop>0&&s.culture);ctx.save();for(const root of active.filter(s=>!s.parent)){let kin=active.filter(s=>s===root||s.parent===root||s.parent?.parent===root);if(kin.length<2)continue;let pts=kin.map(s=>tgFinalWorldPoint(s.x,s.y)),cx=pts.reduce((q,p)=>q+p.x,0)/pts.length,cy=pts.reduce((q,p)=>q+p.y,0)/pts.length,rad=Math.max(...pts.map(p=>Math.hypot(p.x-cx,p.y-cy)))+34;ctx.strokeStyle=`hsla(${root.hue} 62% 66% / .10)`;ctx.setLineDash([4,10]);ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,rad,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=`hsla(${root.hue} 70% 78% / .23)`;ctx.font='8px ui-monospace';ctx.textAlign='center';ctx.fillText(`${root.culture.sigil} ${root.culture.name.toUpperCase()} KIN`,cx,cy-rad-5)}ctx.restore()}
function tgFinalHistoryHUD(){if(typeof tgV7Mode!=='undefined'&&tgV7Mode!=='world')return;let active=world.settlements.filter(s=>!s.abandoned&&s.pop>0),maxGen=world.agents.reduce((m,a)=>Math.max(m,a.generation||0),0),oldest=active.slice().sort((a,b)=>(a.foundedDay||1)-(b.foundedDay||1))[0],era=world.era||'WANDERING AGE',century=Math.floor(day/25)+1;ctx.save();let x=18,y=132,w=190,h=66;ctx.fillStyle='rgba(4,12,16,.64)';ctx.strokeStyle='rgba(255,255,255,.08)';ctx.beginPath();ctx.roundRect(x,y,w,h,12);ctx.fill();ctx.stroke();ctx.fillStyle='rgba(124,248,199,.8)';ctx.font='800 8px ui-monospace';ctx.fillText(`LONG COUNT · CYCLE ${century}`,x+10,y+15);ctx.fillStyle='rgba(230,245,238,.82)';ctx.font='9px ui-monospace';ctx.fillText(`${era} · generation ${maxGen}`,x+10,y+31);ctx.fillStyle='rgba(163,187,177,.72)';ctx.font='8px ui-monospace';ctx.fillText(`${active.length} settlements · ${world.legends?.length||0} legends · ${world.dynasties?.length||0} houses`,x+10,y+45);ctx.fillText(oldest?`oldest hearth · ${oldest.n}`:'no enduring hearth yet',x+10,y+58);ctx.restore()}
function tgFinalCloseLandmark(){if(typeof tgV7Mode==='undefined'||tgV7Mode!=='close'||!tgV7Settlement?.landmark)return;let s=tgV7Settlement,p=tgV7Proj(-112,54),k=s.landmark.kind;ctx.save();ctx.shadowBlur=16;ctx.shadowColor=`hsla(${s.hue} 80% 70% / .45)`;ctx.fillStyle='rgba(215,204,178,.92)';ctx.strokeStyle='rgba(245,232,204,.7)';ctx.lineWidth=2*p.s;if(k==='stronghold'){ctx.fillRect(p.x-10*p.s,p.y-36*p.s,20*p.s,36*p.s)}else if(k==='archive'){ctx.fillRect(p.x-18*p.s,p.y-25*p.s,36*p.s,25*p.s);ctx.beginPath();ctx.moveTo(p.x-22*p.s,p.y-25*p.s);ctx.lineTo(p.x,p.y-42*p.s);ctx.lineTo(p.x+22*p.s,p.y-25*p.s);ctx.closePath();ctx.fill()}else if(k==='crossroads'){ctx.beginPath();ctx.arc(p.x,p.y-22*p.s,16*p.s,Math.PI,0);ctx.stroke();ctx.fillRect(p.x-3*p.s,p.y-22*p.s,6*p.s,22*p.s)}else{ctx.beginPath();ctx.arc(p.x,p.y-16*p.s,13*p.s,0,TAU);ctx.stroke();ctx.fillRect(p.x-3*p.s,p.y-31*p.s,6*p.s,31*p.s)}ctx.fillStyle='rgba(245,236,214,.75)';ctx.font='8px ui-monospace';ctx.textAlign='center';ctx.fillText(s.landmark.name.toUpperCase(),p.x,p.y+14*p.s);ctx.restore()}
const tgFinalClose=tgV7Close;tgV7Close=function(){tgFinalClose();tgFinalCloseLandmark()};
// Stronger mythic silhouettes: give pantheon entities shoulders, crown/antlers, and a trailing mantle.
const tgFinalDeity=tgV9DrawDeity;tgV9DrawDeity=function(d,i){tgFinalDeity(d,i);let a=d.agent,p=tgV9WorldPoint(a),ar=d.arch;if(p.x<-90||p.x>W+90||p.y<-100||p.y>H+100)return;let bob=Math.sin(performance.now()*.002+a.id)*3;ctx.save();ctx.translate(p.x,p.y-23+bob);ctx.strokeStyle=`hsla(${ar.hue} 90% 82% / .68)`;ctx.fillStyle=`hsla(${ar.hue} 72% 42% / .20)`;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-7,4);ctx.quadraticCurveTo(-15,15,-10,27);ctx.lineTo(0,20);ctx.lineTo(10,27);ctx.quadraticCurveTo(15,15,7,4);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-4,-10);ctx.lineTo(-10,-18);ctx.moveTo(4,-10);ctx.lineTo(10,-18);ctx.stroke();ctx.restore()};
const tgFinalDraw=draw;draw=function(){tgFinalDraw();tgFinalRegions();for(const s of world.settlements)if(!s.abandoned&&s.pop>0)tgFinalLandmark(s);/* Reading panel owns the history summary. */};
log('◆ The long count begins: settlements specialize, landmark buildings rise, kin-regions become visible, and the world reads its own deep history.');
})();