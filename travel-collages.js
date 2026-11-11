(()=>{
const allowed=new Set(['london','sydney','florence','nice','verbier','sicily','lanzarote','avalon','charleston','san-diego','copenhagen','philadelphia','new-york-city','vienna','paris','santorini','dublin','cinque-terre','elba-island']);
if(!p||!allowed.has(p.slug))return;
const host=document.getElementById('trip-gallery');host.textContent='Loading my travel photos…';
fetch('collages/'+p.slug+'.json', { cache: 'no-store' }).then(r=>{if(!r.ok)throw Error('Gallery unavailable');return r.json()}).then(entry=>{
host.replaceChildren();const collage=document.createElement('div');collage.className='travel-collage';
const singlePhoto=entry.photos.length===1;
if(singlePhoto)collage.classList.add('travel-collage-single');
const dialog=document.createElement('dialog');dialog.className='photo-lightbox';dialog.setAttribute('aria-label',entry.label+' photo viewer');
const close=document.createElement('button');close.className='lightbox-close';close.type='button';close.textContent='Close ×';close.setAttribute('aria-label','Close photo viewer');
const full=document.createElement('img');const controls=document.createElement('div');controls.className='lightbox-controls';
const previous=document.createElement('button'),next=document.createElement('button'),counter=document.createElement('span');previous.textContent='← Previous';next.textContent='Next →';previous.type=next.type='button';
let selected=0;const show=index=>{selected=(index+entry.photos.length)%entry.photos.length;full.src=entry.photos[selected];full.alt=entry.descriptions?.[selected]??(entry.label+' — photo '+(selected+1));counter.textContent=(selected+1)+' / '+entry.photos.length;};
close.onclick=()=>dialog.close();previous.onclick=()=>show(selected-1);next.onclick=()=>show(selected+1);
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();show(selected-1)}if(event.key==='ArrowRight'){event.preventDefault();show(selected+1)}});
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});controls.append(previous,counter,next);dialog.append(close,full);if(!singlePhoto)dialog.append(controls);document.body.append(dialog);
entry.photos.slice(0,3).forEach((src,index)=>{const button=document.createElement('button');button.type='button';button.className='collage-card';button.setAttribute('aria-label','Enlarge '+entry.label+' photo '+(index+1));const image=document.createElement('img');image.src=src;image.alt=entry.descriptions?.[index]??('From my travels in '+entry.label+' — photo '+(index+1));image.loading='eager';button.append(image);button.onclick=()=>{show(index);dialog.showModal()};collage.append(button)});
const caption=document.createElement('p');caption.className='collage-caption';caption.textContent=entry.label+(singlePhoto?' · Click the photo to take a closer look.':' · Three little moments. Click a photo to take a closer look.');
host.append(collage,caption);
if(entry.post){const source=document.createElement('a');source.href=entry.post;source.target='_blank';source.rel='noopener';source.textContent='View the original Instagram post ↗';host.append(source);}
}).catch(()=>{host.textContent='Photos are temporarily unavailable. Please refresh to try again.'});
})();