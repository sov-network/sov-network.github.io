// Counts clicks on download, checksum and torrent links: which file, on which page, and nothing else.
// No cookies, no IDs, no IP stored (sov-hits worker keeps a number per day/file/page). Never blocks the download.
(function () {
  var URL = 'https://sov-hits.sovnetworkdev.workers.dev/hit';
  function name(href) {
    var m;
    if ((m = href.match(/releases\/(?:latest\/)?download\/(?:v[\d.]+\/)?([A-Za-z0-9_.-]+)$/))) return m[1];
    if ((m = href.match(/torrents\/([A-Za-z0-9_.-]+)\.torrent$/))) return 'torrent_' + m[1];
    if (href.indexOf('magnet:') === 0 && (m = href.match(/[?&]dn=([A-Za-z0-9_.-]+)/))) return 'magnet_' + m[1];
    return null;
  }
  function send(e) {
    var u = URL + '?e=' + encodeURIComponent(e.toLowerCase().slice(0, 48)) + '&p=' + encodeURIComponent((location.pathname || '/').toLowerCase().slice(0, 49));
    try { if (navigator.sendBeacon && navigator.sendBeacon(u)) return; } catch (x) {}
    try { fetch(u, { method: 'POST', mode: 'cors', keepalive: true }); } catch (x) {}
  }
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;
    var n = name(a.getAttribute('href') || '');
    if (n) send(n);
    else if (a.id === 'hero-dl') send('hero_button');
  }, true);
  // "Not installing today?" one-tap reasons on get.html: sends why_<reason>, nothing else.
  document.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('button[data-why]') : null;
    if (!b) return;
    send('why_' + b.getAttribute('data-why'));
    var box = b.closest('#why-not'); if (!box) return;
    box.querySelector('.whybtns').style.display = 'none';
    var t = box.querySelector('#why-thanks'); if (t) t.style.display = 'block';
  }, true);
})();
