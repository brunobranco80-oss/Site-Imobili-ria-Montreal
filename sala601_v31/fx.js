/* ========= v3.1 · efeitos ========= */
(function(){
  var root=document.documentElement; if(!root.classList.contains('fx')) return;
  var hero=document.querySelector('.hero');

  /* números que rolam */
  function roll(el,delay){
    if(!el||el.dataset.rolled) return; el.dataset.rolled='1';
    var orig=el.innerHTML, txt=el.textContent.replace(/\s+/g,' ').trim(), vis=el.cloneNode(true), k=0;
    (function walk(n){
      Array.prototype.slice.call(n.childNodes).forEach(function(c){
        if(c.nodeType===3){
          var f=document.createDocumentFragment();
          for(var i=0;i<c.nodeValue.length;i++){
            var ch=c.nodeValue[i];
            if(/[0-9]/.test(ch)){
              var d=document.createElement('span'); d.className='dg';
              var g=document.createElement('span'); g.className='gh'; g.textContent=ch;
              var col=document.createElement('span'); col.className='col';
              var h=''; for(var j=0;j<20;j++) h+='<i>'+(j%10)+'</i>'; col.innerHTML=h;
              col.style.setProperty('--n',10+(+ch)); col.style.setProperty('--dd',(delay+k*55)+'ms'); k++;
              d.appendChild(g); d.appendChild(col); f.appendChild(d);
            } else f.appendChild(document.createTextNode(ch));
          }
          c.parentNode.replaceChild(f,c);
        } else if(c.nodeType===1) walk(c);
      });
    })(vis);
    var sr=document.createElement('span'); sr.className='sr-only'; sr.textContent=txt;
    var hid=document.createElement('span'); hid.setAttribute('aria-hidden','true');
    while(vis.firstChild) hid.appendChild(vis.firstChild);
    el.textContent=''; el.appendChild(sr); el.appendChild(hid); el.classList.add('roll');
    requestAnimationFrame(function(){requestAnimationFrame(function(){el.classList.add('rolling');});});
    setTimeout(function(){el.innerHTML=orig; el.classList.remove('rolling');},delay+k*55+1900);
  }

  /* título que sobe: cada palavra numa máscara, a linha sobe junta */
  var h1=document.getElementById('hero-titulo');
  if(h1){
    (function wrap(n){
      Array.prototype.slice.call(n.childNodes).forEach(function(c){
        if(c.nodeType===3){
          var f=document.createDocumentFragment();
          c.nodeValue.split(/(\s+)/).forEach(function(part){
            if(!part) return;
            if(/^\s+$/.test(part)){ f.appendChild(document.createTextNode(' ')); return; }
            var w=document.createElement('span'); w.className='w'; var s=document.createElement('span'); s.textContent=part; w.appendChild(s); f.appendChild(w);
          });
          c.parentNode.replaceChild(f,c);
        } else if(c.nodeType===1){
          var w=document.createElement('span'); w.className='w'; var s=document.createElement('span');
          c.parentNode.replaceChild(w,c); s.appendChild(c); w.appendChild(s);
        }
      });
    })(h1);
  }
  var order=[['.tagline',0],['.h1-sub',430],['.lead',500],['.keys',570],['.pricebox',640],['.cta',720],['.photo-card',0]];
  order.forEach(function(o){var e=hero&&hero.querySelector(o[0]); if(e){e.classList.add('ld'); e.style.setProperty('--d',o[1]+'ms');}});
  function lines(){
    if(!h1) return; var ws=h1.querySelectorAll('.w'), top=null, l=-1;
    for(var i=0;i<ws.length;i++){var t=ws[i].offsetTop; if(top===null||Math.abs(t-top)>4){l++; top=t;} ws[i].style.setProperty('--l',l);}
  }
  var started=false;
  function start(){
    if(started) return; started=true; lines();
    if(h1) h1.classList.add('split');
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      hero&&hero.classList.add('go');
      roll(hero&&hero.querySelector('.pricebox .v'),700);
      var pc=hero&&hero.querySelector('.photo-card'); if(pc) setTimeout(function(){pc.classList.add('done');},1500);
    });});
  }
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(start); setTimeout(start,300);} else start();
  addEventListener('resize',lines);

  /* entradas em sequência + cortina nas fotos grandes */
  var rvSel='.sec-head, .gal-head, .card, .card-contact, .why div, .feat li, .vista .txt, .mont-card, .planta-img, .layout, .form-wrap form, .faq details, .dist li, .steps li, .predio-video>div:last-child, .final .tagline, .final h2, .final p, .final .cta';
  var shSel='.vista figure, .sala-grid figure, .esc-fig, .final-fig, #predio .video-box';
  var rvs=Array.prototype.filter.call(document.querySelectorAll(rvSel),function(e){return !e.closest('.hero');});
  var shs=Array.prototype.slice.call(document.querySelectorAll(shSel));
  rvs.forEach(function(e){e.classList.add('rv');});
  shs.forEach(function(e){var r=e.getBoundingClientRect(); e.classList.add('sh'); if(r.left+r.width/2>innerWidth/2) e.classList.add('sh-r');
    e.addEventListener('transitionend',function(ev){if(ev.target===e&&ev.propertyName==='clip-path') e.classList.add('done');});});
  var q=[], raf=0;
  function flush(){
    raf=0; q.sort(function(a,b){var A=a.getBoundingClientRect(),B=b.getBoundingClientRect(); return (A.top-B.top)||(A.left-B.left);});
    q.forEach(function(e,i){e.style.setProperty('--d',Math.min(i,8)*80+'ms'); e.classList.add('in');}); q=[];
  }
  var io=new IntersectionObserver(function(en){
    en.forEach(function(x){if(x.isIntersecting){q.push(x.target); io.unobserve(x.target);}});
    if(q.length&&!raf) raf=requestAnimationFrame(flush);
  },{rootMargin:'0px 0px -10% 0px'});
  rvs.concat(shs).forEach(function(e){io.observe(e);});
  var nio=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){roll(x.target,150); nio.unobserve(x.target);}});},{threshold:.6});
  document.querySelectorAll('.why b, .total b').forEach(function(b){if(/[0-9]/.test(b.textContent)) nio.observe(b);});
  /* segurança: o que já passou da tela aparece, sem esconder nada */
  function safety(){rvs.concat(shs).forEach(function(e){if(!e.classList.contains('in')&&e.getBoundingClientRect().top<innerHeight*.9){e.classList.add('in'); io.unobserve(e);}});}
  setTimeout(safety,2500);
  addEventListener('beforeprint',function(){rvs.concat(shs).forEach(function(e){e.classList.add('in','done');});});

  /* a fachada abre de uma janela até a tela toda, presa ao rolar */
  var jan=document.getElementById('janela');
  if(jan){
    var tick=false;
    function upd(){
      tick=false; var r=jan.getBoundingClientRect(), total=r.height-innerHeight;
      var p=total>0?(-r.top)/total:1; p=Math.min(1,Math.max(0,p)); var o=Math.min(1,p/.72);
      var e=o<.5?4*o*o*o:1-Math.pow(-2*o+2,3)/2; jan.style.setProperty('--p',e.toFixed(4));
    }
    jan.style.setProperty('--p','0'); upd();
    addEventListener('scroll',function(){if(!tick){tick=true; requestAnimationFrame(upd);}},{passive:true});
    addEventListener('resize',upd);
  }
})();
