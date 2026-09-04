// Tiny Gods v0.8 — Memory & Myth
// Keeps factual history intact while allowing settlements to form simplified cultural memories from real events.
world.myths=world.myths||[];
world._tgV8Seen=world._tgV8Seen||new Set();

function tgV8Key(s,kind,day){return `${s.id}:${kind}:${day}`}

function tgV8Remember(s,kind,source,weight=.5){
  if(!s||s.abandoned)return;
  let key=tgV8Key(s,kind,Math.floor(day));
  if(world._tgV8Seen.has(key))return;
  world._tgV8Seen.add(key);
  s.myths=s.myths||[];
  let tones=['whispered','honored','warned','sung','kept'];
  let tone=tones[Math.floor(tgV7Seeded(s.id*919+day*13+kind.length)*tones.length)];
  let myth={settlement:s,kind,source,day:Math.floor(day)+1,weight,tone,drift:0,text:''};
  myth.text=tgV8Text(myth);
  s.myths.unshift(myth);
  s.myths=s.myths.slice(0,8);
  world.myths.unshift(myth);
  world.myths=world.myths.slice(0,40);
}

function tgV8Text(m){
  let s=m.settlement,src=m.source||{};
  if(m.kind==='founder')return `${s.n} ${m.tone} that ${src.name||'the first founder'} chose this place when the roads were still young.`;
  if(m.kind==='split')return `${s.n} ${m.tone} the Leaving, when kin carried fire away to make another home.`;
  if(m.kind==='feud')return `${s.n} ${m.tone} of the Bitter Boundary and the customs that divided neighbors.`;
  if(m.kind==='pact')return `${s.n} ${m.tone} the Joined Hands, when two camps chose road over feud.`;
  if(m.kind==='legend')return `${s.n} ${m.tone} the name of ${src.name||'an ancestor'} ${src.epithet||'the Remembered'}, whose life became a lesson.`;
  if(m.kind==='ritual')return `${s.n} ${m.tone} the ${src.label||'gathering'} as proof that the settlement endured another season.`;
  if(m.kind==='monument')return `${s.n} ${m.tone} that its ${src.type||'monument'} remembers more than stone can say.`;
  return `${s.n} keeps an old story from day ${m.day}.`;
}

function tgV8Drift(m){
  if(m.drift>=3)return;
  let age=day-m.day;
  if(age<20||tgV7Seeded(m.day*77+m.settlement.id*31+Math.floor(day/12))>.018)return;
  m.drift++;
  if(m.kind==='founder'&&m.drift===1)m.text=m.text.replace('chose this place','followed a sign to this place');
  else if(m.kind==='split'&&m.drift>=2)m.text=m.text.replace('carried fire away','carried the old fire through hardship');
  else if(m.kind==='feud'&&m.drift>=2)m.text=m.text.replace('customs that divided neighbors','oath that divided neighbors for a generation');
  else if(m.kind==='legend'&&m.drift>=2)m.text=m.text.replace('whose life became a lesson','whose deeds are said to have changed the settlement');
}

function tgV8Scan(){
  for(const s of world.settlements){
    if(s.abandoned)continue;
    s.myths=s.myths||[];
    if(s.founder)tgV8Remember(s,'founder',s.founder,.72);

    let hist=s.history||[];
    for(const h of hist.slice(0,6)){
      if(/split away|Split from/i.test(h))tgV8Remember(s,'split',{label:h},.6);
      if(/Pact with/i.test(h))tgV8Remember(s,'pact',{label:h},.55);
      if(/Feud with/i.test(h))tgV8Remember(s,'feud',{label:h},.65);
      if(/raised a|monument/i.test(h)&&s.monument)tgV8Remember(s,'monument',s.monument,.7);
    }

    for(const l of world.legends||[]){
      if(l.home===s)tgV8Remember(s,'legend',l,.8);
    }

    if(s.activeEvent){
      tgV8Remember(s,'ritual',{label:s.activeEvent.label||s.activeEvent.kind||'gathering'},.35);
    }

    for(const m of s.myths){
      tgV8Drift(m);
    }
  }
}

const tgV8BaseUpdate=update;
update=function(dt){tgV8BaseUpdate(dt);tgV8Scan()};

const tgV8BaseSettlementCard=tgSettlementCard;
tgSettlementCard=function(s){
  tgV8BaseSettlementCard(s);
  if(!s||s.abandoned)return;
  let card=document.getElementById('agentcard');
  let ms=(s.myths||[]).slice(0,3);
  if(ms.length)card.innerHTML+=`<div class="thought">MEMORY & MYTH<br>${ms.map(m=>`<span style="color:#e8d6ff">◌ ${m.text}</span>`).join('<br><br>')}</div>`;
};

function tgV8CloseOverlay(){
  if(tgV7Mode!=='close'||!tgV7Settlement)return;
  let ms=(tgV7Settlement.myths||[]);
  if(!ms.length)return;
  let m=ms[0];
  ctx.save();
  ctx.fillStyle='rgba(225,209,255,.68)';
  ctx.font='8px ui-monospace';
  let text='memory · '+m.text,words=text.split(' '),line='',y=H-92;
  for(const w of words){
    let test=line+w+' ';
    if(ctx.measureText(test).width>Math.min(520,W*.65)){
      ctx.fillText(line,22,y);
      line=w+' ';
      y+=11;
    }else line=test;
  }
  if(line)ctx.fillText(line,22,y);
  ctx.restore();
}

const tgV8BaseClose=tgV7Close;
tgV7Close=function(){tgV8BaseClose();tgV8CloseOverlay()};

log('◌ Memory separates from record: settlements can now tell stories about what actually happened.');