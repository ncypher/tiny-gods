// Tiny Gods v0.8 — Under the Glass entry fix
// Keeps the stable v0.7 renderer untouched while improving entry interactions in Streamlit.
(function(){
  const style=document.createElement('style');
  style.textContent='.tg-enter-settlement{display:block;width:100%;margin-top:9px;border:1px solid rgba(124,248,199,.32);background:rgba(10,26,24,.9);color:#c8ffea;border-radius:999px;padding:8px 12px;font:800 9px ui-monospace,monospace;letter-spacing:.1em;cursor:pointer}';
  document.head.appendChild(style);

  function canvasPoint(e){
    const r=canvas.getBoundingClientRect();
    return {x:(e.clientX-r.left)*(W/r.width),y:(e.clientY-r.top)*(H/r.height)};
  }

  function settlementAt(e,radius=76){
    const p=canvasPoint(e);
    const wx=(p.x-W/2)/camera.z+world.w/2+camera.x;
    const wy=(p.y-H/2)/camera.z+world.h/2+camera.y;
    let best=null,bd=radius*radius;
    for(const s of world.settlements){
      if(s.abandoned||s.pop<1)continue;
      const d=(s.x-wx)**2+(s.y-wy)**2;
      if(d<bd){bd=d;best=s;}
    }
    return best;
  }

  canvas.addEventListener('dblclick',function(e){
    if(tgV7Mode==='close')return;
    const s=settlementAt(e);
    if(!s)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    tgV7Enter(s);
  },true);

  const baseSettlementCard=tgSettlementCard;
  tgSettlementCard=function(s){
    baseSettlementCard(s);
    if(!s||s.abandoned||tgV7Mode==='close')return;
    const card=document.getElementById('agentcard');
    if(card.querySelector('.tg-enter-settlement'))return;
    const btn=document.createElement('button');
    btn.className='tg-enter-settlement';
    btn.textContent='⌂ ENTER SETTLEMENT';
    btn.addEventListener('click',function(ev){
      ev.preventDefault();
      ev.stopPropagation();
      tgV7Enter(s);
    });
    card.appendChild(btn);
  };

  if(tgV7Hint)tgV7Hint.textContent='CLICK A SETTLEMENT, THEN ENTER · OR DOUBLE-CLICK';
  log('⌂ Settlement entry controls reinforced for Streamlit canvas scaling.');
})();