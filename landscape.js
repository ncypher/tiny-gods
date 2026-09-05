// A cached, seed-derived relief map. Visual noise uses hash, never the simulation RNG.
function paintLandscape() {
  const image = document.createElement('canvas');
  image.width = world.w; image.height = world.h;
  const brush = image.getContext('2d');
  const step = 4;
  for (let y=0;y<world.h;y+=step) for(let x=0;x<world.w;x+=step) {
    const t=terrain(x,y), moisture=wet(x,y), grain=hash(x,y)*4;
    let r,g,b;
    if(t<.64) {
      const shallow=clamp((t-.50)/.14,0,1);
      r=16+shallow*17;g=43+shallow*33;b=55+shallow*25;
      if(t>.626){r+=20;g+=20;b+=10;}
    } else if(t<.659) {
      const shore=(t-.64)/.019;
      r=145-shore*38;g=146-shore*24;b=105-shore*16;
    } else {
      const elevation=clamp((t-.66)*3,0,1);
      const light=clamp((terrain(x-4,y-5)-t)*180,-9,12);
      r=65+elevation*40-moisture*15+light;
      g=97+elevation*34+moisture*15+light;
      b=72+elevation*16+light;
      if(Math.floor(t*80)!==Math.floor(terrain(x+step,y)*80)){r-=5;g-=5;b-=4;}
    }
    brush.fillStyle=`rgb(${r+grain},${g+grain},${b+grain})`;
    brush.fillRect(x,y,step,step);
  }
  return image;
}

function paintVillageGround(s) {
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#17343f');sky.addColorStop(.34,'#8b9f91');sky.addColorStop(.35,'#526e58');sky.addColorStop(1,'#1b302e');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  for(let layer=0;layer<3;layer++){
    ctx.fillStyle=['#567b78','#3f6563','#2f514b'][layer];ctx.beginPath();ctx.moveTo(0,H*.4);
    for(let x=0;x<=W+24;x+=24)ctx.lineTo(x,H*(.29+layer*.027)+Math.sin(x*.006+layer*2+CFG.seed)*H*.035+Math.sin(x*.017+layer)*8);
    ctx.lineTo(W,H*.48);ctx.lineTo(0,H*.48);ctx.fill();
  }
  const sun=ctx.createRadialGradient(W*.73,H*.14,3,W*.73,H*.14,H*.18);
  sun.addColorStop(0,'#edd9a070');sun.addColorStop(1,'#edd9a000');ctx.fillStyle=sun;ctx.fillRect(0,0,W,H*.4);
  ctx.fillStyle='#ead7a9';ctx.beginPath();ctx.arc(W*.73,H*.14,12,0,TAU);ctx.fill();
  const ground=ctx.createLinearGradient(0,H*.39,0,H);ground.addColorStop(0,'#3d5c4c');ground.addColorStop(1,'#192e2b');ctx.fillStyle=ground;ctx.fillRect(0,H*.4,W,H*.6);
}
