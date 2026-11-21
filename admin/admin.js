let data;
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
async function init(){
 try{let r=await fetch('/api/admin/content');if(!r.ok)throw Error('Could not load content. Check Cloudflare Access and API configuration.');data=await r.json()}
 catch(e){$('status').textContent=e.message;return}
 render();
}
function field(label,value,attr=''){return `<label>${label}<input ${attr} value="${esc(value)}"></label>`}
function renderSlides(){
 const root=$('slides');root.innerHTML='';
 (data.slides||[]).forEach((s,i)=>{
  if(!Array.isArray(s.contentItems))s.contentItems=[];
  const el=document.createElement('div');el.className='item';
  el.innerHTML=`<div class="item-head"><h3>Category ${i+1}</h3><div><button type="button" data-up>Move up</button><button type="button" data-down>Move down</button><button type="button" class="remove">Remove category</button></div></div>
  <div class="fields">
   <label>Button label<input data-k="label" value="${esc(s.label)}"></label>
   <label>Hero image path or URL<input data-k="image" value="${esc(s.image)}"></label>
   <label>Small introductory line<input data-k="eyebrow" value="${esc(s.eyebrow)}"></label>
   <label>Slideshow headline<input data-k="title" value="${esc(s.title)}"></label>
   <label class="wide">Slideshow description<textarea data-k="description">${esc(s.description)}</textarea></label>
   <label>Slideshow button text<input data-k="buttonText" value="${esc(s.buttonText)}"></label>
   <label>Slideshow button link<input data-k="link" value="${esc(s.link)}"></label>
   <label>Content heading below buttons<input data-k="contentTitle" value="${esc(s.contentTitle||'')}"></label>
   <label>Content intro line<input data-k="contentEyebrow" value="${esc(s.contentEyebrow||'')}"></label>
   <label class="wide">Content introduction<textarea data-k="contentDescription">${esc(s.contentDescription||'')}</textarea></label>
  </div>
  <label class="check"><input data-k="visible" type="checkbox" ${s.visible!==false?'checked':''}> Show this category on the website</label>
  <div class="subitems"><h4>Photos, information and links underneath this category</h4><div class="content-items"></div><button type="button" class="add-content">＋ Add photo / information / link</button></div>`;
  el.querySelectorAll('[data-k]').forEach(x=>x.onchange=()=>s[x.dataset.k]=x.type==='checkbox'?x.checked:x.value);
  el.querySelector('[data-up]').onclick=()=>move(data.slides,i,-1);
  el.querySelector('[data-down]').onclick=()=>move(data.slides,i,1);
  el.querySelector('.remove').onclick=()=>{if(confirm('Remove this category and its content?')){data.slides.splice(i,1);render()}};
  el.querySelector('.add-content').onclick=()=>{s.contentItems.push({title:'New item',description:'',image:'',link:'',linkText:'Learn more',visible:true});render()};
  const sub=el.querySelector('.content-items');
  s.contentItems.forEach((item,j)=>{
   const box=document.createElement('div');box.className='subitem';
   box.innerHTML=`<div class="item-head"><strong>Content item ${j+1}</strong><button type="button" class="remove">Remove item</button></div>
   <div class="fields">
    <label>Heading<input data-k="title" value="${esc(item.title||'')}"></label>
    <label>Photo path or URL<input data-k="image" value="${esc(item.image||'')}"></label>
    <label class="wide">Description<textarea data-k="description">${esc(item.description||'')}</textarea></label>
    <label>Link destination (optional)<input data-k="link" value="${esc(item.link||'')}" placeholder="#contact or https://..."></label>
    <label>Link wording<input data-k="linkText" value="${esc(item.linkText||'Learn more')}"></label>
   </div><label class="check"><input data-k="visible" type="checkbox" ${item.visible!==false?'checked':''}> Show this item</label>`;
   box.querySelectorAll('[data-k]').forEach(x=>x.onchange=()=>item[x.dataset.k]=x.type==='checkbox'?x.checked:x.value);
   box.querySelector('.remove').onclick=()=>{s.contentItems.splice(j,1);render()};
   sub.appendChild(box);
  });
  root.appendChild(el);
 });
}
function move(arr,i,delta){const j=i+delta;if(j<0||j>=arr.length)return;[arr[i],arr[j]]=[arr[j],arr[i]];render()}
function editor(list,id,fields){
 $(id).innerHTML='';
 (data[list]||[]).forEach((obj,i)=>{
  const el=document.createElement('div');el.className='item';
  el.innerHTML=`<div class="item-head"><h3>${list.slice(0,-1)} ${i+1}</h3><button type="button" class="remove">Remove</button></div><div class="fields">${fields.map(([k,label,multi])=>`<label>${label}${multi?`<textarea data-k="${k}">${esc(obj[k])}</textarea>`:`<input data-k="${k}" value="${esc(obj[k])}">`}</label>`).join('')}</div><label class="check"><input data-k="visible" type="checkbox" ${obj.visible!==false?'checked':''}> Visible on website</label>`;
  el.querySelectorAll('[data-k]').forEach(x=>x.onchange=()=>obj[x.dataset.k]=x.type==='checkbox'?x.checked:x.value);
  el.querySelector('.remove').onclick=()=>{if(confirm('Remove this item?')){data[list].splice(i,1);render()}};
  $(id).appendChild(el);
 });
}
function render(){
 renderSlides();
 editor('services','services',[['title','Service title'],['description','Description',true]]);
 editor('products','products',[['title','Product / model name'],['image','Image path or URL'],['description','Description',true],['details','Confirmed specifications / details',true]]);
 editor('projects','projects',[['title','Project title'],['image','Image path or URL'],['description','Description',true]]);
 editor('testimonials','testimonials',[['name','Customer name or initials'],['quote','Customer feedback',true]]);
 $('interval').value=(data.settings.slideInterval||6500)/1000;$('autoRotate').checked=data.settings.autoRotate!==false;
 $('email').value=data.business.email||'';$('phone').value=data.business.phone||'';$('area').value=data.business.serviceArea||'';
 $('formEndpoint').value=data.settings.formspreeEndpoint||'';
 $('aboutTitle').value=data.about.title||'';$('aboutText').value=data.about.description||'';
 $('maintenanceTitle').value=data.maintenance.title||'';$('maintenanceText').value=data.maintenance.description||'';
}
$('addSlide').onclick=()=>{data.slides.push({id:'category-'+Date.now(),label:'New category',image:'',eyebrow:'',title:'New headline',description:'',buttonText:'Learn more',link:'#contact',visible:true,contentTitle:'',contentEyebrow:'Explore',contentDescription:'',contentItems:[]});render()};
$('addService').onclick=()=>{data.services.push({title:'New service',description:''});render()};
$('addProduct').onclick=()=>{data.products.push({title:'New product',image:'',description:'',details:'',visible:true});render()};
$('addProject').onclick=()=>{data.projects.push({title:'New project',image:'',description:'',visible:true});render()};
$('addTestimonial').onclick=()=>{data.testimonials.push({name:'',quote:'',visible:false});render()};
$('uploadImage').onclick=async()=>{
 const f=$('imageFile').files[0];if(!f){$('uploadResult').textContent='Choose an image first.';return}
 if(f.size>5*1024*1024){$('uploadResult').textContent='Please choose an image under 5 MB.';return}
 const form=new FormData();form.append('file',f);$('uploadResult').textContent='Uploading…';
 try{const r=await fetch('/api/admin/upload',{method:'POST',body:form});const j=await r.json();if(!r.ok)throw Error(j.error||'Upload failed');$('uploadResult').textContent='Uploaded: '+j.path+' — copy this path into the appropriate image field.'}
 catch(e){$('uploadResult').textContent='Upload failed: '+e.message}
};
$('save').onclick=async()=>{
 data.settings.slideInterval=Math.max(3000,Number($('interval').value)*1000);data.settings.autoRotate=$('autoRotate').checked;
 data.settings.formspreeEndpoint=$('formEndpoint').value;
 Object.assign(data.business,{email:$('email').value,phone:$('phone').value,serviceArea:$('area').value});
 data.about={title:$('aboutTitle').value,description:$('aboutText').value};
 data.maintenance={title:$('maintenanceTitle').value,description:$('maintenanceText').value};
 $('status').textContent='Saving…';
 try{const r=await fetch('/api/admin/content',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});if(!r.ok)throw Error(await r.text());$('status').textContent='Saved. Website content has been committed to GitHub.'}
 catch(e){$('status').textContent='Save failed: '+e.message}
};
init();
