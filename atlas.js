// The living atlas: one reading surface, factual history, and controls that never rerun Streamlit.
(() => {
  const wrap = document.getElementById('wrap');
  tgV7Ground=paintVillageGround;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const bar = document.createElement('div');
  bar.id = 'atlas-bar';
  bar.innerHTML = `<div class="identity"><b>The living atlas</b><small id="atlas-clock"></small></div>
    <button id="atlas-pause" aria-pressed="false">Pause</button>
    <select id="atlas-speed" aria-label="Simulation pace"><option value="0.5">½× · linger</option><option value="1" selected>1× · live</option><option value="2">2× · drift</option><option value="4">4× · ages</option></select>
    <button id="atlas-fit" title="Show the whole world">Fit world</button><button id="atlas-zoom-out" aria-label="Zoom out">−</button><button id="atlas-zoom-in" aria-label="Zoom in">+</button>
    <button id="atlas-reading" aria-pressed="true">Reading panel</button>`;
  wrap.appendChild(bar);
  const reader = document.createElement('aside');
  reader.id = 'atlas-reader'; reader.setAttribute('aria-label', 'World story');
  reader.innerHTML = `<div id="atlas-summary"></div><nav id="atlas-tabs" aria-label="Read the atlas">${['Chronicle','People','Villages','Beliefs'].map(t=>`<button data-tab="${t}" aria-selected="${t==='Chronicle'}">${t}</button>`).join('')}</nav><div id="atlas-content" tabindex="0" aria-label="Chronicle"></div><div id="atlas-footer"><button id="atlas-download">Download chronicle ↓</button></div>`;
  wrap.appendChild(reader);
  const followLabel = document.createElement('div'); followLabel.id='atlas-follow'; wrap.appendChild(followLabel);
  const note=document.createElement('div');note.id='atlas-map-note';note.textContent='DRAG TO EXPLORE  ·  CLICK A LIFE  ·  DOUBLE-CLICK A VILLAGE';wrap.appendChild(note);
  let tab='Chronicle', followed=null, previousContent='', lastRead=0;
  function sourceText(m){const s=m.source;if(typeof s==='string')return s;if(!s)return 'No source recorded';if(m.kind==='founder')return `${s.n||s.name||'The founder'} founded ${s.home?.n||m.settlement.n}.`;return s.label||[s.name||s.type,s.epithet,s.day?`day ${s.day}`:''].filter(Boolean).join(' ')||'A recorded gathering';}
  const archive=[{day:1,msg:`${CFG.population} wanderers arrived. There were no villages, no inherited stories, and no names for the gods.`}];
  // Start after initialization: developer startup notices are not events in this world's history.
  const previousLog=log;
  log=function(msg){previousLog(msg);archive.unshift({day:Math.floor(day)+1,msg});archive.length=Math.min(archive.length,500)};
  const live=()=>world.agents.filter(a=>a.alive);
  const villages=()=>world.settlements.filter(s=>!s.abandoned&&s.pop>0);
  function fit(){camera.x=0;camera.y=0;camera.z=Math.min(W/world.w,H/world.h)*.93;followed=null}
  function focus(a){if(tgV7Mode==='close')tgV7Exit();selected=a;tgSelectedSettlement=null;followed=a;camera.z=Math.max(camera.z,.95);camera.x=a.x-world.w/2;camera.y=a.y-world.h/2;document.getElementById('agentcard').classList.add('on')}
  document.getElementById('atlas-pause').onclick=()=>{paused=!paused;refresh()};
  document.getElementById('atlas-speed').onchange=e=>{CFG.speed=Number(e.target.value)};
  document.getElementById('atlas-fit').onclick=()=>{if(tgV7Mode==='close')tgV7Exit();fit()};
  for(const [id,factor] of [['atlas-zoom-in',1.2],['atlas-zoom-out',1/1.2]])document.getElementById(id).onclick=()=>{camera.z=clamp(camera.z*factor,.15,2.8)};
  document.getElementById('atlas-reading').onclick=e=>{const hidden=wrap.classList.toggle('atlas-wide');e.currentTarget.setAttribute('aria-pressed',String(!hidden));resize()};
  reader.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;reader.querySelectorAll('[data-tab]').forEach(x=>x.setAttribute('aria-selected',String(x===b)));document.getElementById('atlas-content').setAttribute('aria-label',tab);previousContent='';refresh()});
  reader.addEventListener('click',e=>{const b=e.target.closest('[data-person],[data-village]');if(!b)return;if(b.dataset.person!==undefined){const a=world.agents.find(a=>a.id===Number(b.dataset.person));if(a?.alive)focus(a)}else{const s=world.settlements.find(s=>s.id===Number(b.dataset.village));if(s&&!s.abandoned){followed=null;selected=null;tgSelectedSettlement=s;document.getElementById('agentcard').classList.remove('on');tgV7Enter(s)}}});
  followLabel.onclick=()=>{followed=null;selected=null;tgSelectedSettlement=null;document.getElementById('agentcard').classList.remove('on');followLabel.textContent=''};
  document.getElementById('atlas-download').onclick=()=>{
    const rows=[`TINY GODS · WORLD ${CFG.seed}`,`Recorded through day ${Math.floor(day)+1}`,`Starting conditions: ${JSON.stringify(CFG)}`,'','OBSERVED EVENTS (most recent 500, oldest first)',...archive.slice().reverse().map(e=>`Day ${e.day}: ${e.msg}`),'','CULTURAL BELIEFS (interpretations, not additional events)',...(world.myths||[]).map(m=>`${m.settlement.n}: ${m.text}\nRecorded source: ${sourceText(m)}`)];
    const url=URL.createObjectURL(new Blob([rows.join('\n')],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`tiny-gods-${CFG.seed}-day-${Math.floor(day)+1}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  function chapter(people,places){
    if(!people.length)return ['The last light','No living people remain. Their villages and recorded stories are what this world leaves behind.'];
    if(!places.length)return ['Before the first hearth','A shared meal, a friendship, a place to return to. Watch for the small beginnings of a village.'];
    if(world.myths?.length)return ['When events become stories','Events have become stories. Compare what people believe with the moments those beliefs grew from.'];
    if(world.births)return ['A world to inherit','Children are growing into a world their parents shaped. Follow a family and see what survives the generations.'];
    if(places.length>1)return ['Across the distance','Separate hearths now share this landscape. Customs, scarcity, and exchange will shape their relationships.'];
    return ['A place to return to','The first hearth has gathered people together. Stored food and shared knowledge may let them put down roots.'];
  }
  function refresh(){
    const people=live(),places=villages(),[title,description]=chapter(people,places);
    document.getElementById('atlas-clock').textContent=`WORLD ${CFG.seed} · DAY ${Math.floor(day)+1} · ${paused?'PAUSED':CFG.speed+'×'}`;
    const p=document.getElementById('atlas-pause');p.textContent=paused?'Resume':'Pause';p.setAttribute('aria-pressed',String(paused));
    const summary=`<div class="eyebrow">${esc(world.era)} · generation ${Math.max(0,...people.map(a=>a.generation||0))}</div><h2>${title}</h2><p>${description}</p><div class="census"><div><strong>${people.length}</strong><small>living</small></div><div><strong>${places.length}</strong><small>villages</small></div><div><strong>${world.births}</strong><small>born here</small></div></div>`;
    const summaryEl=document.getElementById('atlas-summary');if(summaryEl.innerHTML!==summary)summaryEl.innerHTML=summary;
    let content='';
    if(tab==='Chronicle')content='<div class="eyebrow" style="margin-bottom:18px">Observed · newest first · last 500</div>'+archive.map(e=>`<article class="atlas-entry"><small>DAY ${e.day}</small><p>${esc(e.msg)}</p></article>`).join('');
    if(tab==='People')content=people.map(a=>`<article class="atlas-entry"><small>GEN ${a.generation} · AGE ${Math.floor(a.age)} · ENERGY ${Math.round(a.energy*100)}%</small><h3>${esc(a.n)}</h3><p>${esc(a.home?.n||'A wanderer, without a hearth.')}<br>${esc(a.memory?.[0]||'Their story is still beginning.')}</p><button data-person="${a.id}">Follow ${esc(a.n)}</button></article>`).join('')||'<p class="empty">No living people remain. Their stories are in the chronicle.</p>';
    if(tab==='Villages')content=places.map(s=>`<article class="atlas-entry"><small>${s.pop} RESIDENTS · FOUNDED DAY ${s.foundedDay||1}</small><h3>${esc(s.n)}</h3><p>${esc(s.culture?.name||'A new community')} · ${esc(s.specialization||'commons')}<br>Food reserves ${(s.store||0).toFixed(1)}</p><button data-village="${s.id}">Enter village →</button></article>`).join('')||'<p class="empty">There are no hearths yet. Villages emerge when friendships take root; their arrival is not guaranteed.</p>';
    if(tab==='Beliefs')content=(world.myths||[]).map(m=>`<article class="atlas-entry"><small>CULTURAL BELIEF · ${esc(m.settlement.n)}</small><p>${esc(m.text)}</p><p class="source">Recorded source: ${esc(sourceText(m))}</p></article>`).join('')+'<div class="eyebrow">Lives remembered</div>'+ (world.legends||[]).slice(0,8).map(l=>`<article class="atlas-entry"><h3>${esc(l.name)} ${esc(l.epithet)}</h3><p>${esc(l.home?.n||'A life beyond the hearths')}</p></article>`).join('')+'<p class="empty">Myths are interpretations of lived events. Glowing figures on the map represent exceptional living people.</p>';
    const el=document.getElementById('atlas-content');if(content!==previousContent){el.innerHTML=content;previousContent=content}
    if(followed){followLabel.textContent=followed.alive?`Following ${followed.n} · click to release`:`${followed.n} is gone. Their story remains. · dismiss`}
    else followLabel.textContent='';
  }
  // Prevent a pan from becoming a village click; touch users get the same map interaction.
  let down=null,moved=false;
  canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,cx:camera.x,cy:camera.y};moved=false;followed=null;if(e.pointerType!=='mouse')canvas.setPointerCapture(e.pointerId)});
  canvas.addEventListener('pointermove',e=>{if(!down)return;if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>5)moved=true;if(e.pointerType!=='mouse'&&tgV7Mode==='world'){camera.x=down.cx-(e.clientX-down.x)/camera.z;camera.y=down.cy-(e.clientY-down.y)/camera.z}});
  window.addEventListener('pointerup',()=>{down=null});canvas.addEventListener('pointercancel',()=>{down=null});
  wrap.addEventListener('click',e=>{if(e.target===canvas&&moved){e.stopPropagation();moved=false}},true);
  window.addEventListener('keydown',e=>{if(e.code==='Space'&&/BUTTON|SELECT|INPUT|TEXTAREA/.test(e.target.tagName))e.stopImmediatePropagation()},true);
  new ResizeObserver(()=>resize()).observe(canvas);
  const previousDraw=draw;
  draw=function(){if(followed?.alive&&tgV7Mode==='world'){camera.x=followed.x-world.w/2;camera.y=followed.y-world.h/2}previousDraw();const now=performance.now();if(now-lastRead>500){refresh();lastRead=now}};
  resize();fit();refresh();
})();
