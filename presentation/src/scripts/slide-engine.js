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
    this.injectCardHatchStrips();
    this.buildSectionMap();this.buildChrome();this.bindEvents();this.observe();this.update();
    if(initIdx>0){
      var self=this;
      setTimeout(function(){ self.goTo(initIdx,'auto'); }, 50);
    }
  }
  SlideEngine.prototype.injectCrystals=function(){
    // 1. Haut gauche : Mire circulaire de registre d'angle avec réticule étendu et micro-repères
    var svgTopLeft =
      '<svg viewBox="0 0 64 64" width="64" height="64" class="blueprint-deco blueprint-deco--tl" aria-hidden="true" focusable="false">' +
        '<g transform="translate(32, 32)">' +
          '<circle cx="0" cy="0" r="22" fill="none" stroke="var(--accent)" stroke-width="1.2" opacity="0.6"/>' +
          '<circle cx="0" cy="0" r="10" fill="none" stroke="var(--accent)" stroke-width="0.8" opacity="0.45"/>' +
          '<path d="M0,0 L-22,0 A22,22 0 0,1 0,-22 Z" fill="var(--accent)" opacity="0.2"/>' +
          '<path d="M0,0 L22,0 A22,22 0 0,1 0,22 Z" fill="var(--accent)" opacity="0.2"/>' +
          '<line x1="-30" y1="0" x2="30" y2="0" stroke="var(--accent)" stroke-width="1.2" opacity="0.8"/>' +
          '<line x1="0" y1="-30" x2="0" y2="30" stroke="var(--accent)" stroke-width="1.2" opacity="0.8"/>' +
          '<circle cx="0" cy="0" r="1.5" fill="var(--accent)" opacity="0.95"/>' +
        '</g>' +
      '</svg>';

    // 2. Haut droite : Échelle de calibration quadrichromie CMYK avec pastilles et repères fins
    var svgTopRight =
      '<svg viewBox="0 0 130 26" width="130" height="26" class="blueprint-deco blueprint-deco--tr" aria-hidden="true" focusable="false">' +
        '<g transform="translate(0, 4)">' +
          '<rect x="0" y="0" width="14" height="12" rx="2" fill="var(--accent3)" opacity="0.85"/>' +
          '<rect x="18" y="0" width="14" height="12" rx="2" fill="var(--accent4, #db2777)" opacity="0.85"/>' +
          '<rect x="36" y="0" width="14" height="12" rx="2" fill="var(--accent2)" opacity="0.85"/>' +
          '<rect x="54" y="0" width="14" height="12" rx="2" fill="var(--text)" opacity="0.75"/>' +
          '<text x="7" y="10" font-family="var(--font-mono)" font-size="7" font-weight="700" fill="#ffffff" text-anchor="middle">C</text>' +
          '<text x="25" y="10" font-family="var(--font-mono)" font-size="7" font-weight="700" fill="#ffffff" text-anchor="middle">M</text>' +
          '<text x="43" y="10" font-family="var(--font-mono)" font-size="7" font-weight="700" fill="#ffffff" text-anchor="middle">Y</text>' +
          '<text x="61" y="10" font-family="var(--font-mono)" font-size="7" font-weight="700" fill="#ffffff" text-anchor="middle">K</text>' +
          '<line x1="74" y1="6" x2="120" y2="6" stroke="var(--border-bright)" stroke-width="1.2" stroke-dasharray="3 3"/>' +
          '<circle cx="124" cy="6" r="2" fill="none" stroke="var(--accent)" stroke-width="1"/>' +
        '</g>' +
      '</svg>';

    // 3. Bas gauche : Barrette de hachures biseautées \\\\\\\\\\\\\\\\ bicolore (2 intensités alternées, PJ 1)
    var svgBottomLeft =
      '<svg viewBox="0 0 180 32" width="180" height="32" class="blueprint-deco blueprint-deco--bl" aria-hidden="true" focusable="false">' +
        '<g transform="translate(4, 2)">' +
          '<line x1="0" y1="20" x2="12" y2="2" stroke="var(--accent)" stroke-width="2.8" stroke-linecap="round" opacity="0.95"/>' +
          '<line x1="11" y1="20" x2="23" y2="2" stroke="var(--accent)" stroke-width="2.8" stroke-linecap="round" opacity="0.25"/>' +
          '<line x1="22" y1="20" x2="34" y2="2" stroke="var(--accent)" stroke-width="2.8" stroke-linecap="round" opacity="0.95"/>' +
          '<line x1="33" y1="20" x2="45" y2="2" stroke="var(--accent)" stroke-width="2.8" stroke-linecap="round" opacity="0.25"/>' +
          '<line x1="44" y1="20" x2="56" y2="2" stroke="var(--accent)" stroke-width="2.8" stroke-linecap="round" opacity="0.95"/>' +
          '<line x1="55" y1="20" x2="67" y2="2" stroke="var(--accent)" stroke-width="2.8" stroke-linecap="round" opacity="0.25"/>' +
          '<line x1="66" y1="20" x2="78" y2="2" stroke="var(--accent)" stroke-width="2.8" stroke-linecap="round" opacity="0.95"/>' +
          '<line x1="77" y1="20" x2="89" y2="2" stroke="var(--accent)" stroke-width="2.8" stroke-linecap="round" opacity="0.25"/>' +
          '<line x1="88" y1="20" x2="100" y2="2" stroke="var(--accent)" stroke-width="2.8" stroke-linecap="round" opacity="0.95"/>' +
          '<line x1="99" y1="20" x2="111" y2="2" stroke="var(--accent)" stroke-width="2.8" stroke-linecap="round" opacity="0.25"/>' +
          '<line x1="110" y1="20" x2="122" y2="2" stroke="var(--accent)" stroke-width="2.8" stroke-linecap="round" opacity="0.95"/>' +
          '<line x1="121" y1="20" x2="133" y2="2" stroke="var(--accent)" stroke-width="2.8" stroke-linecap="round" opacity="0.25"/>' +
          '<line x1="132" y1="20" x2="144" y2="2" stroke="var(--accent)" stroke-width="2.8" stroke-linecap="round" opacity="0.95"/>' +
          '<line x1="143" y1="20" x2="155" y2="2" stroke="var(--accent)" stroke-width="2.8" stroke-linecap="round" opacity="0.25"/>' +
          '<line x1="154" y1="20" x2="166" y2="2" stroke="var(--accent)" stroke-width="2.8" stroke-linecap="round" opacity="0.95"/>' +
          '<line x1="0" y1="26" x2="168" y2="26" stroke="var(--accent)" stroke-width="1.2" opacity="0.45" stroke-dasharray="3 3"/>' +
        '</g>' +
      '</svg>';

    // 4. Bas droite : Cible stellaire technique / mire de précision circulaire
    var svgBottomRight =
      '<svg viewBox="0 0 54 54" width="54" height="54" class="blueprint-deco blueprint-deco--br" aria-hidden="true" focusable="false">' +
        '<g transform="translate(27, 27)">' +
          '<circle cx="0" cy="0" r="20" fill="none" stroke="var(--accent)" stroke-width="1.2" opacity="0.6"/>' +
          '<circle cx="0" cy="0" r="10" fill="none" stroke="var(--accent2)" stroke-width="1" stroke-dasharray="2 2" opacity="0.65"/>' +
          '<line x1="-25" y1="0" x2="25" y2="0" stroke="var(--accent)" stroke-width="1.2" opacity="0.75"/>' +
          '<line x1="0" y1="-25" x2="0" y2="25" stroke="var(--accent)" stroke-width="1.2" opacity="0.75"/>' +
          '<circle cx="0" cy="0" r="2" fill="var(--accent)" opacity="0.9"/>' +
        '</g>' +
      '</svg>';

    var self = this;
    this.slides.forEach(function(slide, idx) {
      // Décorations périphériques réparties sur toutes les diapos où l'espace le permet (titres, dividers, citations, splits, concept-cards...)
      // On exclut uniquement les diapos denses de code interactif et diagrammes pleine largeur pour éviter les collisions visuelles
      var isDense = slide.classList.contains('slide--code-preview') ||
                    slide.classList.contains('slide--diagram') ||
                    slide.classList.contains('slide--c4-zoom') ||
                    slide.getAttribute('data-nav') === 'Ressources & QR';
      if (isDense) return;
      if (slide.querySelector('.blueprint-deco-frame')) return;

      var frame = document.createElement('div');
      frame.className = 'blueprint-deco-frame';
      frame.innerHTML = svgTopLeft + svgTopRight + svgBottomLeft + svgBottomRight;
      slide.appendChild(frame);
    });
  };
  SlideEngine.prototype.injectCardHatchStrips=function(){
    // Barrette de hachures biseautées identique à la planche de référence et aux diapos titres
    var svgHatch =
      '<svg viewBox="0 0 100 24" width="100" height="24" class="card-hatch-strip" aria-hidden="true" focusable="false">' +
        '<g transform="translate(3, 2)">' +
          '<line x1="0" y1="15" x2="9" y2="1" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" opacity="0.95"/>' +
          '<line x1="9" y1="15" x2="18" y2="1" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" opacity="0.22"/>' +
          '<line x1="18" y1="15" x2="27" y2="1" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" opacity="0.95"/>' +
          '<line x1="27" y1="15" x2="36" y2="1" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" opacity="0.22"/>' +
          '<line x1="36" y1="15" x2="45" y2="1" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" opacity="0.95"/>' +
          '<line x1="45" y1="15" x2="54" y2="1" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" opacity="0.22"/>' +
          '<line x1="54" y1="15" x2="63" y2="1" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" opacity="0.95"/>' +
          '<line x1="63" y1="15" x2="72" y2="1" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" opacity="0.22"/>' +
          '<line x1="72" y1="15" x2="81" y2="1" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" opacity="0.95"/>' +
          '<line x1="81" y1="15" x2="90" y2="1" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" opacity="0.22"/>' +
          '<line x1="0" y1="19" x2="92" y2="19" stroke="currentColor" stroke-width="1.2" opacity="0.45" stroke-dasharray="2.5 2.5"/>' +
        '</g>' +
      '</svg>';

    var targets = document.querySelectorAll(
      '.concept-card, .benefit-card, .review-questions__card, .lane-card, .key-card, .speaker-card, .speaker-panel, .slide--split .slide__panel'
    );
    targets.forEach(function(el) {
      if (el.querySelector('.card-hatch-strip')) return;
      var div = document.createElement('div');
      div.className = 'card-hatch-strip-wrap';
      div.innerHTML = svgHatch;
      el.appendChild(div);
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
    var tY, tX, isMultiTouch = false;
    this.deck.addEventListener('touchstart',function(e){
      if(e.touches && e.touches.length > 1){
        isMultiTouch = true;
        return;
      }
      isMultiTouch = false;
      tY = e.touches[0].clientY;
      tX = e.touches[0].clientX;
    },{passive:true});
    this.deck.addEventListener('touchend',function(e){
      if(isMultiTouch){
        isMultiTouch = false;
        return;
      }
      // Si l'utilisateur est en train de zoomer dans la page (pinch-to-zoom), ne pas changer de diapositive
      if(window.visualViewport && window.visualViewport.scale > 1.05){
        return;
      }
      // Ne pas intercepter les swipes à l'intérieur des conteneurs interactifs, diagrammes, iframes ou contrôles
      if(e.target && typeof e.target.closest === 'function'){
        if(e.target.closest('.mermaid-wrap, .embed-wrap, iframe, .code-preview__pane, .zoom-controls, .embed-controls, button, a, select, input, textarea')){
          return;
        }
      }
      if(typeof tY !== 'number') return;
      var dy = tY - e.changedTouches[0].clientY;
      var dx = (typeof tX === 'number') ? Math.abs(tX - e.changedTouches[0].clientX) : 0;
      // Valider un swipe résolument vertical
      if(Math.abs(dy) > 50 && Math.abs(dy) > dx * 1.2){
        dy > 0 ? self.next() : self.prev();
      }
      tY = null;
      tX = null;
    });
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
