javascript:(function(){
  'use strict';
  console.log('[S.E.S.A] Iniciando injeção do Mod Menu...');

  // Injeta CSS (estilos do menu flutuante)
  const style = document.createElement('style');
  style.textContent = `
    #sesa-btn { position: fixed; right: 20px; bottom: 20px; width: 56px; height: 56px; border-radius: 50%; background: #2563eb; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; z-index: 9999; cursor: pointer; box-shadow: 0 8px 30px rgba(0,0,0,.4); font-size: 24px; border: none; }
    #sesa-panel { position: fixed; right: 20px; bottom: 90px; width: 360px; background: rgba(0,0,0,0.9); color: #fff; padding: 12px; border-radius: 10px; display: none; z-index: 9999; box-shadow: 0 20px 60px rgba(0,0,0,.6); max-height: 80vh; overflow-y: auto; font-family: system-ui, Arial; }
    #sesa-script-input { width: 100%; height: 120px; background: #0c0c0e; color: #fff; border: 1px solid #333; padding: 8px; border-radius: 6px; box-sizing: border-box; font-family: monospace; font-size: 14px; resize: vertical; }
    .sesa-row { display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px; flex-wrap: wrap; }
    .sesa-btn { background: #2563eb; color: #fff; padding: 8px 12px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; margin: 2px; }
    .sesa-btn:hover { background: #1d4ed8; }
    .sesa-btn-green { background: #10b981; }
    .sesa-btn-green:hover { background: #059669; }
    .sesa-btn-red { background: #ef4444; }
    .sesa-btn-red:hover { background: #dc2626; }
    #sesa-panel h4 { margin: 0 0 12px 0; color: #7dd3fc; }
    #sesa-panel p { font-size: 12px; color: #bbb; margin-top: 8px; }
    body { overflow: visible !important; }
  `;
  document.head.appendChild(style);

  // Cria botão flutuante "S"
  if (document.getElementById('sesa-btn')) {
    console.log('[S.E.S.A] Menu já injetado. Recarregando...');
    document.getElementById('sesa-btn').click(); // Abre se já existir
    return;
  }
  const btn = document.createElement('button');
  btn.id = 'sesa-btn';
  btn.innerHTML = 'S';
  btn.title = 'S.E.S.A Mod Menu - Clique para abrir';
  document.body.appendChild(btn);

  // Cria painel
  const panel = document.createElement('div');
  panel.id = 'sesa-panel';
  panel.innerHTML = `
    <h4>S.E.S.A Mod Menu (v2 Embutido)</h4>
    <textarea id="sesa-script-input" placeholder="Digite o JavaScript para executar na página atual (ex: document.querySelector('input[name=q]').value = 'hack'; )&#10;Nota: Funciona em Google e outros sites. Use com cuidado!"></textarea>
    <div class="sesa-row">
      <button id="sesa-send-btn" class="sesa-btn">Executar JS</button>
      <button id="sesa-reload-btn" class="sesa-btn sesa-btn-green">🔄 Recarregar</button>
      <button id="sesa-clear-btn" class="sesa-btn sesa-btn-red">Limpar</button>
      <button id="sesa-close-btn" class="sesa-btn">Fechar</button>
    </div>
    <p>Executa via eval() no contexto da página. Logs no console (F12).</p>
  `;
  document.body.appendChild(panel);

  // Elementos
  const scriptInput = document.getElementById('sesa-script-input');
  const sendBtn = document.getElementById('sesa-send-btn');
  const reloadBtn = document.getElementById('sesa-reload-btn');
  const clearBtn = document.getElementById('sesa-clear-btn');
  const closeBtn = document.getElementById('sesa-close-btn');

  // Toggle painel
  function togglePanel() {
    const isVisible = panel.style.display === 'block';
    panel.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) scriptInput.focus();
  }
  btn.addEventListener('click', togglePanel);
  closeBtn.addEventListener('click', () => { panel.style.display = 'none'; });

  // Executar JS
  sendBtn.addEventListener('click', () => {
    const code = scriptInput.value.trim();
    if (!code) {
      console.log('[S.E.S.A] Nenhum código digitado.');
      return;
    }
    try {
      console.log('[S.E.S.A] Executando código:', code);
      const result = eval(code); // Executa no contexto da página (pode acessar DOM do Google)
      console.log('[S.E.S.A] Resultado:', result);
      scriptInput.value = '// Executado com sucesso! Resultado no console.';
    } catch (err) {
      console.error('[S.E.S.A] Erro:', err);
      scriptInput.value = '// Erro: ' + err.message;
    }
  });

  // Recarregar página
  reloadBtn.addEventListener('click', () => {
    location.reload();
  });

  // Limpar
  clearBtn.addEventListener('click', () => {
    scriptInput.value = '';
  });

  // Fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (e.target === panel || panel.contains(e.target)) return;
    panel.style.display = 'none';
  });

  console.log('[S.E.S.A] Menu injetado com sucesso! Clique no "S" para usar. Abra F12 > Console para logs.');
})();
