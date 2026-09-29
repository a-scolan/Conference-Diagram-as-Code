/* ============ Mermaid zoom controls ============ */
  function getInitialZoom(w){
    return parseFloat(w && w.dataset && w.dataset.initialZoom ? w.dataset.initialZoom : '1') || 1;
  }
  function getCurrentZoom(w){var t=w&&w.querySelector?w.querySelector('.mermaid'):null;return parseFloat(t&&t.dataset.zoom||getInitialZoom(w))||getInitialZoom(w);}
  function getZoomMin(w){var min=parseFloat(w&&w.dataset.zoomMin?w.dataset.zoomMin:'');return !isNaN(min)&&min>0?min:0.6;}
  function getZoomMax(w){var max=parseFloat(w&&w.dataset.zoomMax?w.dataset.zoomMax:'');return !isNaN(max)&&max>getZoomMin(w)?max:4;}
  function clampDiagramZoom(w,zoom){return Math.min(getZoomMax(w),Math.max(getZoomMin(w),zoom));}
  function shouldCenterMermaidViewport(w,zoom){
    if(!w)return false;
    var mode=String(w.dataset.centerViewportOnReveal||'').toLowerCase();
    var currentZoom=typeof zoom==='number'?zoom:getCurrentZoom(w);
    if(mode==='true'||mode==='always')return true;
    if(mode==='false'||mode==='never')return false;
    return currentZoom>1.01;
  }
  function updateZoomState(w){var t=w.querySelector('.mermaid');var z=parseFloat(t.dataset.zoom||getInitialZoom(w));w.classList.toggle('is-zoomed',z>1);}
  function updateMermaidViewportAlignment(w){
    if(!w)return;
    var sc=w.querySelector('.mermaid-scroll');
    var t=w.querySelector('.mermaid');
    if(!sc||!t)return;
    var overflowX=Math.ceil(t.offsetWidth)>sc.clientWidth+1;
    var overflowY=Math.ceil(t.offsetHeight)>sc.clientHeight+1;
    sc.classList.toggle('has-overflow-x',overflowX);
    sc.classList.toggle('has-overflow-y',overflowY);
    w.classList.toggle('can-pan',overflowX||overflowY||getCurrentZoom(w)>1.01);
  }
  function updateZoomLayout(w){
    var t=w.querySelector('.mermaid');
    var z=parseFloat(t.dataset.zoom||getInitialZoom(w));
    var bw=parseFloat(t.dataset.baseW||'0');
    var bh=parseFloat(t.dataset.baseH||'0');
    if(bw&&bh){t.style.width=Math.ceil(bw*z)+'px';t.style.height=Math.ceil(bh*z)+'px';t.style.transform='none';}
    updateMermaidViewportAlignment(w);
  }
  function setDiagramZoom(w,zoom,centerOnContent){
    if(!w)return;
    var t=w.querySelector('.mermaid');
    if(!t)return;
    t.dataset.zoom=String(clampDiagramZoom(w,zoom));
    updateZoomState(w);
    updateZoomLayout(w);
    if(centerOnContent)scheduleCenterMermaidViewport(w,true);
  }
  function scheduleCenterMermaidViewport(w,force){
    if(!w)return;
    if(Array.isArray(w._centerViewportTimers))w._centerViewportTimers.forEach(function(id){window.clearTimeout(id);});
    w._centerViewportTimers=[0,90,220].map(function(delay){
      return window.setTimeout(function(){
        updateZoomLayout(w);
        queueCenterMermaidViewport(w,force);
      },delay);
    });
  }
  function queueCenterMermaidViewport(w,force){
    if(!w)return;
    var sc=w.querySelector('.mermaid-scroll');
    var t=w.querySelector('.mermaid');
    var svg=w.querySelector('.mermaid svg');
    if(!sc||!t||!svg)return;
    var zoom=getCurrentZoom(w);
    if(!shouldCenterMermaidViewport(w,zoom)){delete w.dataset.centeredZoom;return;}
    var zoomKey=String(zoom);
    if(!force&&w.dataset.centeredZoom===zoomKey)return;
    window.requestAnimationFrame(function(){window.requestAnimationFrame(function(){var scRect=sc.getBoundingClientRect();var svgRect=svg.getBoundingClientRect();var contentLeft=sc.scrollLeft+(svgRect.left-scRect.left);var contentTop=sc.scrollTop+(svgRect.top-scRect.top);var renderLeft=contentLeft;var renderTop=contentTop;var renderWidth=svgRect.width;var renderHeight=svgRect.height;try{var box=typeof svg.getBBox==='function'?svg.getBBox():null;var viewBox=svg.viewBox&&svg.viewBox.baseVal;var viewBoxX=viewBox&&isFinite(viewBox.x)?viewBox.x:0;var viewBoxY=viewBox&&isFinite(viewBox.y)?viewBox.y:0;var viewBoxW=(viewBox&&viewBox.width)||svg.clientWidth||svgRect.width||1;var viewBoxH=(viewBox&&viewBox.height)||svg.clientHeight||svgRect.height||1;var scaleX=svgRect.width/viewBoxW;var scaleY=svgRect.height/viewBoxH;if(box&&box.width&&box.height&&isFinite(scaleX)&&scaleX>0&&isFinite(scaleY)&&scaleY>0){renderLeft=contentLeft+((box.x-viewBoxX)*scaleX);renderTop=contentTop+((box.y-viewBoxY)*scaleY);renderWidth=box.width*scaleX;renderHeight=box.height*scaleY;}}catch(e){}var targetLeft=renderLeft+(renderWidth*0.5)-(sc.clientWidth*0.5);var targetTop=renderTop+(renderHeight*0.5)-(sc.clientHeight*0.5);var maxScrollLeft=Math.max(0,sc.scrollWidth-sc.clientWidth);var maxScrollTop=Math.max(0,sc.scrollHeight-sc.clientHeight);sc.scrollLeft=Math.max(0,Math.min(maxScrollLeft,Math.round(targetLeft)));sc.scrollTop=Math.max(0,Math.min(maxScrollTop,Math.round(targetTop)));w.dataset.centeredZoom=zoomKey;});});
  }
  function zoomDiagram(b,f){var w=b.closest('.mermaid-wrap');setDiagramZoom(w,getCurrentZoom(w)*f,true);}
  function resetZoom(b){var w=b.closest('.mermaid-wrap');setDiagramZoom(w,getInitialZoom(w),true);}
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.zoom-controls button[data-zoom-action]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var action = btn.dataset.zoomAction;
    if (action === 'reset') {
      resetZoom(btn);
      return;
    }
    var factor = parseFloat(btn.dataset.zoomFactor || '1');
    if (!isFinite(factor) || factor <= 0 || factor === 1) return;
    zoomDiagram(btn, factor);
  });
  document.querySelectorAll('.mermaid-wrap').forEach(function(w){
    var sc=w.querySelector('.mermaid-scroll')||w;
    w.addEventListener('wheel',function(e){var freeWheel=String(w.dataset.wheelZoom||'').toLowerCase()==='true';if(!freeWheel&&!e.ctrlKey&&!e.metaKey)return;e.preventDefault();setDiagramZoom(w,getCurrentZoom(w)*(e.deltaY<0?1.1:0.9),true);},{passive:false});
    var activePointerId=null,sX,sY,sL,sT;
    sc.addEventListener('pointerdown',function(e){
      if(e.target.closest('.zoom-controls')||!w.classList.contains('can-pan'))return;
      if(e.pointerType==='mouse'&&e.button!==0)return;
      activePointerId=e.pointerId;
      w.classList.add('is-panning');
      sX=e.clientX;sY=e.clientY;sL=sc.scrollLeft;sT=sc.scrollTop;
      if(sc.setPointerCapture)try{sc.setPointerCapture(e.pointerId);}catch(err){}
    });
    sc.addEventListener('pointermove',function(e){
      if(activePointerId!==e.pointerId||!w.classList.contains('is-panning'))return;
      sc.scrollLeft=sL-(e.clientX-sX);
      sc.scrollTop=sT-(e.clientY-sY);
    });
    function stopPan(e){
      if(activePointerId===null)return;
      if(e&&typeof e.pointerId==='number'&&e.pointerId!==activePointerId)return;
      activePointerId=null;
      w.classList.remove('is-panning');
    }
    sc.addEventListener('pointerup',stopPan);
    sc.addEventListener('pointercancel',stopPan);
    sc.addEventListener('lostpointercapture',stopPan);

    // Support tactile pinch-to-zoom sur les diagrammes Mermaid
    var pinchDistStart = 0;
    var pinchZoomStart = 1;
    w.addEventListener('touchstart',function(e){
      if(e.touches && e.touches.length === 2){
        var dx = e.touches[0].clientX - e.touches[1].clientX;
        var dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchDistStart = Math.hypot(dx, dy);
        pinchZoomStart = getCurrentZoom(w);
      }
    },{passive:true});
    w.addEventListener('touchmove',function(e){
      if(e.touches && e.touches.length === 2 && pinchDistStart > 0){
        var dx = e.touches[0].clientX - e.touches[1].clientX;
        var dy = e.touches[0].clientY - e.touches[1].clientY;
        var dist = Math.hypot(dx, dy);
        var factor = dist / pinchDistStart;
        setDiagramZoom(w, pinchZoomStart * factor, false);
      }
    },{passive:true});
    w.addEventListener('touchend',function(e){
      if(!e.touches || e.touches.length < 2){
        pinchDistStart = 0;
      }
    },{passive:true});
  });