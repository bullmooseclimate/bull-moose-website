let data,current=0,timer=null,paused=false,pointerStart=null,wasRunningBeforePress=false;
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
async function init(){
 try{data=await(await fetch('/content/site.json',{cache:'no-store'})).json()}catch(e){data={slides:[],services:[]}}
 render();$('year').textContent=new Date().getFullYear();bindSlideshowGestures();
}
const slides=()=>data.slides.filter(s=>s.visible!==false);
function render(){
 const list=slides();
 if(list.length){current=Math.min(current,list.length-1);showSlide(current);renderTopicButtons()}
 $('servicesList').innerHTML=(data.services||[]).map(s=>`<article class="card"><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p></article>`).join('');
 $('productsList').innerHTML=cards(data.products);$('projectsList').innerHTML=cards(data.projects);
 $('reviewsList').innerHTML=(data.testimonials||[]).filter(x=>x.visible!==false).map(t=>`<article class="card"><p>“${esc(t.quote)}”</p><strong>${esc(t.name)}</strong></article>`).join('');
 $('maintenanceTitle').textContent=data.maintenance?.title||'';$('maintenanceText').textContent=data.maintenance?.description||'';
 $('aboutTitle').textContent=data.about?.title||'';$('aboutText').textContent=data.about?.description||'';
 const b=data.business||{};$('contactDetails').textContent=[b.phone,b.email,b.serviceArea].filter(Boolean).join(' · ');
 if(data.settings?.autoRotate!==false)start();
}
function cards(arr){return (arr||[]).filter(x=>x.visible!==false).map(x=>`<article class="card">${x.image?`<img src="${esc(x.image)}" alt="">`:''}<h3>${esc(x.title||x.model||'')}</h3><p>${esc(x.description||'')}</p>${x.details?`<p>${esc(x.details)}</p>`:''}</article>`).join('')}
function renderTopicButtons(){
 const a=slides(),nav=$('topicNav');nav.style.setProperty('--topic-count',a.length);
 nav.innerHTML=a.map((s,i)=>`<button class="topic-button ${i===current?'active':''}" data-i="${i}" title="${esc(s.label)}" aria-pressed="${i===current}">${esc(s.label)}</button>`).join('');
 nav.querySelectorAll('.topic-button').forEach(b=>b.onclick=()=>{paused=true;stop();showSlide(+b.dataset.i)});
}
function showSlide(i){
 const a=slides();if(!a.length)return;current=(i+a.length)%a.length;const s=a[current];
 $('heroBg').style.backgroundImage=s.image?`url("${s.image}")`:'none';
 $('slideEyebrow').textContent=s.eyebrow||'';$('slideTitle').textContent=s.title||'';
 $('slideDescription').textContent=s.description||'';$('slideLink').textContent=s.buttonText||'Learn more';
 $('slideLink').href=s.link||'#contact';$('slideLink').style.display=s.buttonText||s.link?'inline-block':'none';
 $('topicNav').querySelectorAll('.topic-button').forEach((b,j)=>{b.classList.toggle('active',j===current);b.setAttribute('aria-pressed',String(j===current))});
 renderCategoryContent(s);
}
function renderCategoryContent(s){
 $('categoryEyebrow').textContent=s.contentEyebrow||s.label||'Explore';
 $('categoryHeading').textContent=s.contentTitle||s.title||s.label||'Explore';
 $('categoryDescription').textContent=s.contentDescription||'';
 const items=Array.isArray(s.contentItems)?s.contentItems.filter(x=>x.visible!==false):[];
 $('categoryItems').innerHTML=items.length?items.map(item=>`<article class="category-item">${item.image?`<img src="${esc(item.image)}" alt="${esc(item.title||'')}">`:''}<div class="item-copy"><h3>${esc(item.title||'')}</h3><p>${esc(item.description||'')}</p>${item.link?`<a href="${esc(item.link)}" ${/^https?:/i.test(item.link)?'target="_blank" rel="noopener"':''}>${esc(item.linkText||'Learn more')} →</a>`:''}</div></article>`).join(''):'<p class="category-empty">More information and photos can be added here.</p>';
}
function stop(){clearInterval(timer);timer=null}
function start(){stop();if(slides().length>1&&!paused&&data.settings?.autoRotate!==false)timer=setInterval(()=>showSlide(current+1),Number(data.settings.slideInterval)||6500)}
function bindSlideshowGestures(){
 const hero=$('hero');
 hero.addEventListener('pointerdown',e=>{
  if(e.target.closest('a'))return;
  pointerStart={x:e.clientX,y:e.clientY,time:Date.now()};
  wasRunningBeforePress=!!timer;stop();
 });
 hero.addEventListener('pointerup',e=>{
  if(!pointerStart)return;
  const dx=e.clientX-pointerStart.x,dy=e.clientY-pointerStart.y,elapsed=Date.now()-pointerStart.time;
  if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){showSlide(current+(dx<0?1:-1))}
  else if(Math.abs(dx)<12&&Math.abs(dy)<12&&elapsed<500&&!e.target.closest('.hero-copy')){
   const r=hero.getBoundingClientRect();showSlide(current+(e.clientX<r.left+r.width/2?-1:1));
  }
  pointerStart=null;if(wasRunningBeforePress&&!paused)start();
 });
 hero.addEventListener('pointercancel',()=>{pointerStart=null;if(wasRunningBeforePress&&!paused)start()});
 hero.addEventListener('contextmenu',e=>e.preventDefault());
}
$('btuForm').onsubmit=e=>{
 e.preventDefault();let raw=+$('sqft').value*25*+$('ceiling').value*+$('insulation').value*+$('windows').value;
 let lo=Math.round(raw*.85/1000)*1000,hi=Math.round(raw*1.15/1000)*1000;
 let msg=`Very rough planning estimate: ${lo.toLocaleString()}–${hi.toLocaleString()} BTU/hr. Not a heat-loss calculation or equipment recommendation.`;
 $('btuResult').textContent=msg;$('btuHidden').value=msg;
};
$('contactForm').onsubmit=async e=>{
 e.preventDefault();let fd=new FormData(e.target),endpoint=data.settings?.formspreeEndpoint;
 if(endpoint){try{let r=await fetch(endpoint,{method:'POST',body:fd,headers:{Accept:'application/json'}});if(!r.ok)throw Error();$('formNote').textContent='Thank you. Your request was submitted.';e.target.reset();return}catch(err){$('formNote').textContent='Online submission failed. Opening an email draft instead.'}}
 let sub=encodeURIComponent('Website estimate request - '+fd.get('name'));
 let body=encodeURIComponent([...fd.entries()].map(([k,v])=>`${k}: ${v}`).join('\n'));
 location.href=`mailto:${data.business.email}?subject=${sub}&body=${body}`;
};
document.querySelector('.menu').onclick=()=>{const nav=document.querySelector('.header nav');nav.classList.toggle('open');document.querySelector('.menu').setAttribute('aria-expanded',String(nav.classList.contains('open')))};
init();
