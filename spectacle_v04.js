// Tiny Gods v0.4 — Spectacle & Memory
// Visual civilization layer: architecture, banners, roads, influence, moving weather, and world history.
world.timeline=world.timeline||[]; world.roadStrength=world.roadStrength||new Map();
world.weather=world.weather||Array.from({length:5},(_,i)=>({x:rr(-300,world.w),y:rr(80,world.h-80),vx:rr(7,15),vy:rr(-2,2),r:rr(120,230),wet:rr(.25,1),phase:rr(0,TAU),id:i}));

const tgV4Style=document.createElement('style');
tgV4Style.textContent=`
#historyStrip{position:absolute;left:50%;transform:translateX(-50%);bottom:104px;width:min(720px,70vw);height:44px;border-radius:14px;padding:7px 10px;overflow:hidden;pointer-events:none}
#historyStrip .ttl{font:800 8px ui-monospace,monospace;letter-spacing:.14em;color:#7cf8c7;margin-bottom:4px}
#historyStrip .rail{display:flex;gap:8px;align-items:center;white-space:nowrap;overflow:hidden}
#historyStrip .tick{font:9px ui-monospace,monospace;color:#94aaa0;padding-left:8px;border-left:1px solid rgba(255,255,255,.12)}
#historyStrip .tick b{color:#dfffee;font-weight:700}
@media(max-width:800px){#historyStrip{display:none}}
`;
document.head.appendChild(tgV4Style);
const tgV4Hist=document.createElement('div');tgV4Hist.id='historyStrip';tgV4Hist.className='glass';tgV4Hist.innerHTML='<div class="ttl">WORLD HISTORY</div><div class="rail" id="historyRail"></div>';document.getElementById('wrap').appendChild(tgV4Hist);

function tgV4Major(msg){return /Founded|born|split|pact|feud|Trade reached|collapsed|abandoned|culture|storm/i.test(msg)}
const tgV4BaseLog=log;
log=function(msg){tgV4BaseLog(msg);if(tgV4Major(msg)){world.timeline.unshift({day:Math.floor(day)+1,msg});world.timeline=world.timeline.slice(0,10)}};
world.timeline.unshift({day:1,msg:`Genesis ${CFG.seed}`});

function tgV4RoadKey(a,b){let x=Math.min(a.id,b.id),y=Math.max(a.id,b.id);return `${x}:${y}`}
function tgV4UpdateRoads(dt){
  for(const c of world.caravans||[]){if(c.kind!=='trade')continue;let k=tgV4RoadKey(c.from,c.to),v=world.roadStrength.get(k)||0;world.roadStrength.set(k,clamp(v+dt*.012,0,1))}
  for(const [k,v] of [...world.roadStrength])world.roadStrength.set(k,Math.max(.08,v-dt*.00012));
}
function tgV4UpdateWeather(dt){
  for(const w of world.weather){w.x+=w.vx*dt;w.y+=w.vy*dt+Math.sin(simT*.06+w.phase)*.08;if(w.x-w.r>world.w+300){w.x=-w.r-250;w.y=rr(90,world.h-90);w.wet=rr(.25,1)}}
}
const tgV4BaseUpdate=update;
update=function(dt){tgV4BaseUpdate(dt);tgV4UpdateRoads(dt);tgV4UpdateWeather(dt)};

function tgV4WorldTransform(){ctx.translate(W/2,H/2);ctx.scale(camera.z,camera.z);ctx.translate(-world.w/2-camera.x,-world.h/2-camera.y)}
function tgV4Influence(){
  const active=world.settlements.filter(s=>!s.abandoned&&s.pop>0&&s.culture);
  ctx.save();tgV4WorldTransform();
  for(const s of active){let r=55+Math.sqrt(Math.max(1,s.pop))*15;let g=ctx.createRadialGradient(s.x,s.y,8,s.x,s.y,r);g.addColorStop(0,`hsla(${s.hue} 82% 58% / .08)`);g.addColorStop(.72,`hsla(${s.hue} 82% 58% / .035)`);g.addColorStop(1,`hsla(${s.hue} 82% 58% / 0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(s.x,s.y,r,0,TAU);ctx.fill();ctx.strokeStyle=`hsla(${s.hue} 75% 70% / .12)`;ctx.setLineDash([3,10]);ctx.beginPath();ctx.arc(s.x,s.y,r*.78,0,TAU);ctx.stroke();}
  ctx.restore();
}
function tgV4Roads(){
  ctx.save();tgV4WorldTransform();
  for(let i=0;i<world.settlements.length;i++)for(let j=i+1;j<world.settlements.length;j++){
    let a=world.settlements[i],b=world.settlements[j];if(a.abandoned||b.abandoned||a.pop<1||b.pop<1)continue;let rel=tgRel(a,b),strength=world.roadStrength.get(tgV4RoadKey(a,b))||0;if(rel<.54&&strength<.12)continue;
    let alpha=.08+strength*.34+Math.max(0,rel-.54)*.18;ctx.strokeStyle=`rgba(219,187,126,${alpha})`;ctx.lineWidth=.7+strength*2.6;ctx.setLineDash(strength>.5?[]:[5,8]);ctx.beginPath();ctx.moveTo(a.x,a.y);let mx=(a.x+b.x)/2,my=(a.y+b.y)/2-25-Math.sin((a.id+b.id)*1.7)*18;ctx.quadraticCurveTo(mx,my,b.x,b.y);ctx.stroke();
  }
  ctx.restore();
}
function tgV4Buildings(){
  ctx.save();tgV4WorldTransform();
  for(const s of world.settlements){if(s.abandoned||s.pop<1||!s.culture)continue;let tier=s.pop>=18?3:s.pop>=9?2:1, huts=Math.min(9,2+Math.floor(s.pop/3));
    for(let i=0;i<huts;i++){let an=i*2.399+s.id*.71,d=11+(i%3)*8+(tier-1)*2,x=s.x+Math.cos(an)*d,y=s.y+Math.sin(an)*d;ctx.save();ctx.translate(x,y);ctx.fillStyle=`hsla(${s.hue} 36% ${tier===3?62:54}% / .85)`;ctx.strokeStyle='rgba(10,15,14,.45)';ctx.lineWidth=.8;ctx.beginPath();ctx.rect(-3,-2.5,6,5);ctx.fill();ctx.stroke();ctx.fillStyle='rgba(230,215,170,.7)';ctx.beginPath();ctx.moveTo(-4,-2.5);ctx.lineTo(0,-6);ctx.lineTo(4,-2.5);ctx.closePath();ctx.fill();ctx.restore()}
    // banner
    let bh=17+tier*4;ctx.strokeStyle='rgba(225,235,226,.55)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(s.x+7,s.y-4);ctx.lineTo(s.x+7,s.y-bh);ctx.stroke();ctx.fillStyle=`hsla(${s.hue} 86% 68% / .9)`;ctx.beginPath();ctx.moveTo(s.x+7,s.y-bh);ctx.lineTo(s.x+20,s.y-bh+3);ctx.lineTo(s.x+7,s.y-bh+7);ctx.closePath();ctx.fill();ctx.fillStyle='#08110d';ctx.font='bold 7px ui-monospace';ctx.fillText(s.culture.sigil,s.x+9,s.y-bh+6);
    if(tier===3){ctx.strokeStyle=`hsla(${s.hue} 90% 76% / .25)`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(s.x,s.y,46,0,TAU);ctx.stroke()}
  }
  ctx.restore();
}
function tgV4WeatherDraw(){
  ctx.save();tgV4WorldTransform();
  for(const w of world.weather){let storm=w.wet>(.48+CFG.climate*.36);let alpha=storm?.10:.045;let g=ctx.createRadialGradient(w.x,w.y,12,w.x,w.y,w.r);g.addColorStop(0,`rgba(${storm?'95,118,132':'180,205,211'},${alpha})`);g.addColorStop(1,'rgba(120,150,160,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(w.x,w.y,w.r,w.r*.52,0,0,TAU);ctx.fill();
    if(storm){ctx.strokeStyle=`rgba(155,205,230,${.08+w.wet*.06})`;ctx.lineWidth=.7;for(let i=0;i<10;i++){let rx=w.x+(hash(i+w.id*17,Math.floor(simT*.07))*2-1)*w.r*.65,ry=w.y+(hash(i*3+w.id,17)*2-1)*w.r*.28;ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-5,ry+13);ctx.stroke()}}
  }
  ctx.restore();
}
function tgV4Timeline(){let rail=document.getElementById('historyRail');if(!rail)return;rail.innerHTML=world.timeline.slice(0,6).map(e=>`<span class="tick"><b>D${e.day}</b> ${e.msg.replace(/[<>]/g,'')}</span>`).join('')}
function tgV4Draw(){tgV4Influence();tgV4Roads();tgV4Buildings();tgV4WeatherDraw();tgV4Timeline()}
const tgV4BaseDraw=draw;draw=function(){tgV4BaseDraw();tgV4Draw()};
log('☼ The world grows visible: banners rise, roads remember trade, and weather crosses the glass.');