/* 
  S.E.S.A Protector (raw JS)
  - Salve este arquivo como "sesa-protector.js" no GitHub ou use no console da página.
  - Ao executar, ele:
    1) pede 3 confirmações do usuário;
    2) limpa localStorage/sessionStorage;
    3) tenta expirar cookies;
    4) limpa campos de senha e desativa autocomplete;
    5) tenta fechar WebSockets expostos;
    6) monkeypatch em fetch/XHR/WebSocket/EventSource/sendBeacon para bloquear novas conexões nesta aba;
    7) previne submits de formulários;
    8) gera e baixa um relatório txt com as ações.
  - Limitações: não consegue apagar histórico do navegador ou senhas salvas no gerenciador do navegador.
  - Use por sua conta — especialmente em páginas críticas, teste antes.
*/

(function SESAProtector() {
  // helper
  function fmtTS(d){const z=n=>n<10?'0'+n:n;return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate())+'_'+z(d.getHours())+''+z(d.getMinutes())+''+z(d.getSeconds());}

  // Prevent double-run
  if (window.__sesa_protector_active) {
    console.warn('S.E.S.A Protector já ativo nesta aba.');
    return;
  }
  window.__sesa_protector_active = true;

  // 3x confirmations
  try {
    if (!confirm('S.E.S.A — Proteção de dados\n\nConfirma 1/3: deseja executar as medidas de proteção nesta aba?')) { window.__sesa_protector_active = false; return; }
    if (!confirm('Confirma 2/3: isso tentará limpar storages, cookies e bloquear conexões nesta aba (não remove senhas do navegador).')) { window.__sesa_protector_active = false; return; }
    if (!confirm('Confirma 3/3: concorda em gerar um relatório e fazer download do arquivo de proteção?')) { window.__sesa_protector_active = false; return; }
  } catch (err) {
    window.__sesa_protector_active = false;
    return;
  }

  const actions = [];
  const ts = new Date();
  actions.push('S.E.S.A Protector run at: ' + ts.toISOString());
  actions.push('Location: ' + location.href);

  // 1) Clear storages
  try { localStorage.clear(); actions.push('localStorage: CLEARED'); } catch (e) { actions.push('localStorage: FAILED (' + (e && e.message) + ')'); }
  try { sessionStorage.clear(); actions.push('sessionStorage: CLEARED'); } catch (e) { actions.push('sessionStorage: FAILED (' + (e && e.message) + ')'); }

  // 2) Delete cookies visible to document
  try {
    const cookies = document.cookie ? document.cookie.split(';').map(c => c.trim()) : [];
    if (cookies.length === 0) { actions.push('Cookies: none found'); }
    else {
      cookies.forEach(c => {
        const name = c.split('=')[0];
        try {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + location.hostname;
        } catch (e) {}
      });
      actions.push('Cookies: ATTEMPTED TO CLEAR (' + cookies.length + ')');
    }
  } catch (e) { actions.push('Cookies: FAILED (' + (e && e.message) + ')'); }

  // 3) Clear password fields and disable autocomplete
  try {
    const pw = Array.from(document.querySelectorAll('input[type="password"]'));
    pw.forEach(i => { try { i.value = ''; i.setAttribute('autocomplete', 'off'); } catch (e) {} });
    Array.from(document.querySelectorAll('input,textarea,form')).forEach(el => { try { el.setAttribute('autocomplete', 'off'); } catch (e) {} });
    actions.push('Password fields: CLEARED (' + pw.length + ') and autocomplete disabled on forms/inputs');
  } catch (e) { actions.push('Password clear: FAILED (' + (e && e.message) + ')'); }

  // 4) Close exposed WebSocket instances on window
  try {
    let closed = 0;
    for (const k in window) {
      try {
        const v = window[k];
        if (v && typeof v === 'object' && (v instanceof WebSocket)) {
          try { v.close(); closed++; } catch (err) {}
        }
      } catch (err) {}
    }
    actions.push('WebSocket: attempted to close exposed sockets (' + closed + ')');
  } catch (e) { actions.push('WebSocket close: FAILED (' + (e && e.message) + ')'); }

  // 5) Monkeypatch constructors and APIs to block further outgoing connections
  try {
    // block new WebSocket creation
    (function blockWS() {
      try {
        const OrigWS = window.WebSocket;
        function BlockedWS() { throw new Error('WebSocket blocked by S.E.S.A Protector'); }
        BlockedWS.prototype = OrigWS ? OrigWS.prototype : {};
        window.WebSocket = BlockedWS;
      } catch (e) {}
    })();

    // block fetch
    try { window.fetch = function () { return Promise.reject(new Error('fetch blocked by S.E.S.A Protector')); }; } catch (e) {}

    // block XHR - monkeypatch open/send to throw/abort
    (function blockXHR() {
      try {
        const X = window.XMLHttpRequest;
        if (X && X.prototype) {
          const origOpen = X.prototype.open;
          X.prototype.open = function () { try { this.abort(); } catch (e) {} throw new Error('XMLHttpRequest blocked by S.E.S.A Protector'); };
        }
      } catch (e) {}
    })();

    // block EventSource
    try { window.EventSource = function () { throw new Error('EventSource blocked by S.E.S.A Protector'); }; } catch (e) {}

    // disable navigator.sendBeacon
    try { navigator.sendBeacon = function () { return false; }; } catch (e) {}

    actions.push('Network APIs: monkeypatched (fetch/XHR/WebSocket/EventSource/sendBeacon blocked)');
  } catch (e) { actions.push('Network monkeypatch: FAILED (' + (e && e.message) + ')'); }

  // 6) Prevent form submissions and clear inputs (best-effort)
  try {
    Array.from(document.forms).forEach(f => {
      try { f.addEventListener('submit', function (ev) { ev.preventDefault(); ev.stopPropagation(); }, { capture: true }); } catch (e) {}
    });
    document.querySelectorAll('input,textarea,button').forEach(el => {
      try { el.setAttribute('autocomplete', 'off'); } catch (e) {}
    });
    actions.push('Forms: submission prevention attached; inputs set autocomplete off');
  } catch (e) { actions.push('Forms disable: FAILED (' + (e && e.message) + ')'); }

  // 7) Create report and trigger download
  try {
    const report = ['S.E.S.A Protector Report', '-------------------------', ...actions].join('\n');
    const filename = 'sesa-protect-report-' + fmtTS(ts) + '.txt';
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    actions.push('Report: downloaded as ' + filename);
  } catch (e) { actions.push('Report download: FAILED (' + (e && e.message) + ')'); }

  // Final quick alert + console log
  try {
    alert('S.E.S.A Protector executado.\nAções realizadas (resumo no console e no arquivo baixado).');
  } catch (e) {}
  console.group('%cS.E.S.A Protector - Report', 'color:#06b6d4;font-weight:700');
  actions.forEach(a => console.log('- ' + a));
  console.groupEnd();

  // expose simple API for debugging
  window.__sesa_protector_report = actions;
})();