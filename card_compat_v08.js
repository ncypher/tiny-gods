// Tiny Gods v0.8 — Card compatibility shim
// The base terrarium renders cards inline and never defined showCard().
// Later Under-the-Glass layers expect that helper, so provide one centrally.
function showCard(a){
  const card=document.getElementById('agentcard');
  if(!a){card.classList.remove('on');return;}
  selected=a;
  card.classList.toggle('on',!!a.alive);
  if(!a.alive)return;
  const mem=(a.memory||[]).slice(0,3).map(m=>`<div>• ${m}</div>`).join('');
  card.innerHTML=`<div class="name">${a.n}</div>
    <div class="meta">AGE ${Math.floor(a.age)} · GEN ${a.generation||0}${a.home?` · ${a.home.n}`:''}</div>
    <div class="thought">${typeof thought==='function'?thought(a):'Watching the settlement.'}</div>
    <div class="thought">ENERGY ${Math.round((a.energy||0)*100)} · KNOWLEDGE ${a.knowledge||0}<br>
    SOCIAL ${Math.round((a.social||0)*100)} · BOLD ${Math.round((a.aggro||0)*100)} · CURIOUS ${Math.round((a.curious||0)*100)}</div>
    ${mem?`<div class="thought">MEMORY<br>${mem}</div>`:''}`;
}
log('◌ Card compatibility online: close-view residents can be inspected safely.');