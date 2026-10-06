/* ============ Laser pointer ============ */
  (function initLaserPointer() {
    // En mode aperçu pupitre, le curseur OS natif est utilisé : désactiver le laser virtuel pour libérer 100% du CPU
    if (document.documentElement.classList.contains('is-iframe-preview')) return;
    if (!window.matchMedia || !window.matchMedia('(any-pointer: fine)').matches) return;
    var laser = document.querySelector('.laser-pointer');
    if (!laser) return;
    var currentX = window.innerWidth * 0.5;
    var currentY = window.innerHeight * 0.5;
    var targetX = currentX;
    var targetY = currentY;
    var visible = false;
    var scale = 1;
    var rafId = 0;

    function paint() {
      rafId = 0;
      // Réactivité maximale 1:1 instantanée sans décalage ni traînée
      currentX = targetX;
      currentY = targetY;
      laser.style.transform = 'translate3d(' + Math.round(currentX) + 'px, ' + Math.round(currentY) + 'px, 0) translate(-50%, -50%) scale(' + scale + ')';
    }

    function schedulePaint() {
      if (!rafId) rafId = window.requestAnimationFrame(paint);
    }

    function moveTo(clientX, clientY, instant) {
      if (typeof clientX !== 'number' || typeof clientY !== 'number') return;
      targetX = clientX;
      targetY = clientY;
      currentX = targetX;
      currentY = targetY;
      if (laser) {
        laser.style.transform = 'translate3d(' + Math.round(currentX) + 'px, ' + Math.round(currentY) + 'px, 0) translate(-50%, -50%) scale(' + scale + ')';
        if (!visible) {
          visible = true;
          document.body.classList.add('laser-cursor-enabled');
          laser.classList.add('is-visible');
        }
      }
    }

    function reveal(evt) {
      if (evt && !evt.isTrusted) return;
      if (evt && evt.pointerType && evt.pointerType !== 'mouse' && evt.pointerType !== 'pen') {
        conceal();
        return;
      }
      if (evt && typeof evt.clientX === 'number' && typeof evt.clientY === 'number') {
        moveTo(evt.clientX, evt.clientY);
      }
      if (!visible) {
        visible = true;
        document.body.classList.add('laser-cursor-enabled');
        laser.classList.add('is-visible');
      }
    }

    function conceal() {
      visible = false;
      scale = 1;
      laser.classList.remove('is-visible');
      laser.classList.remove('is-active');
      document.body.classList.remove('laser-cursor-enabled');
      schedulePaint();
    }

    function press(evt) {
      if (evt && !evt.isTrusted) return;
      reveal(evt);
      scale = 1.06;
      laser.classList.add('is-active');
      schedulePaint();
    }

    function release() {
      scale = 1;
      laser.classList.remove('is-active');
      schedulePaint();
    }

    window.laserPointer = {
      moveTo: moveTo,
      reveal: reveal,
      conceal: conceal,
      press: press,
      release: release,
      paint: paint
    };

    function attachIframePointerTracking(iframe) {
      if (!iframe) return;
      try {
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        if (!doc || !doc.body || doc._laserDocAttached) return;
        doc._laserDocAttached = true;

        // Cacher le curseur système par défaut dans l'iframe uniquement sur la projection publique
        if (!document.documentElement.classList.contains('is-iframe-preview')) {
          var style = doc.createElement('style');
          style.textContent = 'body, body * { cursor: none !important; }';
          doc.head.appendChild(style);
        }

        var cachedRect = null;
        function updateRect() {
          try { cachedRect = iframe.getBoundingClientRect(); } catch(_) {}
        }
        window.addEventListener('resize', updateRect, { passive: true });
        window.addEventListener('scroll', updateRect, { passive: true });
        iframe.addEventListener('mouseenter', updateRect, { passive: true });
        updateRect();

        function handleIframePointer(evt) {
          if (evt && !evt.isTrusted) return;
          if (!cachedRect) updateRect();
          var px = (cachedRect ? cachedRect.left : 0) + evt.clientX;
          var py = (cachedRect ? cachedRect.top : 0) + evt.clientY;
          moveTo(px, py, true);
          if (!visible) {
            visible = true;
            document.body.classList.add('laser-cursor-enabled');
            laser.classList.add('is-visible');
          }
        }

        doc.addEventListener('pointermove', handleIframePointer, { passive: true });
        if (!window.PointerEvent) {
          doc.addEventListener('mousemove', handleIframePointer, { passive: true });
        }
        doc.addEventListener('pointerdown', function(evt) {
          handleIframePointer(evt);
          scale = 1.06;
          laser.classList.add('is-active');
          schedulePaint();
        }, { passive: true });
        doc.addEventListener('pointerup', function() {
          scale = 1;
          laser.classList.remove('is-active');
          schedulePaint();
        }, { passive: true });
      } catch(e) {}
    }

    function scanAndAttachIframes() {
      document.querySelectorAll('iframe').forEach(function(iframe) {
        if (!iframe._laserLoadHooked) {
          iframe._laserLoadHooked = true;
          iframe.addEventListener('load', function() {
            attachIframePointerTracking(iframe);
          });
        }
        attachIframePointerTracking(iframe);
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', scanAndAttachIframes);
    } else {
      scanAndAttachIframes();
    }
    try {
      var iframeObserver = new MutationObserver(scanAndAttachIframes);
      iframeObserver.observe(document.body, { childList: true, subtree: true });
    } catch(e) {}

    document.addEventListener('pointermove', reveal, { passive: true });
    if (!window.PointerEvent) {
      document.addEventListener('mousemove', reveal, { passive: true });
    }
    document.addEventListener('pointerdown', press, { passive: true });
    document.addEventListener('pointerup', release, { passive: true });
    document.addEventListener('pointercancel', conceal, { passive: true });
    document.addEventListener('mouseout', function(evt) {
      if (!evt.relatedTarget) conceal();
    }, { passive: true });
    window.addEventListener('blur', conceal);
    window.addEventListener('pagehide', conceal);
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) conceal();
    });
    schedulePaint();
  })();