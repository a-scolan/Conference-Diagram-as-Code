/* ============ Laser pointer ============ */
  (function initLaserPointer() {
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
      currentX = targetX;
      currentY = targetY;
      laser.style.transform = 'translate3d(' + Math.round(currentX) + 'px, ' + Math.round(currentY) + 'px, 0) translate(-50%, -50%) scale(' + scale + ')';
    }

    function schedulePaint() {
      if (!rafId) rafId = window.requestAnimationFrame(paint);
    }

    function moveTo(clientX, clientY) {
      if (typeof clientX !== 'number' || typeof clientY !== 'number') return;
      targetX = clientX;
      targetY = clientY;
      schedulePaint();
    }

    function reveal(evt) {
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