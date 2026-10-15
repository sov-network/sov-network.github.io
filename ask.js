// "Ask SOV" chat button. Answers come from https://sov-ask.sovnetworkdev.workers.dev, which answers ONLY from the
// published SOV Network docs. No cookies; the conversation lives in this page only and is gone when you leave.
(function () {
  var API = 'https://sov-ask.sovnetworkdev.workers.dev';
  var css = '#sovask-btn{position:fixed;right:18px;bottom:18px;z-index:50;background:var(--gold,#d4af37);color:#1a1300;border:0;border-radius:999px;padding:12px 18px;font:700 15px system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.35);cursor:pointer}'
    + '#sovask{position:fixed;right:18px;bottom:76px;z-index:50;width:min(380px,calc(100vw - 32px));height:min(520px,calc(100vh - 110px));display:none;flex-direction:column;background:#0f1a2b;color:#e8edf5;border:1px solid rgba(255,255,255,.12);border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.45);font:14px/1.45 system-ui,sans-serif}'
    + '#sovask header{padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;align-items:center}'
    + '#sovask header b{color:#fff}#sovask header button{background:none;border:0;color:#aab;font-size:20px;cursor:pointer}'
    + '#sovask .log{flex:1;overflow:auto;padding:12px 14px}#sovask .m{margin:0 0 10px;padding:9px 11px;border-radius:10px;white-space:pre-wrap;word-wrap:break-word}'
    + '#sovask .u{background:rgba(212,175,55,.16);margin-left:30px}#sovask .a{background:rgba(255,255,255,.06);margin-right:20px}#sovask .a a{color:#d4af37}'
    + '#sovask form{display:flex;gap:8px;padding:10px;border-top:1px solid rgba(255,255,255,.1)}#sovask input{flex:1;min-width:0;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#0a1220;color:#fff;font-size:14px}'
    + '#sovask form button{background:#d4af37;color:#1a1300;border:0;border-radius:8px;padding:0 14px;font-weight:700;cursor:pointer}#sovask .note{font-size:11.5px;color:#8a96a8;padding:0 14px 8px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var btn = document.createElement('button'); btn.id = 'sovask-btn'; btn.type = 'button'; btn.textContent = 'Ask SOV';
  var box = document.createElement('div'); box.id = 'sovask'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Ask SOV');
  box.innerHTML = '<header><b>Ask SOV</b><button type="button" aria-label="Close">&times;</button></header>'
    + '<div class="log"></div><div class="note">Answers come from the whitepaper and the Academy. Nothing is stored. For anything else, ask in the <a href="https://github.com/sov-network-dev/sov-build-source/discussions" style="color:#d4af37">public Q&amp;A</a>.</div>'
    + '<form><input maxlength="500" placeholder="Ask anything about SOV Network" aria-label="Your question"><button>Ask</button></form>';
  document.body.appendChild(btn); document.body.appendChild(box);
  var log = box.querySelector('.log'), form = box.querySelector('form'), input = form.querySelector('input'), hist = [];
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function link(s) { return esc(s).replace(/https:\/\/[^\s<)]+[^\s<).,]/g, function (u) { return '<a href="' + u + '" target="_blank" rel="noopener">' + u.replace(/^https:\/\//, '') + '</a>'; }); }
  function say(cls, text) { var d = document.createElement('div'); d.className = 'm ' + cls; d.innerHTML = cls === 'a' ? link(text) : esc(text); log.appendChild(d); log.scrollTop = log.scrollHeight; return d; }
  btn.onclick = function () {
    var open = box.style.display === 'flex'; box.style.display = open ? 'none' : 'flex';
    if (!open && !log.children.length) say('a', 'Hi! Ask me anything about SOV Network: how it works, how to get started, recovery, privacy, running a node.');
    if (!open) input.focus();
  };
  box.querySelector('header button').onclick = function () { box.style.display = 'none'; };
  form.onsubmit = function (e) {
    e.preventDefault(); var q = input.value.trim(); if (!q) return; input.value = ''; say('u', q);
    var wait = say('a', '…'); form.querySelector('button').disabled = true;
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ q: q, h: hist.slice(-4) }) })
      .then(function (r) { return r.json(); })
      .then(function (d) { var a = d.answer || 'Sorry, I could not answer that. Please ask in the public Q&A.'; wait.innerHTML = link(a); hist.push({ r: 'u', c: q }, { r: 'a', c: a }); })
      .catch(function () { wait.textContent = 'Sorry, the assistant is not reachable right now. Please try again later.'; })
      .then(function () { form.querySelector('button').disabled = false; log.scrollTop = log.scrollHeight; input.focus(); });
  };
})();
