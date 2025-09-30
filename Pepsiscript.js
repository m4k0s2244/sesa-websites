// Pepsiscript.js
(function Pepsiscript(){
  if(window.__pepsi_executor_installed) {
    // se já instalado, apenas abre o painel
    try { window.__pepsi_executor.open(); } catch(e) {}
    return;
  }
  window.__pepsi_executor_installed = true;

  const install = () => {
    // remove instâncias antigas (caso re-execute)
    try {
      const oldStyle = document.getElementById('pepsi-exec-style'); if(oldStyle) oldStyle.remove();
      const oldBtn = document.getElementById('pepsi-exec-btn'); if(oldBtn) oldBtn.remove();
      const oldPanel = document.getElementById('pepsi-exec-panel'); if(oldPanel) oldPanel.remove();
      const oldIfr = document.getElementById('pepsi-sandbox-iframe'); if(oldIfr) oldIfr.remove();
    } catch(e){ /* ignore */ }

    const css = `
#pepsi-exec-btn{
  position:fixed; right:18px; bottom:18px; z-index:2147483646;
  width:52px; height:52px; border-radius:50%;
  background:linear-gradient(135deg,#1e90ff,#00b4ff);
  box-shadow:0 6px 18px rgba(0,0,0,0.35);
  display:flex;align-items:center;justify-content:center;
  color:#fff;font-weight:700;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;
  cursor:pointer; user-select:none; border:0;
}
#pepsi-exec-panel{
  position:fixed; right:18px; bottom:86px; z-index:2147483646;
  width:520px; max-width:calc(100% - 40px); background:#fff;
  border-radius:12px; box-shadow:0 12px 40px rgba(0,0,0,0.35);
  font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial; color:#111;
  padding:12px; display:flex; flex-direction:column; gap:8px;
  transition: transform .15s ease, opacity .12s ease;
  transform-origin:100% 100%;
}
#pepsi-exec-panel.hidden{ opacity:0; transform:translateY(8px) scale(.995); pointer-events:none; }
#pepsi-exec-panel textarea{ width:100%; height:180px; resize:vertical; padding:8px; font-family:monospace; font-size:13px; border-radius:8px; border:1px solid #e6e9ef }
#pepsi-exec-controls{ display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.pepsi-radio{ display:inline-flex; gap:6px; align-items:center; margin-right:8px; font-size:13px; }
#pepsi-exec-run{ padding:8px 12px; border-radius:8px; cursor:pointer; border:none; background:#007bff; color:#fff; font-weight:600; }
#pepsi-exec-close{ background:transparent; border:1px solid #ddd; padding:6px 8px; border-radius:8px; cursor:pointer; }
#pepsi-exec-result{ max-height:220px; overflow:auto; background:#f7f7fb; padding:8px; border-radius:8px; font-family:monospace; font-size:13px; border:1px solid #f0f0f5; }
#pepsi-exec-header{ display:flex; justify-content:space-between; align-items:center; gap:8px; }
#pepsi-exec-title{ font-weight:700; font-size:14px; }
#pepsi-exec-actions{ display:flex; gap:8px; align-items:center; }
#pepsi-exec-toggle-open{ margin-left:8px; font-size:12px; padding:6px 8px; border-radius:8px; border:1px solid #ddd; background:transparent; cursor:pointer; }
`;

    const style = document.createElement('style');
    style.id = 'pepsi-exec-style';
    style.textContent = css;
    document.head.appendChild(style);

    // botão flutuante
    const btn = document.createElement('button');
    btn.id = 'pepsi-exec-btn';
    btn.title = 'Pepsi Executor — clique para abrir';
    btn.innerText = 'Pepsi';
    btn.setAttribute('aria-label','Pepsi Executor');
    document.body.appendChild(btn);

    // painel
    const panel = document.createElement('div');
    panel.id = 'pepsi-exec-panel';
    panel.classList.add('hidden');
    panel.innerHTML = `
      <div id="pepsi-exec-header">
        <div style="display:flex;align-items:center;gap:10px;">
          <div id="pepsi-exec-title">Pepsi Executor</div>
          <div style="font-size:12px;color:#666">cole JS e escolha o modo</div>
        </div>
        <div id="pepsi-exec-actions">
          <button id="pepsi-exec-copy" title="Copiar código">Copiar</button>
          <button id="pepsi-exec-close" title="Fechar">Fechar</button>
        </div>
      </div>
      <textarea id="pepsi-exec-code" placeholder="// Cole seu JavaScript aqui"></textarea>
      <div id="pepsi-exec-controls">
        <label class="pepsi-radio"><input type="radio" name="pepsi-mode" value="page" checked> Na página</label>
        <label class="pepsi-radio"><input type="radio" name="pepsi-mode" value="console"> No console</label>
        <label class="pepsi-radio"><input type="radio" name="pepsi-mode" value="isolated"> Isolado (iframe)</label>
        <label style="margin-left:auto; display:flex; gap:6px; align-items:center; font-size:13px;">
          <input type="checkbox" id="pepsi-show-result" checked> Mostrar resultado
        </label>
      </div>
      <div style="display:flex;gap:8px;">
        <button id="pepsi-exec-run">Executar</button>
        <button id="pepsi-exec-clear">Limpar</button>
        <button id="pepsi-exec-last" title="Executar último salvo">Executar último</button>
      </div>
      <div id="pepsi-exec-result" style="display:none;"></div>
    `;
    document.body.appendChild(panel);

    // iframe isolado (escondido)
    const sandboxFrame = document.createElement('iframe');
    sandboxFrame.id = 'pepsi-sandbox-iframe';
    sandboxFrame.style.display = 'none';
    sandboxFrame.setAttribute('sandbox','allow-scripts');
    document.body.appendChild(sandboxFrame);

    // preenche iframe com listener
    try {
      const iframeDoc = sandboxFrame.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`<!doctype html><html><head><meta charset="utf-8"></head><body>
        <script>
          window.addEventListener('message', function(e){
            try {
              var data = e.data || {};
              if(!data || !data.pepsiSandbox) return;
              var code = data.code || '';
              var result = (function(){ return eval(code); })();
              parent.postMessage({pepsiSandbox:true, result: result}, '*');
            } catch(err){
              parent.postMessage({pepsiSandbox:true, error: String(err)}, '*');
            }
          }, false);
        <\/script>
      </body></html>`);
      iframeDoc.close();
    } catch(e){
      // ignora se cross-origin (pouco provável para about:blank)
      console.warn('Não conseguiu escrever no iframe (pode ser cross-origin):', e);
    }

    // elementos
    const textarea = panel.querySelector('#pepsi-exec-code');
    const runBtn = panel.querySelector('#pepsi-exec-run');
    const closeBtn = panel.querySelector('#pepsi-exec-close');
    const clearBtn = panel.querySelector('#pepsi-exec-clear');
    const copyBtn = panel.querySelector('#pepsi-exec-copy');
    const lastBtn = panel.querySelector('#pepsi-exec-last');
    const resultBox = panel.querySelector('#pepsi-exec-result');

    // helpers
    function getMode(){
      const r = panel.querySelector('input[name="pepsi-mode"]:checked');
      return r ? r.value : 'page';
    }
    function showPanel(show){
      if(show){
        panel.classList.remove('hidden');
        panel.style.display = 'flex';
        // deixa o painel visível e foca no textarea
        setTimeout(()=> textarea.focus(), 60);
      } else {
        panel.classList.add('hidden');
        // leave it for accessibility
      }
    }

    // evento do botão flutuante
    btn.addEventListener('click', (e) => {
      // toggle
      const isHidden = panel.classList.contains('hidden');
      showPanel(isHidden);
      e.stopPropagation();
    });

    // click fora para fechar
    document.addEventListener('click', function (e) {
      const tgt = e.target;
      if(!panel.contains(tgt) && tgt !== btn){
        showPanel(false);
      }
    }, true);

    closeBtn.addEventListener('click', ()=> showPanel(false));
    clearBtn.addEventListener('click', ()=> { textarea.value = ''; resultBox.style.display='none'; resultBox.textContent = ''; });
    copyBtn.addEventListener('click', async ()=> {
      try {
        await navigator.clipboard.writeText(textarea.value || '');
        // feedback pequeno
        copyBtn.innerText = 'Copiado';
        setTimeout(()=> copyBtn.innerText = 'Copiar', 900);
      } catch(e){
        alert('Falha ao copiar: ' + e);
      }
    });

    // salvar último no localStorage
    const STORAGE_KEY = '__pepsi_last_code_v1';
    function saveLast(code){
      try { localStorage.setItem(STORAGE_KEY, code || ''); } catch(e) {}
    }
    function loadLast(){ try { return localStorage.getItem(STORAGE_KEY) || ''; } catch(e){ return ''; } }

    lastBtn.addEventListener('click', ()=> {
      const last = loadLast();
      if(!last) { alert('Nenhum código salvo.'); return; }
      textarea.value = last;
      // executa direto
      runBtn.click();
    });

    // resultado do sandbox via postMessage
    window.addEventListener('message', function(e){
      const d = e.data || {};
      if(d.pepsiSandbox){
        resultBox.style.display='block';
        if(d.hasOwnProperty('error')){
          resultBox.textContent = 'Erro (sandbox): ' + d.error;
        } else {
          try {
            resultBox.textContent = 'Resultado (sandbox): ' + JSON.stringify(d.result);
          } catch(err){
            resultBox.textContent = 'Resultado (sandbox): ' + String(d.result);
          }
        }
      }
    });

    runBtn.addEventListener('click', ()=> {
      const codeRaw = textarea.value || '';
      if(!codeRaw.trim()){
        alert('Cole algum código antes de executar.');
        return;
      }
      saveLast(codeRaw);
      const code = codeRaw.replace(/^\s*javascript:\s*/i, '');
      const mode = getMode();
      const showResult = panel.querySelector('#pepsi-show-result').checked;

      try {
        if(mode === 'page'){
          // injeta script na página
          const s = document.createElement('script');
          s.type = 'text/javascript';
          s.textContent = '(function(){ try { ' + code + ' } catch(e){ console.error("Pepsi exec error:", e); } })();';
          document.documentElement.appendChild(s);
          setTimeout(()=> s.remove(), 50);
          if(showResult){
            resultBox.style.display='block';
            resultBox.textContent = 'Executado na página. Veja console para detalhes.';
          }
        } else if(mode === 'console'){
          let result;
          try {
            result = (0, eval)(code);
            console.log('Pepsi Executor — resultado:', result);
          } catch(e){
            console.error('Pepsi Executor — erro:', e);
            result = e;
          }
          if(showResult){
            resultBox.style.display='block';
            try { resultBox.textContent = 'Resultado (console): ' + JSON.stringify(result); }
            catch(e){ resultBox.textContent = 'Resultado (console): ' + String(result); }
          }
        } else if(mode === 'isolated'){
          try {
            sandboxFrame.contentWindow.postMessage({ pepsiSandbox: true, code: code }, '*');
            if(showResult){
              resultBox.style.display='block';
              resultBox.textContent = 'Executando no sandbox... (aguarde o retorno)';
            }
          } catch(e){
            resultBox.style.display='block';
            resultBox.textContent = 'Falha ao enviar para o sandbox: ' + String(e);
          }
        }
      } catch(err){
        resultBox.style.display='block';
        resultBox.textContent = 'Erro ao executar: ' + String(err);
        console.error(err);
      }
    });

    // atalho keyboard: Ctrl+Shift+P para abrir/fechar
    window.addEventListener('keydown', function(e){
      if(e.ctrlKey && e.shiftKey && e.key && e.key.toLowerCase() === 'p'){
        const isHidden = panel.classList.contains('hidden');
        showPanel(isHidden);
      }
    });

    // expõe API global
    window.__pepsi_executor = {
      open: ()=> showPanel(true),
      close: ()=> showPanel(false),
      runCode: (code, mode='console') => {
        textarea.value = code;
        const radio = panel.querySelector(`input[name="pepsi-mode"][value="${mode}"]`);
        if(radio) radio.checked = true;
        runBtn.click();
      },
      button: btn,
      panel: panel
    };

    // abre automaticamente se o botão já foi clicado antes ou se foi instalado via bookmarklet
    setTimeout(()=> {
      // se o botão foi criado e não há interação, abre o painel pra facilitar
      window.__pepsi_executor.open();
    }, 120);
  }; // fim install

  // espera o body existir
  if(document.readyState === 'complete' || document.readyState === 'interactive'){
    install();
  } else {
    window.addEventListener('DOMContentLoaded', install, { once:true });
    // fallback: se demorar, tenta novamente
    setTimeout(()=> { if(!window.__pepsi_executor_installed) try{ install(); }catch(e){} }, 1500);
  }
})();