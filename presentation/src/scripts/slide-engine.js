/* ============ SlideEngine ============ */
  function SlideEngine(){
    this.deck=document.querySelector('.deck');
    this.slides=[].slice.call(document.querySelectorAll('.slide'));
    this.total=this.slides.length;
    var hash=window.location.hash;
    var initIdx=0;
    if(hash&&hash.match(/^#slide-\d+$/)){
      var parsed=parseInt(hash.replace('#slide-',''),10)-1;
      if(parsed>=0&&parsed<this.total) initIdx=parsed;
    }
    this.current=initIdx;
    this.scrollTimer=null;
    if(initIdx>0){
      var targetTop=this.getSlideTop(initIdx);
      this.deck.scrollTop=targetTop;
    }
    this.injectCrystals();
    this.buildSectionMap();this.buildChrome();this.bindEvents();this.observe();this.update();
    if(initIdx>0){
      var self=this;
      setTimeout(function(){ self.goTo(initIdx,'auto'); }, 50);
    }
  }
  SlideEngine.prototype.injectCrystals=function(){
    var svgContentRight =
      '<svg viewBox="0 0 160 140" width="160" height="140" class="slide-crystals" aria-hidden="true" focusable="false">' +
        '<g transform="translate(60, 50)">' +
          // Mire d'alignement principale (cercle + réticule en croix + ticks)
          '<circle cx="0" cy="0" r="30" fill="none" stroke="var(--accent)" stroke-width="1.5" opacity="0.6"/>' +
          '<circle cx="0" cy="0" r="16" fill="var(--accent)" opacity="0.08"/>' +
          '<circle cx="0" cy="0" r="4" fill="var(--accent)" opacity="0.8"/>' +
          '<line x1="-38" y1="0" x2="38" y2="0" stroke="var(--accent)" stroke-width="1.5" opacity="0.75"/>' +
          '<line x1="0" y1="-38" x2="0" y2="38" stroke="var(--accent)" stroke-width="1.5" opacity="0.75"/>' +
          '<line x1="-15" y1="-6" x2="-15" y2="6" stroke="var(--accent)" stroke-width="1" opacity="0.5"/>' +
          '<line x1="15" y1="-6" x2="15" y2="6" stroke="var(--accent)" stroke-width="1" opacity="0.5"/>' +
          '<line x1="-6" y1="-15" x2="6" y2="-15" stroke="var(--accent)" stroke-width="1" opacity="0.5"/>' +
          '<line x1="-6" y1="15" x2="6" y2="15" stroke="var(--accent)" stroke-width="1" opacity="0.5"/>' +
          // Deuxième mire décalée façon test de registre d'imprimerie (PJ 2)
          '<circle cx="44" cy="22" r="22" fill="none" stroke="var(--accent2)" stroke-width="1.2" stroke-dasharray="3 2" opacity="0.55"/>' +
          '<line x1="20" y1="22" x2="68" y2="22" stroke="var(--accent2)" stroke-width="1.2" opacity="0.65"/>' +
          '<line x1="44" y1="-2" x2="44" y2="46" stroke="var(--accent2)" stroke-width="1.2" opacity="0.65"/>' +
          '<circle cx="44" cy="22" r="2.5" fill="var(--accent2)" opacity="0.85"/>' +
          // Troisième mire cyan
          '<circle cx="-28" cy="28" r="14" fill="none" stroke="var(--accent3)" stroke-width="1" opacity="0.5"/>' +
          '<line x1="-44" y1="28" x2="-12" y2="28" stroke="var(--accent3)" stroke-width="1" opacity="0.55"/>' +
          '<line x1="-28" y1="12" x2="-28" y2="44" stroke="var(--accent3)" stroke-width="1" opacity="0.55"/>' +
          // Barrette de test d'impression \\\\\\\\ (PJ 1)
          '<g transform="translate(-40, 56)">' +
            '<line x1="0" y1="10" x2="8" y2="0" stroke="var(--accent3)" stroke-width="1.8" opacity="0.75"/>' +
            '<line x1="7" y1="10" x2="15" y2="0" stroke="var(--accent3)" stroke-width="1.8" opacity="0.75"/>' +
            '<line x1="14" y1="10" x2="22" y2="0" stroke="var(--accent)" stroke-width="1.8" opacity="0.75"/>' +
            '<line x1="21" y1="10" x2="29" y2="0" stroke="var(--accent)" stroke-width="1.8" opacity="0.75"/>' +
            '<line x1="28" y1="10" x2="36" y2="0" stroke="var(--accent2)" stroke-width="1.8" opacity="0.75"/>' +
            '<line x1="35" y1="10" x2="43" y2="0" stroke="var(--accent2)" stroke-width="1.8" opacity="0.75"/>' +
            '<line x1="42" y1="10" x2="50" y2="0" stroke="var(--green)" stroke-width="1.8" opacity="0.75"/>' +
            '<line x1="49" y1="10" x2="57" y2="0" stroke="var(--green)" stroke-width="1.8" opacity="0.75"/>' +
          '</g>' +
          // Nuancier quadrichromie CMYK (PJ 2)
          '<g transform="translate(32, 60)">' +
            '<rect x="0" y="0" width="7" height="7" rx="1" fill="var(--accent3)" opacity="0.8"/>' +
            '<rect x="9" y="0" width="7" height="7" rx="1" fill="var(--accent4, #db2777)" opacity="0.8"/>' +
            '<rect x="18" y="0" width="7" height="7" rx="1" fill="var(--accent2)" opacity="0.8"/>' +
            '<rect x="27" y="0" width="7" height="7" rx="1" fill="var(--text)" opacity="0.7"/>' +
          '</g>' +
        '</g>' +
      '</svg>';

    var self = this;
    this.slides.forEach(function(slide, idx) {
      // Décoration uniquement sur la couverture, les intercalaires et la fin (pas sur les diapositives de contenu)
      var isTarget = slide.classList.contains('slide--cover') ||
                     slide.classList.contains('slide--divider') ||
                     idx === 0 ||
                     idx === self.slides.length - 1;
      if (!isTarget) return;
      if (slide.querySelector('.slide-crystals-wrap')) return;

      var wrap = document.createElement('div');
      wrap.className = 'slide-crystals-wrap';
      wrap.innerHTML = svgContentRight;
      slide.appendChild(wrap);
    });
  };
  SlideEngine.prototype.buildChrome=function(){
    var bar=document.createElement('div');bar.className='deck-progress';document.body.appendChild(bar);this.bar=bar;
    var nav=document.createElement('div');nav.className='deck-nav';var self=this;
    var crumb=document.createElement('button');crumb.className='deck-breadcrumb';crumb.type='button';crumb.setAttribute('aria-haspopup','true');crumb.setAttribute('aria-expanded','false');crumb.setAttribute('aria-label','Afficher la navigation des slides près de la barre de progression');nav.appendChild(crumb);
    var dots=document.createElement('div');dots.className='deck-dots';dots.id='deck-slide-dots';dots.setAttribute('role','navigation');dots.setAttribute('aria-label','Navigation des slides');if(this.total>20)dots.classList.add('deck-dots--dense');
    crumb.setAttribute('aria-controls',dots.id);
    var navCloseTimer=null;
    var openNav=function(){clearTimeout(navCloseTimer);nav.classList.add('is-open');crumb.setAttribute('aria-expanded','true');};
    var closeNav=function(force){
      clearTimeout(navCloseTimer);
      if(!force){
        if(crumb.matches(':hover')||dots.matches(':hover'))return;
        if(nav.contains(document.activeElement))return;
      }
      nav.classList.remove('is-open');
      crumb.setAttribute('aria-expanded','false');
    };
    var scheduleClose=function(delay){
      clearTimeout(navCloseTimer);
      navCloseTimer=setTimeout(function(){closeNav();},delay||90);
    };
    this.slides.forEach(function(_,i){
      var d=document.createElement('button');
      var title=self.slideTitles[i]||('Slide '+(i+1));
      d.type='button';
      d.className='deck-dot';
      d.title=title;
      d.setAttribute('aria-label','Aller à la slide '+(i+1)+' — '+title);
      d.addEventListener('click',function(){
        self.goTo(i,'auto');
        closeNav(true);
        if(document.activeElement===d)d.blur();
      });
      dots.appendChild(d);
    });
    nav.appendChild(dots);document.body.appendChild(nav);this.nav=nav;this.breadcrumb=crumb;this.dots=[].slice.call(dots.children);
    crumb.addEventListener('mouseenter',openNav);
    crumb.addEventListener('mouseleave',function(){scheduleClose(110);});
    dots.addEventListener('mouseenter',openNav);
    dots.addEventListener('mouseleave',function(){scheduleClose(110);});
    nav.addEventListener('focusin',openNav);
    nav.addEventListener('focusout',function(){setTimeout(function(){closeNav();},0);});
    crumb.addEventListener('click',function(e){
      openNav();
      if(e.detail===0&&self.dots[self.current])self.dots[self.current].focus();
      else if(document.activeElement===crumb)crumb.blur();
    });
    document.addEventListener('pointerdown',function(e){if(!nav.contains(e.target))closeNav(true);});
    var ctr=document.createElement('div');ctr.className='deck-counter';ctr.setAttribute('aria-live','polite');ctr.setAttribute('aria-atomic','true');document.body.appendChild(ctr);this.counter=ctr;
    var hints=document.createElement('div');hints.className='deck-hints';hints.textContent='\u2190 \u2192 \u2193 \u2191 \u00b7 scroll \u00b7 touch';document.body.appendChild(hints);this.hints=hints;
    this.hintTimer=setTimeout(function(){hints.classList.add('faded');},4000);
  };
  SlideEngine.prototype.bindEvents=function(){
    var self=this;
    document.addEventListener('keydown',function(e){
      if(e.target && typeof e.target.closest === 'function' && e.target.closest('.mermaid-wrap,.table-scroll,.code-scroll,input,textarea,[contenteditable]'))return;
      if(['ArrowDown','ArrowRight',' ','PageDown'].indexOf(e.key)>-1){e.preventDefault();self.next();}
      else if(['ArrowUp','ArrowLeft','PageUp'].indexOf(e.key)>-1){e.preventDefault();self.prev();}
      else if(e.key==='Home'){e.preventDefault();self.goTo(0);}
      else if(e.key==='End'){e.preventDefault();self.goTo(self.total-1);}
      self.fadeHints();
    });
    var tY;
    this.deck.addEventListener('touchstart',function(e){tY=e.touches[0].clientY;},{passive:true});
    this.deck.addEventListener('touchend',function(e){var dy=tY-e.changedTouches[0].clientY;if(Math.abs(dy)>50){dy>0?self.next():self.prev();}});
    this.deck.addEventListener('scroll',function(){
      clearTimeout(self.scrollTimer);
      self.scrollTimer=setTimeout(function(){self.snapToNearest();},140);
    },{passive:true});
  };
  SlideEngine.prototype.observe=function(){
    var self=this;
    var obs=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('visible');entry.target.querySelectorAll('.mermaid-wrap').forEach(function(w){var t=w.querySelector('.mermaid');if(t&&(!t.dataset.baseW||parseFloat(t.dataset.baseW)<40)){var ok=autoFitMermaid(t);if(!ok){/* SVG may not have viewBox yet (was in display:none) — retry after layout */window.requestAnimationFrame(function(){window.requestAnimationFrame(function(){autoFitMermaid(t);var z2=getInitialZoom(w);t.dataset.zoom=String(z2);updateZoomState(w);updateZoomLayout(w);scheduleCenterMermaidViewport(w,true);});});return;}var z=getInitialZoom(w);t.dataset.zoom=String(z);updateZoomState(w);updateZoomLayout(w);}scheduleCenterMermaidViewport(w,true);});self.current=self.slides.indexOf(entry.target);self.update();}});},{threshold:0.5});
    this.slides.forEach(function(s){obs.observe(s);});
    /* Restore slide from URL hash on load — use instant scroll to avoid
       IntersectionObserver race conditions during smooth-scroll */
    var hash=window.location.hash;
    if(hash&&hash.match(/^#slide-\d+$/)){
      var idx=parseInt(hash.replace('#slide-',''),10)-1;
      if(idx>=0&&idx<self.total){
        setTimeout(function(){
          self.goTo(idx,'auto');
        },100);
      }
    }
    /* Also handle popstate and hashchange for browser navigation */
    var handleHashNav=function(){
      var h=window.location.hash;
      if(h&&h.match(/^#slide-\d+$/)){
        var i=parseInt(h.replace('#slide-',''),10)-1;
        if(i>=0&&i<self.total) self.goTo(i,'auto');
      }
    };
    window.addEventListener('popstate',handleHashNav);
    window.addEventListener('hashchange',handleHashNav);
  };
  SlideEngine.prototype.getSlideTop=function(i){
    var slide=this.slides[Math.max(0,Math.min(i,this.total-1))];
    return slide?slide.offsetTop:0;
  };
  SlideEngine.prototype.getNearestSlideIndex=function(){
    var top=this.deck.scrollTop;
    var nearest=0;
    var best=Infinity;
    for(var i=0;i<this.total;i++){
      var diff=Math.abs(this.getSlideTop(i)-top);
      if(diff<best){best=diff;nearest=i;}
    }
    return nearest;
  };
  SlideEngine.prototype.snapToNearest=function(){
    var i=this.getNearestSlideIndex();
    var targetTop=this.getSlideTop(i);
    if(Math.abs(this.deck.scrollTop-targetTop)>2){
      this.goTo(i,'smooth');
    } else if(this.current!==i){
      this.current=i;
      this.update();
    }
  };
  SlideEngine.prototype.goTo=function(i,behavior){
    i=Math.max(0,Math.min(i,this.total-1));
    this.current=i;
    this.update();
    this.deck.scrollTo({top:this.getSlideTop(i),behavior:behavior||'smooth'});
  };
  SlideEngine.prototype.next=function(){if(this.current<this.total-1)this.goTo(this.current+1);};
  SlideEngine.prototype.prev=function(){if(this.current>0)this.goTo(this.current-1);};
  SlideEngine.prototype.buildSectionMap=function(){
    /* Map each slide index to its section color for dot coloring */
    var sectionColors={
      '0':  'var(--part0-neutral-gray)', /* intro — gray */
      '01': 'var(--accent)',   /* partie 1 — yellow */
      '02': 'var(--accent3)',  /* partie 2 — blue */
      '03': 'var(--accent2)',  /* partie 3 — orange */
      '04': 'var(--green)',    /* partie 4 — green */
      '05': 'var(--accent4)'   /* partie 5 — conclusion */
    };
    var sectionNames={
      '0': 'Introduction',
      '01': 'De l\'ADR au modèle',
      '02': 'Containers & comportements',
      '03': 'Collaboration & diff',
      '04': 'Industrialisation',
      '05': 'Bilan & conclusion'
    };
    var current='0';
    var currentSectionTitle=sectionNames[current];
    this.sectionMap=[];
    this.sectionTitles=[];
    this.slideTitles=[];
    for(var i=0;i<this.slides.length;i++){
      var slide=this.slides[i];
      var num=slide.querySelector('.slide__number');
      if(num){
        current=num.textContent.trim();
        currentSectionTitle=sectionNames[current]||currentSectionTitle;
      }
      this.sectionMap[i]=sectionColors[current]||'var(--accent)';
      this.sectionTitles[i]=currentSectionTitle;
      this.slideTitles[i]=slide.getAttribute('data-nav')||(slide.querySelector('.slide__display, .slide__heading')?slide.querySelector('.slide__display, .slide__heading').textContent.replace(/\s+/g,' ').trim():('Slide '+(i+1)));
    }
  };
  SlideEngine.prototype.update=function(){
    this.bar.style.width=((this.current+1)/this.total*100)+'%';
    var c=this.current; var map=this.sectionMap;
    this.dots.forEach(function(d,i){
      var isActive=i===c;
      d.classList.toggle('active',isActive);
      if(isActive){
        d.style.setProperty('background',map[i],'');
        d.style.backgroundClip='content-box';
      } else {
        d.style.setProperty('background',map[i],'');
        d.style.backgroundClip='content-box';
      }
    });
    if(this.breadcrumb){
      this.breadcrumb.setAttribute('aria-label','Afficher la navigation des slides près de la barre de progression — '+(this.sectionTitles[this.current]||'Introduction')+' — '+(this.slideTitles[this.current]||('Slide '+(this.current+1))));
    }
    this.counter.textContent=(this.current+1)+' / '+this.total;
    /* Persist active slide in URL hash via History API */
    if(history.replaceState) history.replaceState(null,'','#slide-'+(this.current+1));
  };
  SlideEngine.prototype.fadeHints=function(){clearTimeout(this.hintTimer);this.hints.classList.add('faded');};

  // Auto-initialisation robuste et indépendante
  window.SlideEngine = SlideEngine;
  function startDeckEngine() {
    if (!window.deckEngine && document.querySelector('.deck')) {
      // Activer immédiatement la première slide
      var firstSlide = document.querySelector('.slide');
      if (firstSlide) firstSlide.classList.add('visible');
      window.deckEngine = new SlideEngine();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startDeckEngine);
  } else {
    startDeckEngine();
  }
