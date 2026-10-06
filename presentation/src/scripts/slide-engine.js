/* ============ SlideEngine ============ */
  function SlideEngine(){
    this.deck=document.querySelector('.deck');
    this.slides=[].slice.call(document.querySelectorAll('.slide'));
    this.total=this.slides.length;
    this.isInIframe = false;
    try {
      this.isInIframe = (window.self !== window.top) || (window.location.search.indexOf('role=preview') > -1);
    } catch(e) {
      this.isInIframe = true;
    }
    if (this.isInIframe) {
      document.documentElement.classList.add('is-iframe-preview');
    }

    var hash=window.location.hash;
    var initIdx=0;
    if(!this.isInIframe && hash && hash.match(/^#slide-\d+$/)){
      var parsed=parseInt(hash.replace('#slide-',''),10)-1;
      if(parsed>=0&&parsed<this.total) initIdx=parsed;
    }
    this.current=initIdx;
    this.isResizing=false;
    this.isNavigating=false;
    this.resizeTimer=null;
    this.scrollTimer=null;
    if(initIdx>0){
      var targetTop=this.getSlideTop(initIdx);
      this.deck.scrollTo({top:targetTop,behavior:'instant'});
    }
    this.injectCrystals();
    this.injectCardHatchStrips();
    this.initPresenterSync();
    this.displayStream=null;
    this.peerConnection=null;
    this.initStreamEmitter();
    this.buildSectionMap();this.buildChrome();this.bindEvents();this.observe();this.update();
    this.initOrientationLock();
    if(initIdx>0){
      var self=this;
      setTimeout(function(){
        self.goTo(initIdx,'instant');
        if(self.slides[initIdx] && typeof window.loadSlideEmbeds === 'function'){
          window.loadSlideEmbeds(self.slides[initIdx]);
        }
      }, 50);
    } else {
      if(this.slides[0] && typeof window.loadSlideEmbeds === 'function'){
        window.loadSlideEmbeds(this.slides[0]);
      }
    }
    this.broadcastDeckReloaded();
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
      // Décorations périphériques réparties sur toutes les diapos où l'espace le permet (titres, dividers, citations, splits légers...)
      // On exclut les diapos denses de code, diagrammes, schémas larges, comparatifs chargés et portail pour éviter toute superposition
      var isDense = slide.classList.contains('slide--code-preview') ||
                    slide.classList.contains('slide--diagram') ||
                    slide.classList.contains('slide--c4-zoom') ||
                    slide.classList.contains('slide--portal-vivant') ||
                    (slide.getAttribute('data-nav') && (
                      slide.getAttribute('data-nav').indexOf('Ressources') > -1 ||
                      slide.getAttribute('data-nav') === 'V1 vs V2' ||
                      slide.getAttribute('data-nav') === 'Avant / Après' ||
                      slide.getAttribute('data-nav') === 'Portail vivant'
                    ));
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
      '.concept-card:not(.benefit-card), .review-questions__card, .lane-card, .key-card, .speaker-card, .speaker-panel, .slide--split:not([data-nav="V1 vs V2"]) .slide__panel'
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

    var hints=document.createElement('div');hints.className='deck-hints';hints.textContent='\u2190 \u2192 \u2193 \u2191 \u00b7 scroll \u00b7 touch \u00b7 P';document.body.appendChild(hints);this.hints=hints;
    this.hintTimer=setTimeout(function(){hints.classList.add('faded');},4000);
  };
  SlideEngine.prototype.bindEvents=function(){
    var self=this;
    if(this.isInIframe) return; // Ne pas intercepter les touches ou les scrolls en mode preview
    document.addEventListener('keydown',function(e){
      if(e.target && typeof e.target.closest === 'function' && e.target.closest('.mermaid-wrap,.table-scroll,.code-scroll,input,textarea,[contenteditable]'))return;
      if(['ArrowDown','ArrowRight',' ','PageDown'].indexOf(e.key)>-1){e.preventDefault();self.next();}
      else if(['ArrowUp','ArrowLeft','PageUp'].indexOf(e.key)>-1){e.preventDefault();self.prev();}
      else if(e.key==='Home'){e.preventDefault();self.goTo(0);}
      else if(e.key==='End'){e.preventDefault();self.goTo(self.total-1);}
      else if(e.key==='p'||e.key==='P'){e.preventDefault();self.openPresenterView();}
      else if(e.key==='.'||e.key==='b'||e.key==='B'){e.preventDefault();self.toggleBlackout();}
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
    this.deck.addEventListener('touchmove',function(e){
      if(e.touches && e.touches.length > 1){
        isMultiTouch = true;
      }
    },{passive:true});
    this.deck.addEventListener('touchend',function(e){
      if(isMultiTouch){
        if(!e.touches || e.touches.length === 0){
          isMultiTouch = false;
        }
        return;
      }
      // Si l'utilisateur est en train de zoomer dans la page (pinch-to-zoom), ne pas changer de diapositive
      if(window.visualViewport && window.visualViewport.scale > 1.05){
        return;
      }
      // Ne pas intercepter les swipes à l'intérieur des conteneurs interactifs, diagrammes, iframes, blocs de code ou contrôles
      if(e.target && typeof e.target.closest === 'function'){
        if(e.target.closest('.mermaid-wrap, .embed-wrap, iframe, .code-preview__pane, .slide__code-block, pre, code, .workspace-tree__tab-bar, .code-preview__tab-bar, .zoom-controls, .embed-controls, button, a, select, input, textarea')){
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
      if(self.isResizing || self.isNavigating){
        if(self.scrollTimer){
          clearTimeout(self.scrollTimer);
          self.scrollTimer = null;
        }
        return;
      }
      clearTimeout(self.scrollTimer);
      self.scrollTimer=setTimeout(function(){self.snapToNearest();},140);
    },{passive:true});

    /* Verrouillage strict et recalage instantané pendant tout redimensionnement (ex: barre d'outils / menu Firefox) */
    var lastH = window.innerHeight;
    var lastW = window.innerWidth;
    var handleResize = function(){
      if(!self.deck) return;
      var newH = window.innerHeight;
      var newW = window.innerWidth;
      if(Math.abs(newH - lastH) < 2 && Math.abs(newW - lastW) < 2) return;
      lastH = newH;
      lastW = newW;

      // Détection de redimensionnement de la fenêtre : verrouiller sur la slide active
      self.isResizing = true;
      self.deck.classList.add('is-resizing');

      // Repositionnement immédiat sur la slide active sans changer de slide
      var targetTop = self.getSlideTop(self.current);
      self.deck.scrollTop = targetTop;

      // Recalage synchrone dans la trame de rendu (élimine tout tressautement d'une trame)
      if(!self._resizeRaf){
        self._resizeRaf = requestAnimationFrame(function(){
          self._resizeRaf = 0;
          if(self.deck && self.slides[self.current]){
            self.deck.scrollTop = self.getSlideTop(self.current);
          }
        });
      }

      if(self.resizeTimer) clearTimeout(self.resizeTimer);
      self.resizeTimer = setTimeout(function(){
        self.resizeTimer = null;
        if(self._resizeRaf){
          cancelAnimationFrame(self._resizeRaf);
          self._resizeRaf = 0;
        }
        if(self.deck && self.slides[self.current]){
          var finalTop = self.getSlideTop(self.current);
          self.deck.scrollTop = finalTop;
          self.deck.classList.remove('is-resizing');
          self.slides[self.current].classList.add('visible');
          self.update();
        }
        self.isResizing = false;
      }, 60);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    if(window.visualViewport){
      window.visualViewport.addEventListener('resize', handleResize, { passive: true });
    }
  };
  SlideEngine.prototype.observe=function(){
    var self=this;
    if(this.isInIframe) return; // Ne pas observer ni recalculer de layout en mode preview iframe
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          if(typeof window.loadSlideEmbeds === 'function'){
            window.loadSlideEmbeds(entry.target);
          }
          entry.target.querySelectorAll('.mermaid-wrap').forEach(function(w){
            var t=w.querySelector('.mermaid');
            if(t&&(!t.dataset.baseW||parseFloat(t.dataset.baseW)<40)){
              var ok=autoFitMermaid(t);
              if(!ok){
                window.requestAnimationFrame(function(){
                  window.requestAnimationFrame(function(){
                    autoFitMermaid(t);
                    var z2=getInitialZoom(w);
                    t.dataset.zoom=String(z2);
                    updateZoomState(w);
                    updateZoomLayout(w);
                    scheduleCenterMermaidViewport(w,true);
                  });
                });
                return;
              }
              var z=getInitialZoom(w);
              t.dataset.zoom=String(z);
              updateZoomState(w);
              updateZoomLayout(w);
            }
            scheduleCenterMermaidViewport(w,true);
          });
          var newIdx=self.slides.indexOf(entry.target);
          if(!self.isNavigating && !self.isResizing && newIdx!==-1 && newIdx!==self.current){
            self.current=newIdx;
            self.update();
          }
        }
      });
    },{threshold:0.5});
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
    if(this.isInIframe || this.isNavigating || this.isResizing) return;
    var i=this.getNearestSlideIndex();
    var targetTop=this.getSlideTop(i);
    if(Math.abs(this.deck.scrollTop-targetTop)>2){
      this.goTo(i,'smooth');
    } else if(this.current!==i){
      this.current=i;
      this.update();
    }
  };
  SlideEngine.prototype.getSlideSteps=function(slide){
    if(!slide) return [];
    if(slide.classList.contains('slide--live-coding')){
      return ['launcher','1','2','3'];
    }
    if(slide.classList.contains('slide--pr-review')){
      return ['1','2','3'];
    }
    if(slide.classList.contains('slide--c2-unified')){
      return ['1','2'];
    }
    if(slide.classList.contains('slide--c2-evolution')){
      return ['all','1','2','3','4'];
    }
    var stepEls=slide.querySelectorAll('[data-step]');
    if(!stepEls.length) return [];
    var stepSet={};
    stepEls.forEach(function(el){
      var s=el.getAttribute('data-step');
      if(s) stepSet[s]=true;
    });
    return Object.keys(stepSet).sort(function(a,b){ return parseInt(a,10)-parseInt(b,10); });
  };
  SlideEngine.prototype.getSlideCurrentStep=function(slide){
    if(!slide) return null;
    if(slide.classList.contains('slide--live-coding')){
      var view=slide.getAttribute('data-view')||'launcher';
      if(view==='launcher') return 'launcher';
      var cb=slide.querySelector('.live-coding__code-block');
      return (cb&&cb.getAttribute('data-active-step'))||'1';
    }
    if(slide.classList.contains('slide--c2-unified')){
      var c2View=slide.getAttribute('data-view')||'mermaid';
      return c2View==='likec4'?'2':'1';
    }
    if(slide.classList.contains('slide--c2-evolution')){
      return slide.getAttribute('data-active-step')||'all';
    }
    if(slide.hasAttribute('data-active-step')){
      return slide.getAttribute('data-active-step');
    }
    var codeBlock=slide.querySelector('.slide__code-block');
    if(codeBlock&&codeBlock.hasAttribute('data-active-step')){
      return codeBlock.getAttribute('data-active-step');
    }
    return null;
  };
  SlideEngine.prototype.setSlideStep=function(slide,step,smooth){
    if(!slide) return;
    if(slide.classList.contains('slide--live-coding')){
      if(step==='launcher'){
        slide.setAttribute('data-view','launcher');
        var launcherBtn=slide.querySelector('.live-coding__launcher-btn');
        if(launcherBtn) launcherBtn.setAttribute('aria-expanded','false');
      } else {
        slide.setAttribute('data-view','detail');
        var launcherBtn=slide.querySelector('.live-coding__launcher-btn');
        if(launcherBtn) launcherBtn.setAttribute('aria-expanded','true');
        var wrap=slide.querySelector('.live-coding__embed-wrap');
        if(wrap&&typeof startEmbedLoad==='function') startEmbedLoad(wrap);
        var cb=slide.querySelector('.live-coding__code-block');
        if(cb) cb.setAttribute('data-active-step',step);
      }
    } else if(slide.classList.contains('slide--pr-review')){
      slide.setAttribute('data-active-step',step);
      var modal=slide.querySelector('.pr-backup-modal');
      var launcherBtn=slide.querySelector('.launcher__btn');
      var codeTarget='diff-9031cdbb9779e2eb895e031359654e67f1bdfcda75eb412800c6ea3b5529fe1e';
      var visualTarget='diff-94c54a1f3101c4266eb3ddad9e0c922c14015c322845a26e93952f348c76d6c0';
      if(step==='1'){
        // Modal fermé : vue gitGraph
        if(modal){
          modal.classList.remove('is-open');
          modal.style.display='none';
          modal.setAttribute('aria-hidden','true');
        }
        if(launcherBtn) launcherBtn.setAttribute('aria-expanded','false');
      } else if(step==='2'){
        // Modal ouvert : Diff de code LikeC4
        if(modal){
          modal.classList.add('is-open');
          modal.style.display='flex';
          modal.setAttribute('aria-hidden','false');
        }
        if(launcherBtn) launcherBtn.setAttribute('aria-expanded','true');
        if(typeof window.jumpPrDiff==='function'){
          window.jumpPrDiff(codeTarget);
        }
      } else if(step==='3'){
        // Modal ouvert : Diff visuel slider
        if(modal){
          modal.classList.add('is-open');
          modal.style.display='flex';
          modal.setAttribute('aria-hidden','false');
        }
        if(launcherBtn) launcherBtn.setAttribute('aria-expanded','true');
        if(typeof window.jumpPrDiff==='function'){
          window.jumpPrDiff(visualTarget);
        }
      }
    } else if(slide.classList.contains('slide--c2-unified')){
      var targetView = (step === '2' || step === 'likec4') ? 'likec4' : 'mermaid';
      if(typeof window.setC2UnifiedView === 'function'){
        window.setC2UnifiedView(slide, targetView);
      } else {
        slide.setAttribute('data-view', targetView);
        slide.setAttribute('data-active-step', step);
      }
    } else if(slide.classList.contains('slide--c2-evolution')){
      slide.setAttribute('data-active-step',step);
      var codeBlocks=slide.querySelectorAll('.slide__code-block');
      codeBlocks.forEach(function(cb){
        cb.setAttribute('data-active-step',step);
      });
      if(step==='4'){
        if(typeof window.activateSlideCodeTab==='function'){
          window.activateSlideCodeTab(slide,'views');
        }
      } else {
        if(typeof window.activateSlideCodeTab==='function'){
          window.activateSlideCodeTab(slide,'model');
        }
      }
    } else {
      slide.setAttribute('data-active-step',step);
      var codeBlocks=slide.querySelectorAll('.slide__code-block');
      codeBlocks.forEach(function(cb){
        cb.setAttribute('data-active-step',step);
      });
      // Synchroniser avec les onglets de code si présents
      var targetEl=slide.querySelector('[data-step="'+step+'"]');
      if(targetEl){
        var tabContent=targetEl.closest('.code-preview__tab-content') || targetEl.closest('.workspace-tree__tab-content');
        if(tabContent&&tabContent.getAttribute('data-tab-id')){
          var tabId=tabContent.getAttribute('data-tab-id');
          if(typeof window.activateSlideCodeTab==='function'){
            window.activateSlideCodeTab(slide,tabId);
          }
          if(typeof window.switchWorkspaceTreeTab==='function'){
            window.switchWorkspaceTreeTab(slide,tabId);
          }
        }
      }
      // Synchroniser d'éventuels boutons de stepper
      slide.querySelectorAll('.code-stepper__btn').forEach(function(b){
        var match=(b.getAttribute('data-step-target')===step);
        b.classList.toggle('is-active',match);
        b.setAttribute('aria-selected',match?'true':'false');
      });
    }
    // Défilement automatique du conteneur de code vers la portion révélée
    if(typeof window.scrollCodeStepIntoView === 'function'){
      window.scrollCodeStepIntoView(slide, step, smooth !== false);
    }
    if(!this.isInIframe){
      this.broadcastSlideChange();
    }
  };
  SlideEngine.prototype.initPresenterSync=function(){
    var self=this;
    if(this.isInIframe){
      // En iframe (mode preview), écouter UNIQUEMENT les commandes postMessage du parent
      window.addEventListener('message',function(ev){
        var data=ev.data;
        if(!data)return;
        if((data.type==='SET_PREVIEW_SLIDE'||data.type==='GOTO_SLIDE')&&typeof data.index==='number'){
          self.current=Math.max(0,Math.min(data.index,self.total-1));
          self.cleanupInactiveModals(self.current);
          self.slides.forEach(function(s,idx){
            s.classList.toggle('visible',idx===self.current);
          });
          var targetSlide=self.slides[self.current];
          if(targetSlide){
            var steps=self.getSlideSteps(targetSlide);
            if(steps.length>0){
              self.setSlideStep(targetSlide,data.step||steps[0]);
            }
          }
          if(self.deck){
            self.deck.scrollTop=self.getSlideTop(self.current);
          }
        } else if((data.type==='SET_THEME'||data.type==='deck-theme-change')&&data.theme){
          if(window.setDeckTheme) window.setDeckTheme(data.theme, true);
        }
      });
      // Signaler au parent que l'iframe deck est prête
      try{
        if(window.parent&&window.parent!==window){
          window.parent.postMessage({type:'IFRAME_DECK_READY'},'*');
        }
      }catch(e){}
      return;
    }
    if(typeof window.BroadcastChannel==='function'){
      try{
        this.presenterChannel=new BroadcastChannel('dac-presenter-channel');
        this.presenterChannel.onmessage=function(ev){
          var data=ev.data;
          if(!data)return;
          if(data.type==='GOTO_SLIDE'&&typeof data.index==='number'){
            self.goTo(data.index,'auto',data.step);
          } else if(data.type==='NAV_NEXT'){
            self.next();
          } else if(data.type==='NAV_PREV'){
            self.prev();
          } else if(data.type==='TOGGLE_BLACKOUT'){
            self.toggleBlackout(data.force);
          } else if(data.type==='SET_THEME'&&data.theme){
            if(window.setDeckTheme) window.setDeckTheme(data.theme, true);
          } else if(data.type==='TOGGLE_THEME'){
            if(window.toggleDeckTheme) window.toggleDeckTheme();
          } else if(data.type==='TOGGLE_READABILITY'){
            if(window.toggleReadabilityMode) window.toggleReadabilityMode();
          } else if(data.type==='SET_READABILITY'&&data.mode){
            if(window.setReadabilityMode) window.setReadabilityMode(data.mode);
          } else if(data.type==='REQUEST_SYNC'){
            self.broadcastSlideChange();
          } else if(data.type==='STREAM_REQUEST_OFFER'){
            self.handleStreamRequestOffer();
          } else if(data.type==='STREAM_ANSWER'){
            self.handleStreamAnswer(data);
          } else if(data.type==='STREAM_ICE_CANDIDATE'){
            self.handleStreamIceCandidate(data);
          } else if(data.type==='STREAM_STOP_REQUEST'){
            self.stopDisplayStream();
          }
        };
      }catch(e){
        this.presenterChannel=null;
      }
    }
    // S'enregistrer sur storage UNIQUEMENT si BroadcastChannel n'est pas disponible
    if(!this.presenterChannel){
      window.addEventListener('storage',function(ev){
        if(ev.key==='dac_goto_slide'&&ev.newValue){
          try{
            var parsed=JSON.parse(ev.newValue);
            if(typeof parsed.index==='number'){
              self.goTo(parsed.index,'auto',parsed.step);
            }
          }catch(e){}
        } else if(ev.key==='dac_nav_action'&&ev.newValue){
          try{
            var act=JSON.parse(ev.newValue);
            if(act.action==='next') self.next();
            else if(act.action==='prev') self.prev();
          }catch(e){}
        } else if(ev.key==='dac_blackout'&&ev.newValue){
          try{
            var b=JSON.parse(ev.newValue);
            self.toggleBlackout(b.isBlackout);
          }catch(e){}
        }
      });
    }
  };
  SlideEngine.prototype.broadcastSlideChange=function(){
    if(this.isInIframe) return; // Ne jamais émettre depuis un iframe de preview
    var currentSlide=this.slides[this.current];
    var currentTheme=document.documentElement.getAttribute('data-theme')||'google-blueprint-light';
    var payload={
      type:'SLIDE_CHANGED',
      index:this.current,
      step:this.getSlideCurrentStep(currentSlide),
      total:this.total,
      slideTitle:this.slideTitles[this.current]||('Slide '+(this.current+1)),
      sectionTitle:this.sectionTitles[this.current]||'',
      theme:currentTheme,
      timestamp:Date.now()
    };
    if(this.presenterChannel){
      try{
        this.presenterChannel.postMessage(payload);
        return; // Ne pas dupliquer dans localStorage si BroadcastChannel fonctionne
      }catch(e){}
    }
    try{
      localStorage.setItem('dac_current_slide',JSON.stringify(payload));
    }catch(e){}
  };
  SlideEngine.prototype.broadcastDeckReloaded=function(){
    if(this.isInIframe) return; // Ne jamais émettre depuis un iframe de preview
    var currentSlide=this.slides[this.current];
    var currentTheme=document.documentElement.getAttribute('data-theme')||'google-blueprint-light';
    var payload={
      type:'DECK_RELOADED',
      index:this.current,
      step:this.getSlideCurrentStep(currentSlide),
      total:this.total,
      slideTitle:this.slideTitles[this.current]||('Slide '+(this.current+1)),
      sectionTitle:this.sectionTitles[this.current]||'',
      theme:currentTheme,
      timestamp:Date.now()
    };
    if(this.presenterChannel){
      try{
        this.presenterChannel.postMessage(payload);
      }catch(e){}
    }
    try{
      localStorage.setItem('dac_deck_reloaded',JSON.stringify(payload));
    }catch(e){}
  };
  SlideEngine.prototype.openPresenterView=function(){
    var currentSlide=this.slides[this.current];
    var curStep=this.getSlideCurrentStep(currentSlide);
    var url='./presenter-view.html#slide-'+(this.current+1);
    var w=Math.min(1440,screen.availWidth);
    var h=Math.min(900,screen.availHeight);
    var left=window.screenX||0;
    var top=window.screenY||0;
    var features='width='+w+',height='+h+',left='+left+',top='+top+',menubar=no,toolbar=no,location=yes,status=no,resizable=yes,scrollbars=yes';
    window.open(url,'dac-presenter-view',features);
  };
  SlideEngine.prototype.toggleBlackout=function(force){
    var bo=document.querySelector('.deck-blackout');
    if(!bo){
      bo=document.createElement('div');
      bo.className='deck-blackout';
      bo.style.cssText='position:fixed;inset:0;background:#000;z-index:99999;display:none;cursor:none;';
      document.body.appendChild(bo);
    }
    var shouldBeBlack=(typeof force==='boolean')?force:(bo.style.display!=='block');
    bo.style.display=shouldBeBlack?'block':'none';
    if(this.presenterChannel){
      try{this.presenterChannel.postMessage({type:'BLACKOUT_CHANGED',isBlackout:shouldBeBlack});}catch(e){}
    }
    try{
      localStorage.setItem('dac_blackout',JSON.stringify({isBlackout:shouldBeBlack,timestamp:Date.now()}));
    }catch(e){}
  };
  SlideEngine.prototype.cleanupInactiveModals=function(activeIdx){
    var c = typeof activeIdx === 'number' ? activeIdx : this.current;
    this.slides.forEach(function(s, idx){
      var isCurrent = (idx === c);
      s.classList.toggle('is-current', isCurrent);
      if(!isCurrent && s.classList.contains('slide--pr-review')){
        var modal = s.querySelector('.pr-backup-modal');
        if(modal && (modal.classList.contains('is-open') || modal.style.display !== 'none')){
          modal.classList.remove('is-open');
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
        }
        var btn = s.querySelector('.launcher__btn');
        if(btn) btn.setAttribute('aria-expanded', 'false');
        s.setAttribute('data-active-step', '1');
      }
    });
  };
  SlideEngine.prototype.goTo=function(i,behavior,initialStep){
    if(this.resizeTimer){
      clearTimeout(this.resizeTimer);
      this.resizeTimer = null;
    }
    this.isResizing = false;
    if(this.deck){
      this.deck.classList.remove('is-resizing');
      this.deck.style.scrollSnapType = '';
    }
    i=Math.max(0,Math.min(i,this.total-1));
    this.cleanupInactiveModals(i);
    this.current=i;
    var targetSlide=this.slides[i];
    if(targetSlide){
      targetSlide.classList.add('visible');
      if(typeof window.loadSlideEmbeds === 'function'){
        window.loadSlideEmbeds(targetSlide);
      }
    }
    var steps=this.getSlideSteps(targetSlide);
    if(steps.length>0){
      var stepToSet=initialStep||steps[0];
      this.setSlideStep(targetSlide,stepToSet,behavior!=='instant');
    }
    this.update();
    this.isNavigating = true;
    clearTimeout(this.scrollTimer);
    var self = this;
    setTimeout(function(){ self.isNavigating = false; }, 400);
    this.deck.scrollTo({top:this.getSlideTop(i),behavior:behavior||'smooth'});
  };
  SlideEngine.prototype.next=function(){
    var slide=this.slides[this.current];
    var steps=this.getSlideSteps(slide);
    if(steps.length>0){
      var curStep=this.getSlideCurrentStep(slide);
      var curIdx=steps.indexOf(curStep);
      if(curIdx>=0&&curIdx<steps.length-1){
        this.setSlideStep(slide,steps[curIdx+1],true);
        return;
      }
    }
    if(this.current<this.total-1){
      this.goTo(this.current+1,'smooth');
    }
  };
  SlideEngine.prototype.prev=function(){
    var slide=this.slides[this.current];
    var steps=this.getSlideSteps(slide);
    if(steps.length>0){
      var curStep=this.getSlideCurrentStep(slide);
      var curIdx=steps.indexOf(curStep);
      if(curIdx>0){
        this.setSlideStep(slide,steps[curIdx-1],true);
        return;
      }
    }
    if(this.current>0){
      var prevIdx=this.current-1;
      var prevSlide=this.slides[prevIdx];
      var prevSteps=this.getSlideSteps(prevSlide);
      var lastStep=prevSteps.length>0?prevSteps[prevSteps.length-1]:null;
      this.goTo(prevIdx,'smooth',lastStep);
    }
  };
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
    this.cleanupInactiveModals(this.current);
    if(this.slides[this.current]){
      this.slides[this.current].classList.add('visible');
    }
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
    this.broadcastSlideChange();
  };

  /* ============ DISPLAY STREAM EMITTER & WEBRTC P2P ============ */
  SlideEngine.prototype.initStreamEmitter = function() {
    if (this.isInIframe) return;
    var self = this;
    window.addEventListener('beforeunload', function() {
      self.stopDisplayStream();
    });
  };

  SlideEngine.prototype.toggleDisplayStream = function() {
    if (this.displayStream && this.displayStream.active) {
      this.stopDisplayStream();
    } else {
      this.startDisplayStream();
    }
  };

  SlideEngine.prototype.startDisplayStream = function() {
    var self = this;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      console.warn('[SlideEngine] getDisplayMedia non supporté dans cet environnement.');
      return Promise.resolve(null);
    }
    var options = {
      video: {
        displaySurface: 'browser',
        frameRate: { ideal: 60, max: 60 },
        cursor: 'never'
      },
      audio: false,
      preferCurrentTab: true
    };
    return navigator.mediaDevices.getDisplayMedia(options).then(function(stream) {
      self.displayStream = stream;

      if (self.presenterChannel) {
        self.presenterChannel.postMessage({ type: 'STREAM_STATUS', active: true });
      }

      self.initWebRtcEmitter();

      var videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = function() {
          self.stopDisplayStream();
        };
      }
      return stream;
    }).catch(function(err) {
      console.warn('[SlideEngine] Capture écran annulée ou refusée:', err);
      return null;
    });
  };

  SlideEngine.prototype.initWebRtcEmitter = function() {
    var self = this;
    if (!this.displayStream) return;
    if (this.peerConnection) {
      try { this.peerConnection.close(); } catch(e){}
      this.peerConnection = null;
    }
    try {
      var pc = new RTCPeerConnection({ iceServers: [] });
      this.peerConnection = pc;

      this.displayStream.getTracks().forEach(function(track) {
        pc.addTrack(track, self.displayStream);
      });

      pc.onicecandidate = function(e) {
        if (e.candidate && self.presenterChannel) {
          var candObj = e.candidate.toJSON ? e.candidate.toJSON() : {
            candidate: e.candidate.candidate,
            sdpMid: e.candidate.sdpMid,
            sdpMLineIndex: e.candidate.sdpMLineIndex
          };
          self.presenterChannel.postMessage({
            type: 'STREAM_ICE_CANDIDATE',
            candidate: candObj,
            from: 'public'
          });
        }
      };

      pc.createOffer({
        offerToReceiveVideo: false,
        offerToReceiveAudio: false
      }).then(function(offer) {
        return pc.setLocalDescription(offer);
      }).then(function() {
        if (self.presenterChannel && pc.localDescription) {
          self.presenterChannel.postMessage({
            type: 'STREAM_OFFER',
            sdp: {
              type: pc.localDescription.type,
              sdp: pc.localDescription.sdp
            }
          });
        }
      }).catch(function(err) {
        console.warn('[SlideEngine] Erreur createOffer WebRTC:', err);
      });
    } catch(err) {
      console.warn('[SlideEngine] Erreur initialisation WebRTC:', err);
    }
  };

  SlideEngine.prototype.handleStreamAnswer = function(data) {
    if (this.peerConnection && data && data.sdp) {
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp)).catch(function(err) {
        console.warn('[SlideEngine] Erreur setRemoteDescription answer:', err);
      });
    }
  };

  SlideEngine.prototype.handleStreamIceCandidate = function(data) {
    if (this.peerConnection && data && data.candidate && data.from === 'receiver') {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(function(){});
    }
  };

  SlideEngine.prototype.handleStreamRequestOffer = function() {
    if (this.displayStream && this.displayStream.active) {
      this.initWebRtcEmitter();
    }
  };

  SlideEngine.prototype.stopDisplayStream = function() {
    if (this.displayStream) {
      this.displayStream.getTracks().forEach(function(t) {
        try { t.stop(); } catch(e){}
      });
      this.displayStream = null;
    }
    if (this.peerConnection) {
      try { this.peerConnection.close(); } catch(e){}
      this.peerConnection = null;
    }
    if (this.presenterChannel) {
      this.presenterChannel.postMessage({ type: 'STREAM_STATUS', active: false });
    }
  };

  /* ============ VERROUILLAGE ET DÉTECTION D'ORIENTATION MOBILE ============ */
  function bypassOrientationLock() {
    var overlay = document.getElementById('orientation-lock-overlay') || document.querySelector('.orientation-lock-overlay');
    if (overlay) {
      overlay.classList.add('is-bypassed');
      overlay.classList.remove('is-active');
      overlay.setAttribute('aria-hidden', 'true');
    }
    try {
      sessionStorage.setItem('dac_orientation_bypassed', '1');
    } catch (_) {}
  }
  window.bypassOrientationLock = bypassOrientationLock;

  var _isLockingLandscape = false;
  async function attemptLockLandscape() {
    if (_isLockingLandscape) return;
    _isLockingLandscape = true;
    var overlay = document.getElementById('orientation-lock-overlay') || document.querySelector('.orientation-lock-overlay');
    var desc = overlay ? overlay.querySelector('.orientation-lock-desc') : null;
    var btnLock = overlay ? overlay.querySelector('#btn-lock-landscape') : null;
    var docEl = document.documentElement;

    try {
      // 1. Tenter le passage en plein écran (souvent prérequis pour l'orientation lock sur Chrome Android)
      try {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
          if (docEl.requestFullscreen) {
            await docEl.requestFullscreen();
          } else if (docEl.webkitRequestFullscreen) {
            await docEl.webkitRequestFullscreen();
          }
        }
      } catch (fsErr) {
        console.warn('[OrientationLock] Plein écran non disponible ou refusé:', fsErr);
      }

      // 2. Tenter le verrouillage de l'orientation
      var locked = false;
      try {
        if (window.screen && window.screen.orientation && typeof window.screen.orientation.lock === 'function') {
          await window.screen.orientation.lock('landscape');
          locked = true;
        }
      } catch (lockErr) {
        console.warn('[OrientationLock] Verrouillage d\'orientation non supporté ou refusé:', lockErr);
      }

      if (locked) {
        if (overlay) {
          overlay.classList.add('is-bypassed');
          overlay.classList.remove('is-active');
          overlay.setAttribute('aria-hidden', 'true');
        }
        return;
      }

      // Si le verrouillage automatique n'est pas permis ou non supporté (ex: iOS Safari)
      if (desc) {
        desc.textContent = "Le verrouillage automatique n'est pas autorisé par votre navigateur mobile. Veuillez faire pivoter votre appareil manuellement à l'horizontale.";
      }
      if (btnLock) {
        var btnSpan = btnLock.querySelector('span') || btnLock;
        btnSpan.textContent = "Pivoter manuellement";
      }
    } finally {
      _isLockingLandscape = false;
    }
  }
  window.attemptLockLandscape = attemptLockLandscape;

  SlideEngine.prototype.initOrientationLock = function() {
    if (this.isInIframe) return;
    var overlay = document.getElementById('orientation-lock-overlay') || document.querySelector('.orientation-lock-overlay');
    if (!overlay) return;

    var btnLock = overlay.querySelector('#btn-lock-landscape');
    var btnBypass = overlay.querySelector('#btn-bypass-orientation');

    if (btnLock && !btnLock._bound) {
      btnLock._bound = true;
      if (!btnLock.getAttribute('onclick')) {
        btnLock.addEventListener('click', function(e) {
          e.preventDefault();
          attemptLockLandscape();
        });
      }
    }

    if (btnBypass && !btnBypass._bound) {
      btnBypass._bound = true;
      if (!btnBypass.getAttribute('onclick')) {
        btnBypass.addEventListener('click', function(e) {
          e.preventDefault();
          bypassOrientationLock();
        });
      }
    }

    var checkOrientation = function() {
      var isPortrait = false;
      if (window.screen && window.screen.orientation && window.screen.orientation.type) {
        isPortrait = window.screen.orientation.type.indexOf('portrait') !== -1;
      } else if (window.matchMedia) {
        isPortrait = window.matchMedia('(orientation: portrait)').matches;
      } else {
        isPortrait = window.innerHeight > window.innerWidth;
      }

      var isNarrow = (window.innerWidth <= 899 || window.innerHeight <= 899);
      var isBypassed = false;
      try {
        isBypassed = sessionStorage.getItem('dac_orientation_bypassed') === '1';
      } catch (_) {}

      if (isBypassed) {
        overlay.classList.add('is-bypassed');
        overlay.classList.remove('is-active');
        overlay.setAttribute('aria-hidden', 'true');
        return;
      }

      if (isPortrait && isNarrow) {
        overlay.classList.add('is-active');
        overlay.removeAttribute('aria-hidden');
      } else {
        overlay.classList.remove('is-active');
        overlay.setAttribute('aria-hidden', 'true');
      }
    };

    if (window.screen && window.screen.orientation) {
      window.screen.orientation.addEventListener('change', checkOrientation);
    }
    if (window.matchMedia) {
      try {
        var mql = window.matchMedia('(orientation: portrait)');
        if (mql.addEventListener) {
          mql.addEventListener('change', checkOrientation);
        } else if (mql.addListener) {
          mql.addListener(checkOrientation);
        }
      } catch (_) {}
    }
    window.addEventListener('orientationchange', function() {
      setTimeout(checkOrientation, 100);
    });
    window.addEventListener('resize', checkOrientation);

    checkOrientation();
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
