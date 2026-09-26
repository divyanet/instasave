/* InstaSave frontend — paste link, preview, download. Vanilla JS, no deps. */
(function () {
  'use strict';

  var form = document.getElementById('dl-form');
  if (!form) return;
  var input = document.getElementById('ig-url');
  var btn = document.getElementById('dl-btn');
  var status = document.getElementById('status');
  var result = document.getElementById('result');

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
      '<div class="result-card">' +
      (d.thumbnail ? '<img class="result-thumb" src="' + esc(d.thumbnail) + '" alt="Media preview" loading="lazy">' : '') +
      '<div class="result-meta">' +
      '<span class="result-type">' + esc(typeLabel(d)) + '</span>' +
      '<div class="result-title">' + esc(d.title || 'Instagram media') + '</div>' +
      authorHtml +
      '<div class="result-actions">' + actions + '</div>' +
      '</div></div>' + extra;

    result.classList.add('show');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var url = input.value.trim();
    if (!url) {
      setStatus('Please paste an Instagram link first.', 'error');
      input.focus();
      return;
    }
    btn.disabled = true;
    result.classList.remove('show');
    result.innerHTML = '';
    setStatus('<span class="spinner"></span>Fetching media from Instagram…', 'loading');

    fetch('/api/extract', {
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

  // Paste helper: if clipboard holds an instagram link, offer it.
  input.addEventListener('focus', function () {
    if (input.value) return;
    if (!navigator.clipboard || !navigator.clipboard.readText) return;
    navigator.clipboard.readText().then(function (t) {
      if (/instagram\.com\/(p|reel|reels|tv)\//i.test(t || '')) input.value = t.trim();
    }).catch(function () {});
  });
})();
