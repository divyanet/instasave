/* InstaSave frontend — paste link, preview, download. Vanilla JS, no deps. */
(function () {
  'use strict';

  var form = document.getElementById('dl-form');
  if (!form) return;
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

  function typeLabel(d) {
    if (d.type === 'video') return d.limited ? 'Reel preview' : 'Reel video';
    if (d.type === 'carousel') return 'Carousel · ' + d.images.length + ' photos';
    return 'Photo';
  }

  function render(d) {
    var authorHtml = d.author
      ? '<div class="result-author">by ' +
        (d.authorUrl
          ? '<a href="' + esc(d.authorUrl) + '" target="_blank" rel="noopener">@' + esc(d.author) + '</a>'
          : '@' + esc(d.author)) + '</div>'
      : '';

    var actions = '';
    var extra = '';

    if (d.type === 'video' && !d.limited && d.url) {
      actions =
        '<a class="btn btn-grad btn-sm" href="' + dlHref(d.url, 'video') + '">⬇ Download video (MP4)</a>' +
        (d.thumbnail ? '<a class="btn btn-ghost btn-sm" href="' + dlHref(d.thumbnail, 'image') + '">Cover photo</a>' : '');
    } else if (d.type === 'video' && d.limited) {
      actions = d.thumbnail
        ? '<a class="btn btn-grad btn-sm" href="' + dlHref(d.thumbnail, 'image') + '">⬇ Download cover photo</a>'
        : '';
      extra =
        '<div class="limited-note">⚠️ <strong>Video file blocked:</strong> Instagram is currently refusing ' +
        'automated video requests from our server, so the MP4 can’t be fetched right now. ' +
        'You can save the cover photo above, or open the reel in the Instagram app and use its built-in save/share. ' +
        'We retry the video automatically on every request — it unlocks the moment Instagram allows it.</div>';
    } else if (d.type === 'image' && d.images.length) {
      actions = '<a class="btn btn-grad btn-sm" href="' + dlHref(d.images[0], 'image') + '">⬇ Download photo (JPG)</a>';
    } else if (d.type === 'carousel' && d.images.length) {
      extra =
        '<div class="carousel-grid">' +
        d.images.map(function (src, i) {
          return (
            '<div class="carousel-item"><img src="' + esc(src) + '" alt="Photo ' + (i + 1) + '" loading="lazy">' +
            '<a href="' + dlHref(src, 'image') + '">⬇ Photo ' + (i + 1) + '</a></div>'
          );
        }).join('') +
        '</div>';
    }

    actions +=
      ' <a class="btn btn-ghost btn-sm" href="' + esc(d.source) + '" target="_blank" rel="noopener">Open original ↗</a>';

    result.innerHTML =
      '<div class="result-card"><div class="rc-inner">' +
      (d.thumbnail ? '<img class="result-thumb" src="' + esc(d.thumbnail) + '" alt="Media preview" loading="lazy">' : '') +
      '<div class="result-meta">' +
      '<span class="result-type">' + esc(typeLabel(d)) + '</span>' +
      '<div class="result-title">' + esc(d.title || 'Instagram media') + '</div>' +
      authorHtml +
      '<div class="result-actions">' + actions + '</div>' +
      '</div></div></div>' + extra;

    result.classList.add('show');
  }

  /* Audio tool: the endpoint returns an MP3 file directly (or JSON on error). */
  function renderAudio(blobUrl, title) {
    result.innerHTML =
      '<div class="result-card"><div class="rc-inner">' +
      '<div class="audio-art" aria-hidden="true">🎵</div>' +
      '<div class="result-meta">' +
      '<span class="result-type">MP3 audio</span>' +
      '<div class="result-title">' + esc(title || 'Instagram audio') + '</div>' +
      '<div class="result-actions">' +
      '<a class="btn btn-grad btn-sm" href="' + blobUrl + '" download="instasave-audio.mp3">⬇ Download MP3</a>' +
      '</div></div></div></div>';
    result.classList.add('show');
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

  // Paste helper: if clipboard holds a supported link, offer it.
  input.addEventListener('focus', function () {
    if (input.value) return;
    if (!navigator.clipboard || !navigator.clipboard.readText) return;
    navigator.clipboard.readText().then(function (t) {
      t = (t || '').trim();
      if (/instagram\.com\//i.test(t) || /facebook\.com\//i.test(t) || /fb\.watch\//i.test(t)) input.value = t;
    }).catch(function () {});
  });
})();
