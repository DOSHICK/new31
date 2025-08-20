const MIN_POPUP_SCREEN_W = 1024;
const SIDEBAR_URL        = 'window.html';
const SIDEBAR_WIDTH      = 400;
const SIDEBAR_HEIGHT     = 700;
let sidebarWin = null;

function openSidebarWindow() {
  const scale = window.devicePixelRatio || 1;

  if (window.innerWidth < MIN_POPUP_SCREEN_W) {
    window.open(SIDEBAR_URL, '_blank', 'noopener');
    return;
  }

  const scaledWidth  = Math.round(SIDEBAR_WIDTH  * scale);
  const scaledHeight = Math.round(SIDEBAR_HEIGHT * scale);

  const left = Math.max(0, screen.availWidth - scaledWidth);
  const top  = 0;

  const baseFeatures = [
    `width=${scaledWidth}`,
    `height=${scaledHeight}`,
    `top=${top}`,
    `left=${left}`,
    'resizable=no',
    'toolbar=no',
    'menubar=no',
    'scrollbars=no',
    'status=no',
    'location=no'
  ].join(',');

  const features = [baseFeatures].join(',');

  if (!sidebarWin || sidebarWin.closed) {
    sidebarWin = window.open(SIDEBAR_URL, '_blank', features);

    const checkAndResize = () => {
      if (!sidebarWin) return;
      try {
        sidebarWin.resizeTo(scaledWidth, scaledHeight);
        sidebarWin.focus();
      } catch (err) {
        console.warn('Resize failed:', err);
      }
    };

    setTimeout(checkAndResize, 300);
  } else {
    sidebarWin.focus();
  }
}

function bindSidebarOpeners() {
  const selector = 'a, button, .style_downloadItem__g3VwF, .style_followUsItem__o-Y3F';
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      openSidebarWindow();
    });
  });
}

window.addEventListener('DOMContentLoaded', bindSidebarOpeners);
