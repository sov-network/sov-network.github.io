// "Ask SOV" live chat. Answers come from https://sov-ask.sovnetworkdev.workers.dev, which answers ONLY from the
// published SOV Network docs. No cookies; the conversation lives in this page only and is gone when you leave.
// Any element with data-sovask (e.g. the hero "Ask a question" button) opens the chat; without JS it keeps its link.
(function () {
  var API = 'https://sov-ask.sovnetworkdev.workers.dev';
  var GOLD = '#d4af37';
  var css = ''
    + '#sovask-btn{position:fixed;right:18px;bottom:18px;z-index:60;display:flex;align-items:center;gap:8px;background:' + GOLD + ';color:#1a1300;border:0;border-radius:999px;padding:12px 18px 12px 14px;font:700 15px system-ui,sans-serif;box-shadow:0 6px 22px rgba(0,0,0,.4);cursor:pointer;transition:transform .15s}'
    + '#sovask-btn:hover{transform:translateY(-2px)}#sovask-btn svg{width:22px;height:22px;flex:none}'
    + '#sovask-btn .dot{position:absolute;top:4px;left:34px;width:10px;height:10px;border-radius:50%;background:#2ecc71;border:2px solid ' + GOLD + ';animation:sovask-pulse 2s infinite}'
    + '@keyframes sovask-pulse{0%{box-shadow:0 0 0 0 rgba(46,204,113,.7)}70%{box-shadow:0 0 0 8px rgba(46,204,113,0)}100%{box-shadow:0 0 0 0 rgba(46,204,113,0)}}'
    + '#sovask-tease{position:fixed;right:18px;bottom:78px;z-index:60;max-width:min(300px,calc(100vw - 36px));background:#fff;color:#14202f;border-radius:14px 14px 4px 14px;padding:12px 30px 12px 14px;font:14px/1.4 system-ui,sans-serif;box-shadow:0 10px 28px rgba(0,0,0,.35);cursor:pointer;opacity:0;transform:translateY(10px);transition:opacity .3s,transform .3s;pointer-events:none}'
    + '#sovask-tease.show{opacity:1;transform:none;pointer-events:auto}#sovask-tease b{display:block;margin-bottom:2px}'
    + '#sovask-tease button{position:absolute;top:4px;right:6px;background:none;border:0;font-size:18px;color:#778;cursor:pointer;line-height:1}'
    + '#sovask{position:fixed;right:18px;bottom:78px;z-index:61;width:min(380px,calc(100vw - 32px));height:min(540px,calc(100vh - 110px));display:none;flex-direction:column;background:#0f1a2b;color:#e8edf5;border:1px solid rgba(255,255,255,.12);border-radius:16px;box-shadow:0 12px 34px rgba(0,0,0,.5);font:14px/1.45 system-ui,sans-serif;overflow:hidden}'
    + '#sovask.open{display:flex;animation:sovask-in .2s ease-out}@keyframes sovask-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}'
    + '#sovask header{padding:12px 14px;background:#13233a;border-bottom:1px solid rgba(255,255,255,.1);display:flex;gap:10px;align-items:center}'
    + '#sovask header .av{width:34px;height:34px;border-radius:50%;background:' + GOLD + ';color:#1a1300;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;flex:none}'
    + '#sovask header .t{flex:1;min-width:0}#sovask header b{color:#fff;display:block}#sovask header small{color:#8fd6a8;font-size:12px}'
    + '#sovask header button{background:none;border:0;color:#aab;font-size:22px;cursor:pointer;line-height:1}'
    + '#sovask .log{flex:1;overflow:auto;padding:12px 14px}#sovask .m{margin:0 0 10px;padding:9px 11px;border-radius:12px;white-space:pre-wrap;word-wrap:break-word}'
    + '#sovask .u{background:rgba(212,175,55,.18);margin-left:34px;border-bottom-right-radius:4px}#sovask .a{background:rgba(255,255,255,.07);margin-right:22px;border-bottom-left-radius:4px}#sovask .a a{color:' + GOLD + '}'
    + '#sovask .typing span{display:inline-block;width:7px;height:7px;margin:0 2px;border-radius:50%;background:#9aa6b8;animation:sovask-dot 1.2s infinite}'
    + '#sovask .typing span:nth-child(2){animation-delay:.2s}#sovask .typing span:nth-child(3){animation-delay:.4s}'
    + '@keyframes sovask-dot{0%,60%,100%{opacity:.3;transform:none}30%{opacity:1;transform:translateY(-3px)}}'
    + '#sovask .chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 8px}#sovask .chips button{background:none;border:1px solid rgba(212,175,55,.5);color:#f1e3b3;border-radius:999px;padding:5px 10px;font:13px system-ui,sans-serif;cursor:pointer}'
    + '#sovask .chips button:hover{background:rgba(212,175,55,.15)}'
    + '#sovask form{display:flex;gap:8px;padding:10px;border-top:1px solid rgba(255,255,255,.1)}#sovask input{flex:1;min-width:0;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#0a1220;color:#fff;font-size:16px}'
    + '#sovask form button{background:' + GOLD + ';color:#1a1300;border:0;border-radius:8px;padding:0 14px;font-weight:700;cursor:pointer}'
    + '@media (max-width:520px){#sovask-btn .lbl{display:none}#sovask-btn{padding:14px}#sovask-btn .dot{left:30px}#sovask{right:12px;bottom:76px;height:calc(100vh - 100px)}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z"/></svg>';
  var btn = document.createElement('button'); btn.id = 'sovask-btn'; btn.type = 'button'; btn.setAttribute('aria-label', 'Chat with the SOV assistant');
  btn.innerHTML = ICON + '<span class="lbl">Ask SOV</span><span class="dot"></span>';
  var tease = document.createElement('div'); tease.id = 'sovask-tease'; tease.setAttribute('role', 'status');
  tease.innerHTML = '<button type="button" aria-label="Dismiss">&times;</button><b>Hi! Questions about SOV Network?</b>I can explain how it works, how to get started, recovery and privacy. Ask me anything.';
  var box = document.createElement('div'); box.id = 'sovask'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Ask SOV');
  box.innerHTML = '<header><div class="av">SOV</div><div class="t"><b>Ask SOV</b><small>&#9679; Online &middot; answers from the SOV docs</small></div><button type="button" aria-label="Close">&times;</button></header>'
    + '<div class="log" aria-live="polite"></div><div class="chips"></div>'
    + '<form><input maxlength="500" placeholder="Type your question…" aria-label="Your question"><button>Send</button></form>';
  document.body.appendChild(tease); document.body.appendChild(btn); document.body.appendChild(box);

  var log = box.querySelector('.log'), chips = box.querySelector('.chips'), form = box.querySelector('form'),
      input = form.querySelector('input'), sendBtn = form.querySelector('button'), hist = [], busy = false;
  var SUGGEST = ['How do I get started?', 'Is my face or palm photo stored?', 'What if I lose my phone?', 'Is it a blockchain?'];
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function link(s) { return esc(s).replace(/https:\/\/[^\s<)]+[^\s<).,]/g, function (u) { return '<a href="' + u + '" target="_blank" rel="noopener">' + u.replace(/^https:\/\//, '') + '</a>'; }); }
  function say(cls, text) { var d = document.createElement('div'); d.className = 'm ' + cls; d.innerHTML = cls === 'a' ? link(text) : esc(text); log.appendChild(d); log.scrollTop = log.scrollHeight; return d; }
  function store(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }

  SUGGEST.forEach(function (q) { var b = document.createElement('button'); b.type = 'button'; b.textContent = q; b.onclick = function () { ask(q); }; chips.appendChild(b); });

  function hideTease() { tease.classList.remove('show'); store('sovask_teased', '1'); }
  function open() {
    hideTease(); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
    if (!log.children.length) say('a', "Hi! I'm the SOV Network assistant. Ask me how it works, how to get started, recovery, privacy or running a node — or tap a question below.");
    setTimeout(function () { input.focus(); }, 50);
  }
  function close() { box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  window.SOVAsk = { open: open, close: close };

  btn.onclick = function () { box.classList.contains('open') ? close() : open(); };
  box.querySelector('header button').onclick = close;
  tease.onclick = function (e) { if (e.target.tagName === 'BUTTON') { hideTease(); return; } open(); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('open')) close(); });
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-sovask]');
    if (t) { e.preventDefault(); open(); }
  });
  if (location.hash === '#ask') open();

  // Pop a short greeting once per visit, a few seconds after the page settles. Never opens the chat by itself.
  if (!store('sovask_teased')) setTimeout(function () { if (!box.classList.contains('open')) tease.classList.add('show'); }, 5000);

  function ask(q) {
    if (busy || !q) return; busy = true; chips.style.display = 'none';
    say('u', q);
    var wait = say('a', ''); wait.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>'; sendBtn.disabled = true;
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ q: q, h: hist.slice(-4) }) })
      .then(function (r) { return r.json(); })
      .then(function (d) { var a = d.answer || 'Sorry, I could not answer that. Please ask in the public Q&A.'; wait.innerHTML = link(a); hist.push({ r: 'u', c: q }, { r: 'a', c: a }); })
      .catch(function () { wait.textContent = 'Sorry, the assistant is not reachable right now. Please try again in a moment.'; })
      .then(function () { busy = false; sendBtn.disabled = false; log.scrollTop = log.scrollHeight; input.focus(); });
  }
  form.onsubmit = function (e) { e.preventDefault(); var q = input.value.trim(); input.value = ''; ask(q); };
})();
