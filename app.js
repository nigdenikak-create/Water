/* Fixed load: change FISH_COUNT here only if preparing another test build. */
'use strict';
const FISH_COUNT = 60;
const canvas = document.getElementById('water');
const ctx = canvas.getContext('2d');
const tank = document.getElementById('tank');
const stats = document.getElementById('stats');
const random = (a,b) => a+Math.random()*(b-a);
let width=1,height=1,ratio=1,last=0,time=0,readout=0,intervals=[],allFrames=0,allTime=0,slowFrames=0;
// Paths are vector geometry. Every fish is drawn separately each frame.
const body = new Path2D('M-35 0 C-26-24 20-30 40-4 Q49 0 40 4 C20 30-26 24-35 0Z');
const tail = new Path2D('M-29 0 L-60-23 Q-52 0-60 23Z');
const topFin = new Path2D('M-17-17 Q-9-43 17-19Z');
const lowerFin = new Path2D('M-9 18 Q5 39 20 16Z');
const palettes=[['#ffb34e','#e06728','#ffe0a0'],['#55d6e7','#176f9d','#c2fbff'],['#f6e9a6','#b3a160','#fff6ce'],['#e886b1','#914879','#ffcfe3'],['#80cf9f','#267b7f','#ccffe0']];
const fish=Array.from({length:FISH_COUNT},(_,i)=>({x:Math.random(),y:random(.15,.83),direction:Math.random()<.5?-1:1,speed:random(.023,.065),size:random(.65,1.25),phase:random(0,Math.PI*2),frequency:random(.55,1.2),colors:palettes[i%palettes.length]}));
function resize(){const r=tank.getBoundingClientRect();width=r.width;height=r.height;ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);last=0;intervals=[];allTime=0;allFrames=0;slowFrames=0;}
function drawFish(f){
 const s=width/2100*f.size;
 ctx.save();ctx.translate(f.x*width,(f.y+Math.sin(time*f.frequency+f.phase)*.035)*height);
 ctx.scale(s*f.direction,s);ctx.rotate(Math.sin(time*1.7+f.phase)*.035);
 ctx.globalAlpha=.78+.16*f.size;
 ctx.save();ctx.translate(-30,0);ctx.scale(1,.83+Math.sin(time*7+f.phase)*.17);ctx.translate(30,0);
 ctx.fillStyle=f.colors[1];ctx.fill(tail);ctx.restore();
 ctx.fillStyle=f.colors[1];ctx.fill(topFin);ctx.fill(lowerFin);
 ctx.fillStyle=f.colors[0];ctx.fill(body);
 ctx.save();ctx.clip(body);ctx.fillStyle=f.colors[1];ctx.globalAlpha*=.35;
 for(let x=-20;x<=15;x+=15){ctx.beginPath();ctx.ellipse(x,-3,4,23,-.2,0,Math.PI*2);ctx.fill();}ctx.restore();
 ctx.fillStyle=f.colors[2];ctx.beginPath();ctx.ellipse(3,-10,20,4,-.12,0,Math.PI*2);ctx.fill();
 ctx.fillStyle=f.colors[1];ctx.beginPath();ctx.moveTo(0,3);ctx.quadraticCurveTo(-17,17,-7,19);ctx.quadraticCurveTo(5,15,0,3);ctx.fill();
 ctx.strokeStyle=f.colors[1];ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(22,0,5,13,0,-1.1,1.1);ctx.stroke();
 ctx.fillStyle='#fff8e9';ctx.beginPath();ctx.arc(30,-6,4.4,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#062b36';ctx.beginPath();ctx.arc(31,-6,2.5,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(32,-7,1,0,Math.PI*2);ctx.fill();ctx.restore();
}
function frame(now){
 requestAnimationFrame(frame);
 const delta=last?now-last:0;last=now;if(document.hidden)return;
 if(delta>0){intervals.push(delta);allFrames++;allTime+=delta;if(delta>33.34)slowFrames++;}
 const dt=Math.min(delta,100)/1000;time+=dt;
 ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);
 for(const f of fish){f.x+=f.direction*f.speed*dt;if(f.x>1.07)f.x=-.07;if(f.x<-.07)f.x=1.07;drawFish(f);}
 if(now-readout>=1000){
 const mean=intervals.length?intervals.reduce((a,b)=>a+b,0)/intervals.length:0;
 stats.textContent='60 рыбок · '+(mean?(1000/mean).toFixed(0):'—')+' FPS\n'+(mean?mean.toFixed(1):'—')+' мс / кадр · '+canvas.width+' × '+canvas.height+'\nСреднее: '+(allTime?(allFrames*1000/allTime).toFixed(1):'—')+' FPS · >33 мс: '+slowFrames;
 intervals=[];readout=now;
 }
}
new ResizeObserver(resize).observe(tank);
// Resume without a giant time jump after returning to this tab.
 document.addEventListener('visibilitychange',()=>{last=0;intervals=[];});
 document.addEventListener('keydown',async e=>{if(e.code==='KeyH')document.body.classList.toggle('hidden');if(e.code==='KeyF'){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{document.getElementById('hint').textContent='Для полного экрана нажмите F11';}}});
resize();requestAnimationFrame(frame);
