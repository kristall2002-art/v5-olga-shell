(function(){
"use strict";
var html=document.documentElement;html.classList.add('js');
var RM=false;try{RM=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
function onView(el,fn,th){
  if(!('IntersectionObserver' in window)){fn();return;}
  var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){fn();io.disconnect();}});},{threshold:th||.2});
  io.observe(el);
}
function fmt(v){return String(v).replace(/\B(?=(\d{3})+(?!\d))/g,' ');}

/* 1.1 — заголовок проявляется по буквам */
(function(){
  var h=document.querySelector('.split');if(!h)return;var k=0;
  h.querySelectorAll('.ln').forEach(function(ln){
    var t=ln.textContent;ln.textContent='';ln.setAttribute('aria-hidden','true');
    t.split(' ').forEach(function(w,wi){
      if(wi)ln.appendChild(document.createTextNode(' '));
      var ws=document.createElement('span');ws.className='wd';
      for(var i=0;i<w.length;i++){var c=document.createElement('span');c.className='ch';c.textContent=w[i];c.style.setProperty('--i',k++);ws.appendChild(c);}
      ln.appendChild(ws);
    });
  });
  setTimeout(function(){h.classList.add('go');},150);
})();

/* 5.1 — цифры набегают счётом */
document.querySelectorAll('.cnt').forEach(function(el){
  var t=parseFloat(el.dataset.v),suf=el.dataset.s||'';
  if(RM)return;
  onView(el,function(){
    var st=null;
    function step(ts){if(st===null)st=ts;var p=Math.min(1,(ts-st)/1500);
      el.textContent=fmt(Math.round(t*(1-Math.pow(1-p,3))))+suf;if(p<1)requestAnimationFrame(step);}
    el.textContent='0'+suf;requestAnimationFrame(step);
  },.6);
});

/* 3.1 — карточки всплывают по очереди */
(function(){
  var cards=[].slice.call(document.querySelectorAll('.pop'));if(!cards.length)return;
  onView(cards[0].parentNode,function(){
    cards.forEach(function(c,i){c.style.animationDelay=(i*170)+'ms';c.classList.add('in');});
  },.15);
})();

/* 4.1 — лента работ листается пальцем, соседние видны краями */
(function(){
  var track=document.querySelector('#strip .track');if(!track)return;
  onView(track,function(){
    if(RM)return;
    setTimeout(function(){track.scrollTo({left:110,behavior:'smooth'});},300);
    setTimeout(function(){track.scrollTo({left:0,behavior:'smooth'});},1100);
  },.4);
  var x0=null,sl=0,moved=false;
  track.addEventListener('mousedown',function(e){x0=e.clientX;sl=track.scrollLeft;moved=false;track.style.scrollSnapType='none';e.preventDefault();});
  window.addEventListener('mousemove',function(e){if(x0===null)return;var d=e.clientX-x0;if(Math.abs(d)>5)moved=true;track.scrollLeft=sl-d;});
  window.addEventListener('mouseup',function(){if(x0===null)return;x0=null;track.style.scrollSnapType='';});
  var lb=document.getElementById('lb'),lbi=lb.querySelector('img');
  track.querySelectorAll('figure').forEach(function(f){
    f.addEventListener('click',function(){if(moved){moved=false;return;}
      var im=f.querySelector('img');lbi.src=im.src;lbi.alt=im.alt;lb.classList.add('open');lb.setAttribute('aria-hidden','false');});
  });
  function close(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');}
  lb.addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
})();

/* 6.1 — заливка кнопки слева направо по касанию */
document.querySelectorAll('.btn.fill').forEach(function(b){
  b.addEventListener('touchstart',function(){
    b.classList.remove('on');void b.offsetWidth;b.classList.add('on');
    clearTimeout(b._t);b._t=setTimeout(function(){b.classList.remove('on');},1100);
  },{passive:true});
});

/* отзывы — переключение точками, сами меняются раз в 7 секунд */
(function(){
  var box=document.getElementById('quotes');if(!box)return;
  var qs=box.querySelectorAll('.q'),dots=box.querySelector('.q-dots'),i=0,tm;
  function show(n){qs[i].classList.remove('on');dots.children[i].classList.remove('on');i=(n+qs.length)%qs.length;qs[i].classList.add('on');dots.children[i].classList.add('on');}
  qs.forEach(function(_,n){var d=document.createElement('button');d.setAttribute('aria-label','Отзыв '+(n+1));if(!n)d.className='on';
    d.addEventListener('click',function(){clearInterval(tm);show(n);});dots.appendChild(d);});
  if(!RM)tm=setInterval(function(){show(i+1);},7000);
})();

/* активный пункт меню */
(function(){
  var links=[].slice.call(document.querySelectorAll('.nav a'));
  var secs=links.map(function(a){return document.querySelector(a.getAttribute('href'));});
  window.addEventListener('scroll',function(){
    var y=scrollY+120,cur=0;secs.forEach(function(s,n){if(s&&s.offsetTop<=y)cur=n;});
    links.forEach(function(a,n){a.classList.toggle('on',n===cur);});
  },{passive:true});
})();
})();
