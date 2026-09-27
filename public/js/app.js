/* InstaSave frontend — paste link, preview, download. Vanilla JS, no deps. */
(function () {
  'use strict';

  var form = document.getElementById('dl-form');
  if (form) {
  var input = document.getElementById('ig-url');
  var btn = document.getElementById('dl-btn');
  var status = document.getElementById('status');
  var result = document.getElementById('result');
  // Per-tool API override: audio/profile/fb/story pages set data-api on the form.
  var api = form.getAttribute('data-api') || '/api/extract';
  var isAudio = api === '/api/audio';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function setStatus(html, kind) {
    status.className = 'status ' + (kind || '');
    status.innerHTML = html;
  }

  function dlHref(fileUrl, kind) {
    return '/api/download?u=' + encodeURIComponent(fileUrl) + '&t=' + (kind === 'image' ? 'image' : 'video');
  }

  var ICON_DL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/></svg>';
  var ICON_RETRY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 2.6-6.4"/><path d="M3 4v5h5"/></svg>';

  function againBtn() {
    return '<button type="button" class="btn btn-soft btn-block" id="dl-again">' + ICON_RETRY + 'Download Again</button>';
  }

  function bindAgain() {
    var b = document.getElementById('dl-again');
    if (b) b.addEventListener('click', function () {
      result.classList.remove('show');
      result.innerHTML = '';
      setStatus('', '');
      input.value = '';
      input.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function render(d) {
    var preview = '';
    var buttons = '';

    if (d.type === 'video' && !d.limited && d.url) {
      preview =
        '<div class="dl-preview"><video controls playsinline preload="metadata"' +
        (d.thumbnail ? ' poster="' + esc(d.thumbnail) + '"' : '') +
        ' src="' + esc(d.url) + '"></video></div>';
      buttons =
        '<a class="btn btn-primary btn-block" href="' + dlHref(d.url, 'video') + '">' + ICON_DL + 'Download Video</a>';
    } else if (d.type === 'video' && d.limited) {
      preview = d.thumbnail
        ? '<div class="dl-preview"><img src="' + esc(d.thumbnail) + '" alt="Video preview" loading="lazy"></div>'
        : '';
      buttons =
        '<div class="limited-note">\u26a0\ufe0f <strong>Video file blocked:</strong> Instagram is currently refusing ' +
        'automated video requests from our server, so the MP4 can\u2019t be fetched right now. ' +
        'Open the reel in the Instagram app and use its built-in save/share instead. ' +
        'We retry the video automatically on every request \u2014 it unlocks the moment Instagram allows it.</div>';
    } else if (d.type === 'image' && d.images.length) {
      preview = '<div class="dl-preview"><img src="' + esc(d.images[0]) + '" alt="Photo preview" loading="lazy"></div>';
      buttons =
        '<a class="btn btn-primary btn-block" href="' + dlHref(d.images[0], 'image') + '">' + ICON_DL + 'Download Photo</a>';
    } else if (d.type === 'carousel' && d.images.length) {
      preview = '<div class="dl-preview"><img src="' + esc(d.images[0]) + '" alt="Photo 1 preview" loading="lazy"></div>';
      buttons = d.images.map(function (src, i) {
        return '<a class="btn btn-primary btn-block" href="' + dlHref(src, 'image') + '">' + ICON_DL + 'Download Photo ' + (i + 1) + '</a>';
      }).join('');
    }

    result.innerHTML =
      '<div class="dl-result">' + preview + buttons + againBtn() + '</div>';
    result.classList.add('show');
    bindAgain();
  }

  /* Audio tool: the endpoint returns an MP3 file directly (or JSON on error). */
  function renderAudio(blobUrl, title) {
    result.innerHTML =
      '<div class="dl-result">' +
      '<div class="dl-preview"><div class="dl-art"><img src="/img/icons/music.png" alt="" aria-hidden="true"></div></div>' +
      '<a class="btn btn-primary btn-block" href="' + blobUrl + '" download="instasave-audio.mp3">' + ICON_DL + 'Download MP3</a>' +
      againBtn() +
      '</div>';
    result.classList.add('show');
    bindAgain();
  }

  function handleAudio(url) {
    setStatus('<span class="spinner"></span>Converting to MP3… this takes a few seconds.', 'loading');
    fetch(api + '?url=' + encodeURIComponent(url))
      .then(function (r) {
        var ct = r.headers.get('content-type') || '';
        if (!r.ok || ct.indexOf('application/json') !== -1) {
          return r.json().then(function (j) { throw new Error(j.message || 'Conversion failed.'); });
        }
        return r.blob();
      })
      .then(function (blob) {
        btn.disabled = false;
        if (!blob || !blob.size) throw new Error('Empty audio file.');
        var blobUrl = URL.createObjectURL(blob);
        setStatus('✅ Your MP3 is ready.', 'ok');
        renderAudio(blobUrl, url);
      })
      .catch(function (err) {
        btn.disabled = false;
        setStatus('❌ ' + esc(err.message || 'Something went wrong. Please try again.'), 'error');
      });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var url = input.value.trim();
    if (!url) {
      setStatus('Please paste a link first.', 'error');
      input.focus();
      return;
    }
    btn.disabled = true;
    result.classList.remove('show');
    result.innerHTML = '';

    if (isAudio) {
      handleAudio(url);
      return;
    }

    setStatus('<span class="spinner"></span>Fetching media…', 'loading');

    fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url }),
    })
      .then(function (r) { return r.json().then(function (j) { return { status: r.status, body: j }; }); })
      .then(function (res) {
        btn.disabled = false;
        if (!res.body.ok) {
          setStatus('❌ ' + esc(res.body.message || 'Something went wrong. Please try again.'), 'error');
          return;
        }
        setStatus('✅ Media found — tap download below.', 'ok');
        render(res.body);
        try {
          var h = JSON.parse(localStorage.getItem('instasave_history') || '[]');
          h.unshift({ url: res.body.source, title: res.body.title, at: Date.now() });
          localStorage.setItem('instasave_history', JSON.stringify(h.slice(0, 10)));
        } catch (e) { /* private mode */ }
      })
      .catch(function () {
        btn.disabled = false;
        setStatus('❌ Network error. Check your connection and try again.', 'error');
      });
  });

  // Sample-link chips: fill the input and auto-submit.
  Array.prototype.forEach.call(document.querySelectorAll('.sample-link'), function (chip) {
    chip.addEventListener('click', function () {
      input.value = chip.getAttribute('data-url') || '';
      input.focus();
      form.dispatchEvent(new Event('submit', { cancelable: true }));
    });
  });


  // Paste helper: if clipboard holds a supported link, offer it.
  input.addEventListener('focus', function () {
    if (input.value) return;
    if (!navigator.clipboard || !navigator.clipboard.readText) return;
    navigator.clipboard.readText().then(function (t) {
      t = (t || '').trim();
      if (/instagram\.com\//i.test(t) || /facebook\.com\//i.test(t) || /fb\.watch\//i.test(t)) input.value = t;
    }).catch(function () {});
  });
  } // end if (form) — theme toggle, contact form and paste helper run on every page.

  // Theme toggle: dark <-> light, persisted, respects OS preference on first visit.
  var themeBtn = document.querySelector('.theme-toggle');
  var metaTheme = document.querySelector('meta[name="theme-color"]');
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('instasave_theme', t); } catch (e) {}
    if (themeBtn) themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    if (metaTheme) metaTheme.setAttribute('content', t === 'dark' ? '#07070d' : '#f5f5fa');
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(cur === 'dark' ? 'light' : 'dark');
    });
    // sync label with the theme set by the head inline script
    applyTheme(document.documentElement.getAttribute('data-theme') || 'light');
  }

  // Contact form: POSTs to /api/contact and shows an inline confirmation.
  var cform = document.getElementById('contact-form');
  if (cform) {
    cform.addEventListener('submit', function (e) {
      e.preventDefault();
      var cstatus = document.getElementById('contact-status');
      var cbtn = cform.querySelector('button[type="submit"]');
      var data = {
        name: (cform.querySelector('[name="name"]') || {}).value || '',
        email: (cform.querySelector('[name="email"]') || {}).value || '',
        message: (cform.querySelector('[name="message"]') || {}).value || '',
      };
      if (cbtn) cbtn.disabled = true;
      if (cstatus) cstatus.innerHTML = '<span class="spinner"></span>Sending…';
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (cbtn) cbtn.disabled = false;
          if (!j.ok) {
            if (cstatus) cstatus.innerHTML = '❌ ' + esc(j.message || 'Could not send. Please try again.');
            return;
          }
          cform.reset();
          if (cstatus) cstatus.innerHTML = '✅ Message sent — we usually reply within 48 hours.';
        })
        .catch(function () {
          if (cbtn) cbtn.disabled = false;
          if (cstatus) cstatus.innerHTML = '❌ Network error. Please try again.';
        });
    });
  }

})();
