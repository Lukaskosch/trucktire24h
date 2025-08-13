
// Auf JEDER Seite einbinden: <script src="cookie-banner.js" defer></script>
(() => {
  const KEY = 'tt24Consent';

  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch(e){ return null; }
  };
  const write = (obj) => {
    const state = {
      necessary: true,
      analytics: !!obj.analytics,
      marketing: !!obj.marketing,
      ts: new Date().toISOString()
    };
    localStorage.setItem(KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('tt24ConsentChanged', { detail: state }));
    return state;
  };

  // 👉 Helfer IMMER bereitstellen (auch wenn schon entschieden wurde)
  window.tt24GetConsent = function(){ return read(); };
  window.tt24OpenConsent = function(){ localStorage.removeItem(KEY); location.reload(); };

  // Auf der Einstellungsseite keinen Banner zeigen
  const IS_SETTINGS_PAGE = /(^|\/)cookie\.html(\?|#|$)/.test(location.pathname);

  // Wenn schon entschieden ODER Einstellungsseite → Banner nicht anzeigen
  if (read() || IS_SETTINGS_PAGE) return;

  // Styles (zum Design passend)
  const css = `
  #tt24-overlay{position:fixed;inset:0;background:rgba(15,23,42,.45);backdrop-filter:saturate(160%) blur(2px);z-index:9998}
  #tt24-modal{position:fixed;inset:0;display:grid;place-items:center;z-index:9999}
  .tt24-box{max-width:720px;width:calc(100% - 32px);margin:16px;background:#fff;border:1px solid #e5e7eb;border-radius:14px;box-shadow:0 12px 28px rgba(2,6,23,.35);padding:18px}
  .tt24-title{margin:0 0 6px;font:800 18px/1.3 system-ui,Segoe UI,Arial}
  .tt24-text{margin:0 0 12px;color:#667085;line-height:1.55}
  .tt24-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}
  .tt24-btn{appearance:none;cursor:pointer;border-radius:999px;border:1px solid transparent;padding:12px 18px;font-weight:800}
  .tt24-btn.accent{background:linear-gradient(90deg,#ffe24d,#fff700);border-color:#ffef8a;color:#111;box-shadow:0 6px 16px rgba(15,23,42,.08)}
  .tt24-btn.primary{background:var(--dark,#0f172a);border-color:var(--dark-border,#1f2937);color:#fff;box-shadow:0 6px 16px rgba(15,23,42,.08)}
  .tt24-btn.ghost{background:#fff;border:1px dashed #cdd6e1;color:#183652}
  @media (max-width:480px){ .tt24-actions{justify-content:stretch} .tt24-btn{flex:1} }
  `;
  const style = document.createElement('style');
  style.id = 'tt24-consent-style';
  style.textContent = css;
  document.head.appendChild(style);

  // Markup
  const overlay = document.createElement('div');
  overlay.id = 'tt24-overlay';
  const modal = document.createElement('div');
  modal.id = 'tt24-modal';
  modal.setAttribute('role','dialog');
  modal.setAttribute('aria-modal','true');
  modal.setAttribute('aria-labelledby','tt24c-title');
  modal.innerHTML = `
    <div class="tt24-box">
      <h2 id="tt24c-title" class="tt24-title">Cookies & Dienste</h2>
      <p class="tt24-text">
        Wir nutzen notwendige Cookies für den Betrieb der Website. Optionale Dienste (Analyse/Marketing) setzen wir erst,
        wenn du zustimmst. Du kannst deine Auswahl jederzeit über „Cookie-Einstellungen“ im Footer ändern.
      </p>
      <div class="tt24-actions">
        <a href="cookie.html" class="tt24-btn ghost">Einstellungen</a>
        <button type="button" id="tt24-reject" class="tt24-btn primary">Nur notwendige</button>
        <button type="button" id="tt24-accept" class="tt24-btn accent">Alle akzeptieren</button>
      </div>
    </div>
  `;
  document.body.append(overlay, modal);

  const close = () => {
    overlay.remove(); modal.remove();
    document.getElementById('tt24-consent-style')?.remove();
  };

  modal.querySelector('#tt24-accept').addEventListener('click', () => {
    write({ analytics:true, marketing:true }); close();
  });
  modal.querySelector('#tt24-reject').addEventListener('click', () => {
    write({ analytics:false, marketing:false }); close();
  });
})();

