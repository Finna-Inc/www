/* GOOGLE ANALYTICS FOR THE WEBSITE (21 Oct 2026, Christian: "we would like to see how many enters
   the Reports, Pitch Deck and Data Room"). Our notes had named G-45MV5WLMW6 the website's tag since
   2 Oct, but it had never been put on the site; the app has its own (G-1VQ8FJ5VLB, in the app's
   analytics.js). This file is the website's, loaded by every page that is not a forward, and by the
   investor doors and rooms (build/investors.py). build/site.py checks that no page goes without it.

   WHERE IT SENDS. Only from finnafamilyoffice.com and www. The design repo is itself published at
   finna-inc.github.io/design/, and a page opened there, from a disk or in a preview must not count
   as a visit: there it sends nothing, unless the address carries ?ga_debug=1, and then it is marked
   internal and debug, so it shows in DebugView and stays out of the reports.

   WHAT IT SENDS. A page view for every page, and the events a page names through window.finnaTrack:
   investor_unlock, investor_code_wrong, investor_doc_open and investor_pdf_download (the doors and
   rooms), investor_access_request (the form on Investors). Every value comes from a fixed list: the
   room, a document's slug, what access was asked for. Never a name, an email, an access code or
   anything typed. Google signals and ad personalisation are off.

   THE TEAM. ?internal=1 once in a browser marks every later visit from it as internal
   (traffic_type), which the property's Internal Traffic filter leaves out of the reports;
   ?internal=0 clears it. The same switch as the app's.

   A PAGE MAY CALL BEFORE THIS FILE HAS RUN. It loads async, so a page queues its events in
   window.finnaQ until window.finnaTrack exists, and they are sent from here. */
(function () {
  var ID = 'G-45MV5WLMW6';
  var HOSTS = ['finnafamilyoffice.com', 'www.finnafamilyoffice.com'];
  var q = new URLSearchParams(location.search);
  var live = HOSTS.indexOf(location.hostname) !== -1;
  var debug = q.get('ga_debug') === '1';
  var team = false;
  try {
    if (q.get('internal') === '1') localStorage.setItem('finna-internal', '1');
    if (q.get('internal') === '0') localStorage.removeItem('finna-internal');
    team = localStorage.getItem('finna-internal') === '1';
  } catch (e) {}

  var extra = {};
  if (team || !live) extra.traffic_type = 'internal';
  if (debug) extra.debug_mode = true;

  var send = function () {};
  if (live || debug) {
    window.dataLayer = window.dataLayer || [];
    var gtag = function () { window.dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', ID, Object.assign({allow_google_signals: false, allow_ad_personalization_signals: false}, extra));
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(s);
    send = function (name, params) { gtag('event', name, Object.assign({}, params, extra)); };
  }

  window.finnaTrack = function (name, params) { try { send(name, params || {}); } catch (e) {} };
  var waiting = window.finnaQ || [];
  window.finnaQ = [];
  waiting.forEach(function (a) { window.finnaTrack(a[0], a[1]); });
})();
