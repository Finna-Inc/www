/* WATCH · the films' few behaviours (Christian, 5 Nov 2026). Loaded by Watch, every film's page,
   Home, the desk pages and What is a family office?, after the markup build/watch.py writes.

   THE PLAYER. Every film shows Finna's own picture and one key. Nothing from YouTube loads until the
   key is pressed: then the privacy-enhanced player (youtube-nocookie.com) takes the picture's place
   and starts. A chapter starts the film at its moment, loading the player if it is not there yet.
   NEW. A film carries its publish time; "New" shows for seven days after it, and Watch's row reads
   "New this week." only while that is true.
   EVERY FILM. The desk keys filter the list; watch.html?desk=<desk> opens it on one desk.
   THE NUMBERS. film_play, film_chapter, film_youtube and film_to_app go to analytics.js
   (window.finnaTrack), each with the film's id and the page it was on: nothing typed, no names. */
(function () {
  'use strict';
  var NEW_DAYS = 7;
  var page = location.pathname.split('/').pop().replace('.html', '') || 'index';

  function track(name, params) {
    params = Object.assign({ page: page }, params || {});
    if (window.finnaTrack) window.finnaTrack(name, params);
    else (window.finnaQ = window.finnaQ || []).push([name, params]);
  }

  /* New, for seven days */
  var now = Date.now(), anyNew = false;
  document.querySelectorAll('[data-new]').forEach(function (el) {
    var t = Date.parse(el.getAttribute('data-new'));
    if (t && now >= t && now - t < NEW_DAYS * 864e5) { el.hidden = false; anyNew = true; }
  });
  document.querySelectorAll('[data-latest-h]').forEach(function (h) {
    h.textContent = anyNew ? h.getAttribute('data-new-text') : h.getAttribute('data-old-text');
  });

  /* the player */
  function frame(p, start) {
    var id = p.getAttribute('data-yt');
    var src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1&enablejsapi=1' +
      '&origin=' + encodeURIComponent(location.origin) + (start ? '&start=' + start : '');
    var f = document.createElement('iframe');
    f.src = src;
    f.title = p.getAttribute('data-title') || 'Film';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    p.textContent = '';
    p.appendChild(f);
    p.classList.add('is-playing');
    f.focus();
  }
  function seek(p, t) {
    var f = p.querySelector('iframe');
    if (!f) { frame(p, t); return; }
    var post = function (func, args) {
      f.contentWindow.postMessage(JSON.stringify({ event: 'command', func: func, args: args || [] }), '*');
    };
    post('seekTo', [t, true]); post('playVideo');
  }
  function inView(el) {
    var r = el.getBoundingClientRect();
    return r.top >= 0 && r.bottom <= (window.innerHeight || document.documentElement.clientHeight);
  }

  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('.wt-play-btn');
    if (b) {
      var p = b.closest('.wt-player');
      frame(p, +(p.getAttribute('data-start') || 0));
      track('film_play', { film: p.getAttribute('data-film') });
      return;
    }
    var c = ev.target.closest('[data-t]');
    if (c) {
      var pl = document.querySelector('.wt-fhero .wt-player');
      if (!pl) return;
      var t = +c.getAttribute('data-t');
      document.querySelectorAll('[data-t]').forEach(function (k) { k.setAttribute('aria-pressed', String(k === c)); });
      seek(pl, t);
      if (!inView(pl)) {
        if (window.lenis) window.lenis.scrollTo(pl, { offset: -96 });
        else pl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      track('film_chapter', { film: pl.getAttribute('data-film'), at: t });
      return;
    }
    var k = ev.target.closest('[data-desk-filter]');
    if (k) { filter(k.getAttribute('data-desk-filter')); return; }
    var o = ev.target.closest('[data-yt-out]');
    if (o) { var q = document.querySelector('.wt-player'); track('film_youtube', { film: q ? q.getAttribute('data-film') : '' }); return; }
    var a = ev.target.closest('a[href^="https://app.finnafamilyoffice.com"]');
    if (a && document.querySelector('.wt-fhero')) {
      track('film_to_app', { film: document.querySelector('.wt-player').getAttribute('data-film') });
    }
  });

  /* Every film, one desk at a time */
  function filter(desk) {
    var keys = document.querySelectorAll('[data-desk-filter]');
    if (!keys.length) return;
    if (!document.querySelector('[data-desk-filter="' + desk + '"]')) desk = 'all';
    keys.forEach(function (k) { k.setAttribute('aria-pressed', String(k.getAttribute('data-desk-filter') === desk)); });
    document.querySelectorAll('.wt-li').forEach(function (li) {
      li.hidden = !(desk === 'all' || li.getAttribute('data-desk') === desk);
    });
  }
  var asked = new URLSearchParams(location.search).get('desk');
  if (asked) filter(asked);
})();
