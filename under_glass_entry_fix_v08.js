// Tiny Gods v0.8 — Under the Glass entry fix
// Makes settlement entry explicit and resilient to later card renderers.
(function(){
  const style=document.createElement('style');
  style.textContent=`
    #tg-enter-dock{position:absolute;right:18px;bottom:92px;z-index:80;display:none;width:270px;padding:12px;border:1px solid rgba(124,248,199,.34);border-radius:15px;background:rgba(5,15,17,.94);box-shadow:0 10px 35px rgba(0,0,0,.38);backdrop-filter:blur(10px)}
    #tg-enter-dock .tg-place{font:800 11px ui-monospace,monospace;color:#eafff6;margin-bottom:4px}
    #tg-enter-dock .tg-help{font:8px/1.35 ui-monospace,monospace;color:#8fa9a0;margin-bottom:9px}
    #tg-enter-dock button,.tg-enter-settlement{display:block;width:100%;border:1px solid rgba(124,248,199,.38);background:rgba(18,62,51,.95);color:#d7ffef;border-radius:10px;padding:10px 12px;font:900 10px ui-monospace,monospace;letter-spacing:.08em;cursor:pointer}
    #tg-enter-dock button:hover,.tg-enter-settlement:hover{background:rgba(27,88,70,.98)}
    .tg-enter-settlement{margin-top:10px}
  `;
  document.head.appendChild(style);

  const dock=document.createElement('div');
  dock.id='tg-enter-dock';
  dock.innerHTML='<div class="tg-place" id="tg-enter-place">SETTLEMENT SELECTED</div><div class="tg-help">This is a village. Enter to descend from the world map into its close 2.5D view.</div><button id="tg-enter-now">⌂ ENTER VILLAGE</button>';
  document.getElementById('wrap').appendChild(dock);

  let dockSettlement=null;
  document.getElementById('tg-enter-now').onclick=function(ev){
    ev.preventDefault();ev.stopPropagation();
    if(dockSettlement)tgV7Enter(dockSettlement);
  };

  function showDock(s){
    dockSettlement=s||null;
    if(!s||s.abandoned||s.pop<1||tgV7Mode==='close'){dock.style.display='none';return;}
    document.getElementById('tg-enter-place').textContent=`${s.culture?.sigil||'⌂'} ${s.n.toUpperCase()} · POP ${s.pop}`;
    dock.style.display='block';
  }

  function canvasPoint(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*(W/r.width),y:(e.clientY-r.top)*(H/r.height)}}
  function settlementAt(e,radius=88){
    const p=canvasPoint(e),wx=(p.x-W/2)/camera.z+world.w/2+camera.x,wy=(p.y-H/2)/camera.z+world.h/2+camera.y;
    let best=null,bd=radius*radius;
    for(const s of world.settlements){if(s.abandoned||s.pop<1)continue;const d=(s.x-wx)**2+(s.y-wy)**2;if(d<bd){bd=d;best=s;}}
    return best;
  }

  // Runs before the older culture click handler and makes selection/entry UI explicit.
  canvas.addEventListener('click',function(e){
    if(tgV7Mode==='close')return;
    const s=settlementAt(e);
    if(s){tgSelectedSettlement=s;showDock(s);}else showDock(null);
  },true);

  canvas.addEventListener('dblclick',function(e){
    if(tgV7Mode==='close')return;
    const s=settlementAt(e);if(!s)return;
    e.preventDefault();e.stopImmediatePropagation();tgV7Enter(s);
  },true);

  // Keep the button in the card too, but do not depend on it: later layers rewrite card HTML.
  const baseSettlementCard=tgSettlementCard;
  tgSettlementCard=function(s){
    baseSettlementCard(s);showDock(s);
    if(!s||s.abandoned||tgV7Mode==='close')return;
    const card=document.getElementById('agentcard');
    if(!card.querySelector('.tg-enter-settlement')){
      const btn=document.createElement('button');btn.className='tg-enter-settlement';btn.textContent='⌂ ENTER VILLAGE';
      btn.onclick=function(ev){ev.preventDefault();ev.stopPropagation();tgV7Enter(s)};card.appendChild(btn);
    }
  };

  const baseEnter=tgV7Enter;tgV7Enter=function(s){dock.style.display='none';baseEnter(s)};
  const baseExit=tgV7Exit;tgV7Exit=function(){baseExit();showDock(tgSelectedSettlement)};
  if(tgV7Hint)tgV7Hint.textContent='CLICK A VILLAGE → ENTER VILLAGE · DOUBLE-CLICK = SHORTCUT';
  log('⌂ Village entry dock enabled: selecting a settlement now exposes a persistent ENTER VILLAGE control.');
})();