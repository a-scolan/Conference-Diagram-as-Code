/* ============ Codespace popup ============ */
  var codespacePopup = null;
  function openCodespacePopup() {
    var iframe = document.getElementById('codespace-iframe');
    var url = iframe ? (iframe.getAttribute('data-src') || iframe.src) : 'https://stunning-space-winner-w46x9xqrrgj2969j.github.dev/';
    var w = screen.availWidth;
    var h = screen.availHeight;
    var left = window.screenX;
    var top = window.screenY;
    var features = 'width=' + w + ',height=' + h + ',left=' + left + ',top=' + top + ',menubar=no,toolbar=no,location=yes,status=no,resizable=yes,scrollbars=yes';
    if (codespacePopup && !codespacePopup.closed) {
      codespacePopup.focus();
    } else {
      codespacePopup = window.open(url, 'codespace-ide', features);
    }
  }