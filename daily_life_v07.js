// Tiny Gods v0.7 — Daily Life
// Makes close-view inhabitants occupy roles and gather around meaningful civic/work spaces.
function tgV7Role(a,s){
  let st=typeof tgV7BuildState==='function'?tgV7BuildState(s):null;
  if(st?.projects?.some(p=>p.kind==='hut'||p.kind==='civic')&&((a.id||0)%5===0||a.curious>.74))return 'builder';
  if(world.caravans?.some(c=>c.kind==='trade'&&(c.to===s||c.from===s))&&(a.social>.58||((a.id||0)%7===0)))return 'trader';
  if((s.culture?.communal||0)>.6&&a.social>.62)return 'keeper';
  if(a.curious>.72||(s.culture?.wandering||0)>.68&&a.curious>.58)return 'traveler';
  if(a.knowledge>=2)return 'teacher';
  return 'resident';
}
function tgV7RoleTarget(role,s,i){
  let civic=typeof tgV7CivicType==='function'?tgV7CivicType(s):'hearth';
  if(role==='builder')return {x:150+((i%3)-1)*22,y:158+(i%2)*20};
  if(role==='trader')return {x:-42+((i%4)-1.5)*34,y:104+(i%2)*22};
  if(role==='keeper')return {x:Math.cos(i*1.8)*48,y:62+Math.sin(i*1.8)*22};
  if(role==='teacher')return civic==='court'?{x:-18+(i%3)*18,y:72+(i%2)*13}:{x:28+(i%3)*16,y:72+(i%2)*12};
  if(role==='traveler')return {x:Math.sin(i*1.9)*38,y:-125+(i%4)*34};
  return {x:Math.sin(i*2.1)*118+(i%3-1)*24,y:118+Math.cos(i*1.6)*120};
}
function tgV7RoleColor(role,a){
  if(a.dynasty)return `hsl(${a.dynasty.hue} 78% 74%)`;
  return role==='builder'?'#f1c77a':role==='trader'?'#ffe08a':role==='keeper'?'#8de7c0':role==='traveler'?'#a8d6ff':role==='teacher'?'#d7b6ff':'#d9eee5';
}
function tgV7ActivityLabel(role){return role==='builder'?'BUILDING':role==='trader'?'TRADING':role==='keeper'?'TENDING HEARTH':role==='traveler'?'TRAVELING':role==='teacher'?'TEACHING':'AT HOME'}
function tgV7DrawRoleProp(role,p,i){
  ctx.save();
  if(role==='builder'){ctx.strokeStyle='rgba(224,191,123,.65)';ctx.lineWidth=1.4*p.s;ctx.beginPath();ctx.moveTo(p.x+4*p.s,p.y-1*p.s);ctx.lineTo(p.x+10*p.s,p.y-9*p.s);ctx.stroke()}
  if(role==='trader'){ctx.fillStyle='rgba(141,94,48,.86)';ctx.fillRect(p.x-9*p.s,p.y+5*p.s,8*p.s,6*p.s)}
  if(role==='keeper'){ctx.fillStyle='rgba(255,162,66,.75)';ctx.beginPath();ctx.arc(p.x+7*p.s,p.y+5*p.s,2.4*p.s,0,TAU);ctx.fill()}
  if(role==='traveler'){ctx.strokeStyle='rgba(184,216,239,.65)';ctx.lineWidth=1*p.s;ctx.beginPath();ctx.moveTo(p.x+5*p.s,p.y-4*p.s);ctx.lineTo(p.x+7*p.s,p.y+7*p.s);ctx.stroke()}
  if(role==='teacher'){ctx.fillStyle='rgba(214,182,255,.6)';ctx.fillRect(p.x+5*p.s,p.y-3*p.s,5*p.s,7*p.s)}
  ctx.restore();
}
function tgV7People(s){
  let members=world.agents.filter(a=>a.alive&&a.home===s).slice(0,Math.min(22,s.pop)),hits=[];
  let now=day*.14;
  for(let i=0;i<members.length;i++){
    let a=members[i],role=tgV7Role(a,s),target=tgV7RoleTarget(role,s,i),phase=(now+i*.173)%1;
    let drift=role==='traveler'?55:role==='resident'?34:18;
    let x=target.x+Math.sin((phase+i)*TAU)*drift;
    let y=target.y+Math.cos((phase*.8+i)*TAU)*(role==='resident'?58:18);
    let p=tgV7Proj(x,y);hits.push({a,x:p.x,y:p.y,r:11*p.s,role});
    ctx.save();let col=tgV7RoleColor(role,a);ctx.fillStyle=col;ctx.shadowBlur=tgV7Hover===a?13:5;ctx.shadowColor=col;
    ctx.beginPath();ctx.arc(p.x,p.y-8*p.s,(tgV7Hover===a?4.2:3.1)*p.s,0,TAU);ctx.fill();
    ctx.strokeStyle='rgba(225,239,232,.78)';ctx.lineWidth=2*p.s;ctx.beginPath();ctx.moveTo(p.x,p.y-5*p.s);ctx.lineTo(p.x,p.y+8*p.s);ctx.stroke();
    tgV7DrawRoleProp(role,p,i);
    if(tgV7Hover===a){ctx.font=`${8+2*p.s}px ui-monospace`;ctx.fillStyle='rgba(247,255,251,.9)';ctx.fillText(`${a.n} · ${tgV7ActivityLabel(role)}`,p.x+8*p.s,p.y-13*p.s)}
    ctx.restore();
  }
  return hits;
}
function tgV7DailyLifeSummary(s){
  let members=world.agents.filter(a=>a.alive&&a.home===s),counts={builder:0,trader:0,keeper:0,traveler:0,teacher:0,resident:0};
  for(const a of members)counts[tgV7Role(a,s)]++;
  let rows=[['⚒',counts.builder],['⇄',counts.trader],['🔥',counts.keeper],['⌁',counts.traveler],['✦',counts.teacher]].filter(x=>x[1]>0);
  if(!rows.length)return;
  ctx.save();ctx.font='8px ui-monospace';ctx.fillStyle='rgba(210,232,224,.66)';ctx.fillText(`daily life · ${rows.map(([k,v])=>k+v).join('  ')}`,22,94);ctx.restore();
}
const tgV7DailyBaseClose=tgV7Close;
tgV7Close=function(){tgV7DailyBaseClose();let s=tgV7Settlement;if(!s||s.abandoned)return;tgV7DailyLifeSummary(s)};
const tgV7DailyBaseCard=showCard;
showCard=function(a){tgV7DailyBaseCard(a);if(tgV7Mode!=='close'||!a?.home)return;let card=document.getElementById('agentcard');let role=tgV7Role(a,a.home);card.innerHTML+=`<div class="thought">DAILY LIFE<br><span style="color:#c8ffea">${tgV7ActivityLabel(role)}</span><br>${role==='builder'?'Working on current settlement construction.':role==='trader'?'Working near trade arrivals and the civic market.':role==='keeper'?'Gravitating toward the communal center and hearth.':role==='traveler'?'Spending more time near the road and settlement edge.':role==='teacher'?'Sharing knowledge near a civic gathering space.':'Following ordinary household routines.'}</div>`};
log('☼ Daily life awakens: builders build, traders gather, keepers tend, travelers roam, and teachers share knowledge.');