javascript:(function(){
  // Inject CSS styles
  const style = document.createElement('style');
  style.textContent = `
    #sesa-btn { position: fixed; right: 20px; bottom: 20px; width: 56px; height: 56px; border-radius: 50%; background: #2563eb; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; z-index: 9999; cursor: pointer; box-shadow: 0 8px 30px rgba(0,0,0,.4); font-size: 24px; border: none; }
    #sesa-panel { position: fixed; right: 20px; bottom: 90px; width: 360px; background: rgba(0,0,0,0.9); color: #fff; padding: 12px; border-radius: 10px; display: none; z-index: 9999; box-shadow: 0 20px 60px rgba(0,0,0,.6); max-height: 80vh; overflow-y: auto; }
    #sesa-script-input { width: 100%; height: 120px; background: #0c0c0e; color: #fff; border: 1px solid #333; padding: 8px; border-radius: 6px; box-sizing: border-box; font-family: monospace; font-size: 14px; resize: vertical; }
    .sesa-row { display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px; }
    .sesa-btn { background: #2563eb; color: #fff; padding: 8px 12px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; }
    .sesa-btn:hover { background: #1d4ed8; }
    .sesa-btn-green { background: #10b981; }
    .sesa-btn-green:hover { background: #059669; }
    .sesa-btn-red { background: #ef4444; }
    .sesa-btn-red:hover { background: #dc2626; }
    #sesa-panel h4 { margin: 0 0 8px 0; }
    #sesa-panel p { font-size: 12px; color: #bbb; margin-top: 8px; }
    body { overflow: visible !important; } /* Ensure panel doesn't get cut off */
  `;
  document.head.appendChild(style);

  
  const btn = document.createElement('button');
  btn.id = 'sesa-btn';
  btn.innerHTML = 'S';
  btn.title = 'S.E.S.A Mod Menu';
  document.body.appendChild(btn);

  
  const panel = document.createElement('div');
  panel.id = 'sesa-panel';
  panel.innerHTML = `
    <h4>S.E.S.A Mod Menu</h4>
    <textarea id="sesa-script-input" placeholder="Digite o JavaScript que quer executar na página atual (Google ou qualquer site)"></textarea>
    <div class="sesa-row">
      <button id="sesa-send-btn" class="sesa-btn">Executar JS</button>
      <button id="sesa-reload-btn" class="sesa-btn sesa-btn-green">🔄 Recarregar Página</button>
      <button id="sesa-clear-btn" class="sesa-btn sesa-btn-red">Limpar</button>
      <button id="sesa-close-btn" class="sesa-btn">Fechar</button>
    </div>
    <p>Nota: O código será executado diretamente na página atual via eval(). Use com cuidado em sites como Google.</p>
  `;
  document.body.appendChild(panel);

 
  const scriptInput = document.getElementById('sesa-script-input');
  const sendBtn = document.getElementById('sesa-send-btn');
  const reloadBtn = document.getElementById('sesa-reload-btn');
  const clearBtn = document.getElementById('sesa-clear-btn');
  const closeBtn = document.getElementById('sesa-close-btn');

  
  btn.addEventListener('click', () => {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  });
  closeBtn.addEventListener('click', () => {
    panel.style.display = 'none';
  });

  
  sendBtn.addEventListener('click', () => {
    const code = scriptInput.value.trim();
    if (!code) {
      alert('Digite um script JavaScript.');
      return;
    }
    try {
      const result = eval(code); // Executes in current context (page's window)
      console.log('[S.E.S.A] Executado:', result);
      alert('✅ Código executado com sucesso! Verifique o console para resultados.');
    } catch (err) {
      console.error('[S.E.S.A] Erro:', err);
      alert('❌ Erro ao executar: ' + err.message);
    }
  });

 
  reloadBtn.addEventListener('click', () => {
    location.reload();
  });

  
  clearBtn.addEventListener('click', () => {
    scriptInput.value = '';
  });

  
  document.addEventListener('click', (e) => {
    if (e.target === panel) {
      panel.style.display = 'none';
    }
  });

  // Prevent panel from closing when clicking inside
  panel.addEventListener('click', (e) => e.stopPropagation());

  console.log('[S.E.S.A] Bookmarklet carregado! Clique no botão "S" para abrir o menu.');
})();
