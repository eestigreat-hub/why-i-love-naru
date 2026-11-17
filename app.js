'use strict';
const reasons = [
  'нару помогает мне чувствовать себя лучше',
  'нару заботится обо мне',
  'нару любит меня',
  'нару позволяет чувствовать себя комфортно и расслабленно',
  'нару говорит много приятных вещей',
  'нару говорит что во мне нравится',
  'нару интересный собеседник',
  'нару приятно делится чувствами и эмоциями',
  'нару дает мне смысл жизни',
  'нару обещала погладить',
  'нару обещала поцеловать',
  'нару обещала обнять',
  'нару обещала неприличные вещи',
  'нару позволяет проявлять эмоции',
  'нару помогает не ощущать страха от выражения беспокойства',
  'нару помогает не ощущать страха от странных мыслей или чувств',
  'нару первая призналась мне в очень приятных вещах',
  'нару дает мне смысл жить',
  'нару для меня будущее',
  'нару позволяет интересно обсуждать серьезные и не очень темы',
  'нару радуется когда у меня что-то получается',
  'нару интересуется мной и моим состоянием',
  'нару помнит что мне важно',
  'нару помогает чувствовать себя спокойно и уверенно'
];
const sky = document.querySelector('#sky');
const reason = document.querySelector('#reason');
const canvas = document.querySelector('#fireworks');
const ctx = canvas.getContext('2d');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let deck = [], count = 0, timer, transitionTimer, finished = false;
let particles = [], frame = 0, lastTime = 0;
const colors = ['#ad5975','#d494a6','#d5aa68','#ac807e','#c66a81'];
function shuffle(){
  deck = [...reasons];
  for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
  count=0;finished=false;
}
function resize(){
  const ratio=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.round(innerWidth*ratio);canvas.height=Math.round(innerHeight*ratio);
  ctx.setTransform(ratio,0,0,ratio,0,0);
}
function burst(x,y,amount=52){
  if(reducedMotion.matches)return;
  for(let i=0;i<amount;i++){
    const angle=Math.PI*2*i/amount+Math.random()*.15,speed=1.3+Math.random()*3.4;
    particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1,decay:.009+Math.random()*.01,size:1+Math.random()*1.7,color:colors[i%colors.length],spark:i%5===0});
  }
  particles=particles.slice(-450);
  if(!frame){lastTime=performance.now();frame=requestAnimationFrame(draw);}
}
function draw(now){
  const step=Math.min((now-lastTime)/16.667,2);lastTime=now;
  ctx.clearRect(0,0,innerWidth,innerHeight);
  particles=particles.filter(p=>p.life>0);
  for(const p of particles){
    p.x+=p.vx*step;p.y+=p.vy*step;p.vx*=Math.pow(.987,step);p.vy+=.024*step;p.life-=p.decay*step;
    ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.color;ctx.strokeStyle=p.color;
    if(p.spark){ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(p.x-4,p.y);ctx.lineTo(p.x+4,p.y);ctx.moveTo(p.x,p.y-4);ctx.lineTo(p.x,p.y+4);ctx.stroke();}
    else{ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();}
  }
  ctx.globalAlpha=1;
  if(particles.length)frame=requestAnimationFrame(draw);else{frame=0;ctx.clearRect(0,0,innerWidth,innerHeight);}
}
let lastPoint={x:innerWidth/2,y:innerHeight/2};
function placeReason(x,y){
  reason.style.left='0px';reason.style.top='0px';
  const box=reason.getBoundingClientRect(),margin=16;
  const left=Math.max(margin,Math.min(x-box.width/2,innerWidth-box.width-margin));
  const top=Math.max(margin,Math.min(y-box.height/2,innerHeight-box.height-margin));
  reason.style.left=left+'px';reason.style.top=top+'px';
}
function showText(text,x,y){
  reason.textContent=text;placeReason(x,y);reason.classList.add('visible');
}
function finale(){
  finished=true;showText('и по куче других причин',lastPoint.x,lastPoint.y);
  burst(lastPoint.x,lastPoint.y,85);
}
sky.addEventListener('click',event=>{
  clearTimeout(timer);clearTimeout(transitionTimer);
  if(finished)shuffle();
  const x=event.detail===0?innerWidth/2:event.clientX;
  const y=event.detail===0?innerHeight*.65:event.clientY;
  lastPoint={x,y};
  if(count===reasons.length){finale();return;}
  reason.classList.remove('visible');
  showText(deck[count++],x,y);
  burst(x,y);
  timer=setTimeout(()=>{
    reason.classList.remove('visible');
    if(count===reasons.length)transitionTimer=setTimeout(finale,300);
  },3000);
});
addEventListener('resize',()=>{resize();placeReason(lastPoint.x,lastPoint.y);});
resize();shuffle();
