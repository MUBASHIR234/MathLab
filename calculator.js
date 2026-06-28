/* =========================================================
   MathLab — Floating Scientific Calculator
   Self-contained: injects its own HTML + CSS + behavior.
   Include with: <script src="calculator.js"></script>
   ========================================================= */

(function () {

  /* ---------- Inject CSS ---------- */
  const css = `
    .calc-fab{
      position:fixed; bottom:26px; right:26px; z-index:500;
      width:56px; height:56px; border-radius:50%;
      background:#4FD1E8; color:#06141A;
      border:none; cursor:pointer; font-size:1.4rem;
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 10px 28px -8px rgba(79,209,232,0.55);
      transition:transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s ease;
      font-family:'JetBrains Mono', monospace;
    }
    .calc-fab:hover{ transform:translateY(-3px) scale(1.05); box-shadow:0 14px 34px -8px rgba(79,209,232,0.65); }
    .calc-fab:active{ transform:scale(0.93); }
    .calc-fab.hide{ display:none; }

    .calc-panel{
      position:fixed; bottom:96px; right:26px; z-index:500;
      width:320px; max-width:calc(100vw - 32px);
      background:#11131C; border:1px solid rgba(237,239,245,0.12);
      border-radius:18px; box-shadow:0 24px 60px -16px rgba(0,0,0,0.6);
      overflow:hidden; font-family:'Inter', sans-serif; color:#EDEFF5;
      opacity:0; transform:translateY(16px) scale(0.97); pointer-events:none;
      transition:opacity 0.25s ease, transform 0.25s cubic-bezier(.22,1,.36,1);
    }
    .calc-panel.open{ opacity:1; transform:translateY(0) scale(1); pointer-events:auto; }

    .calc-head{
      display:flex; justify-content:space-between; align-items:center;
      padding:14px 16px; border-bottom:1px solid rgba(237,239,245,0.08);
    }
    .calc-head span{ font-weight:600; font-size:0.92rem; font-family:'Space Grotesk', sans-serif; }
    .calc-close{
      background:none; border:none; color:#9098AC; cursor:pointer; font-size:1rem;
      width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center;
      transition:background 0.2s ease, color 0.2s ease;
    }
    .calc-close:hover{ background:rgba(237,239,245,0.08); color:#EDEFF5; }

    .calc-mode-row{ display:flex; gap:6px; padding:10px 14px 0; }
    .calc-mode-btn{
      flex:1; padding:7px; border-radius:8px; border:1px solid rgba(237,239,245,0.1);
      background:transparent; color:#9098AC; font-size:0.74rem; cursor:pointer; transition:all 0.2s ease;
      font-family:'Inter', sans-serif; font-weight:500;
    }
    .calc-mode-btn.active{ background:#4FD1E8; color:#06141A; border-color:#4FD1E8; font-weight:600; }

    .calc-display{
      padding:18px 16px 10px; text-align:right;
    }
    .calc-expr{
      font-family:'JetBrains Mono', monospace; font-size:0.78rem; color:#9098AC; min-height:16px;
      word-break:break-all; margin-bottom:4px;
    }
    .calc-result{
      font-family:'JetBrains Mono', monospace; font-size:1.7rem; font-weight:600; color:#EDEFF5;
      word-break:break-all; line-height:1.2; min-height:32px;
    }
    .calc-error{ color:#E8636B; }

    .calc-keys{
      display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; padding:12px 14px 16px;
    }
    .calc-key{
      padding:13px 4px; border-radius:10px; border:1px solid rgba(237,239,245,0.08);
      background:#0B0D14; color:#EDEFF5; font-size:0.92rem; cursor:pointer;
      transition:all 0.15s ease; font-family:'JetBrains Mono', monospace; font-weight:500;
    }
    .calc-key:hover{ border-color:#4FD1E8; background:rgba(79,209,232,0.08); }
    .calc-key:active{ transform:scale(0.93); }
    .calc-key.fn{ color:#F2A93B; font-size:0.78rem; font-family:'Inter',sans-serif; }
    .calc-key.op{ color:#8B7FE0; }
    .calc-key.equals{ background:#4FD1E8; color:#06141A; font-weight:700; }
    .calc-key.equals:hover{ background:#5fd8ec; }
    .calc-key.clear{ color:#E8636B; }
    .calc-key.wide{ grid-column:span 2; }

    @media (max-width:480px){
      .calc-panel{ right:16px; left:16px; width:auto; bottom:90px; }
      .calc-fab{ right:16px; bottom:20px; }
    }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  /* ---------- Inject HTML ---------- */
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <button class="calc-fab" id="calcFab" aria-label="Open calculator" title="Scientific calculator">🧮</button>
    <div class="calc-panel" id="calcPanel">
      <div class="calc-head">
        <span>Scientific Calculator</span>
        <button class="calc-close" id="calcClose">✕</button>
      </div>
      <div class="calc-mode-row">
        <button class="calc-mode-btn active" data-mode="deg">DEG</button>
        <button class="calc-mode-btn" data-mode="rad">RAD</button>
      </div>
      <div class="calc-display">
        <div class="calc-expr" id="calcExpr">&nbsp;</div>
        <div class="calc-result" id="calcResult">0</div>
      </div>
      <div class="calc-keys" id="calcKeys">
        <button class="calc-key fn" data-k="sin">sin</button>
        <button class="calc-key fn" data-k="cos">cos</button>
        <button class="calc-key fn" data-k="tan">tan</button>
        <button class="calc-key clear" data-k="ac">AC</button>

        <button class="calc-key fn" data-k="log">log</button>
        <button class="calc-key fn" data-k="ln">ln</button>
        <button class="calc-key fn" data-k="sqrt">√</button>
        <button class="calc-key clear" data-k="back">⌫</button>

        <button class="calc-key fn" data-k="(">(</button>
        <button class="calc-key fn" data-k=")">)</button>
        <button class="calc-key fn" data-k="pow2">x²</button>
        <button class="calc-key op" data-k="÷">÷</button>

        <button class="calc-key" data-k="7">7</button>
        <button class="calc-key" data-k="8">8</button>
        <button class="calc-key" data-k="9">9</button>
        <button class="calc-key op" data-k="×">×</button>

        <button class="calc-key" data-k="4">4</button>
        <button class="calc-key" data-k="5">5</button>
        <button class="calc-key" data-k="6">6</button>
        <button class="calc-key op" data-k="-">−</button>

        <button class="calc-key" data-k="1">1</button>
        <button class="calc-key" data-k="2">2</button>
        <button class="calc-key" data-k="3">3</button>
        <button class="calc-key op" data-k="+">+</button>

        <button class="calc-key fn" data-k="pi">π</button>
        <button class="calc-key" data-k="0">0</button>
        <button class="calc-key" data-k=".">.</button>
        <button class="calc-key equals" data-k="=">=</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);

  /* ---------- Behavior ---------- */
  const fab = document.getElementById('calcFab');
  const panel = document.getElementById('calcPanel');
  const closeBtn = document.getElementById('calcClose');
  const exprEl = document.getElementById('calcExpr');
  const resultEl = document.getElementById('calcResult');
  const keysWrap = document.getElementById('calcKeys');
  const modeButtons = document.querySelectorAll('.calc-mode-btn');

  let expression = '';   // what the user is building, using display symbols (×, ÷, −)
  let angleMode = 'deg';

  function openCalc(){
    panel.classList.add('open');
  }
  function closeCalc(){
    panel.classList.remove('open');
  }

  fab.addEventListener('click', () => {
    if (panel.classList.contains('open')) closeCalc();
    else openCalc();
  });
  closeBtn.addEventListener('click', closeCalc);

  document.addEventListener('click', (e) => {
    if (!panel.classList.contains('open')) return;
    if (panel.contains(e.target) || fab.contains(e.target)) return;
    closeCalc();
  });

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      angleMode = btn.dataset.mode;
    });
  });

  function updateDisplay(){
    exprEl.textContent = expression || '\u00A0';
    resultEl.classList.remove('calc-error');
  }

  // Convert the user-facing expression into a JS-evaluable string.
  function toEvaluable(expr){
    let e = expr;
    e = e.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    e = e.replace(/π/g, '(' + Math.PI + ')');

    // Trig functions respect the selected angle mode.
    function wrapTrig(name, fn){
      const re = new RegExp(name + '\\(([^()]*)\\)', 'g');
      let prev;
      do {
        prev = e;
        e = e.replace(re, (m, inner) => {
          return `(${fn}(${angleMode === 'deg' ? `(${inner})*Math.PI/180` : `(${inner})`}))`;
        });
      } while (e !== prev && e.includes(name + '('));
    }
    wrapTrig('sin', 'Math.sin');
    wrapTrig('cos', 'Math.cos');
    wrapTrig('tan', 'Math.tan');

    e = e.replace(/log\(/g, 'Math.log10(');
    e = e.replace(/ln\(/g, 'Math.log(');
    e = e.replace(/sqrt\(/g, 'Math.sqrt(');
    e = e.replace(/(\d+(\.\d+)?|\([^()]*\))\^2/g, '($1*$1)');

    return e;
  }

  function evaluateExpr(){
    if (!expression){ resultEl.textContent = '0'; return; }
    try {
      const evalStr = toEvaluable(expression);
      // eslint-disable-next-line no-new-func
      const value = Function(`"use strict"; return (${evalStr});`)();
      if (typeof value !== 'number' || !isFinite(value)) throw new Error('bad result');
      const rounded = Math.round(value * 1e10) / 1e10;
      resultEl.textContent = String(rounded);
    } catch (err){
      resultEl.textContent = 'Error';
      resultEl.classList.add('calc-error');
    }
  }

  function handleKey(key){
    if (key === 'ac'){
      expression = '';
      resultEl.textContent = '0';
      updateDisplay();
      return;
    }
    if (key === 'back'){
      expression = expression.slice(0, -1);
      updateDisplay();
      evaluateExpr();
      return;
    }
    if (key === '='){
      evaluateExpr();
      return;
    }
    if (key === 'pi'){
      expression += 'π';
      updateDisplay();
      evaluateExpr();
      return;
    }
    if (key === 'sqrt'){
      expression += 'sqrt(';
      updateDisplay();
      evaluateExpr();
      return;
    }
    if (key === 'pow2'){
      expression += '^2';
      updateDisplay();
      evaluateExpr();
      return;
    }
    if (['sin','cos','tan','log','ln'].includes(key)){
      expression += key + '(';
      updateDisplay();
      evaluateExpr();
      return;
    }
    // Default: append the literal key (digits, operators, parens, dot)
    expression += key;
    updateDisplay();
    evaluateExpr();
  }

  keysWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.calc-key');
    if (!btn) return;
    handleKey(btn.dataset.k);
  });

  // Keyboard support while calculator is open
  document.addEventListener('keydown', (e) => {
    if (!panel.classList.contains('open')) return;
    if (e.key >= '0' && e.key <= '9'){ handleKey(e.key); return; }
    if (e.key === '.'){ handleKey('.'); return; }
    if (e.key === '+'){ handleKey('+'); return; }
    if (e.key === '-'){ handleKey('-'); return; }
    if (e.key === '*'){ handleKey('×'); return; }
    if (e.key === '/'){ e.preventDefault(); handleKey('÷'); return; }
    if (e.key === '('){ handleKey('('); return; }
    if (e.key === ')'){ handleKey(')'); return; }
    if (e.key === 'Enter'){ e.preventDefault(); handleKey('='); return; }
    if (e.key === 'Backspace'){ handleKey('back'); return; }
    if (e.key === 'Escape'){ closeCalc(); return; }
  });

  updateDisplay();
})();
