// Hongbo Huang — personal site interactions
(function () {
  'use strict';

  // Current year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    // Close menu after selecting a link (mobile)
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Reveal-on-scroll
  var revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealItems.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealItems.forEach(function (el) { io.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('in'); });
  }

  // Chat widget
  var fab = document.getElementById('chat-fab');
  var panel = document.getElementById('chat-panel');
  var closeBtn = document.getElementById('chat-close');
  var form = document.getElementById('chat-form');
  var input = document.getElementById('chat-input');
  var sendBtn = document.getElementById('chat-send');
  var logEl = document.getElementById('chat-log');

  if (fab && panel && form && input && logEl) {
    var history = []; // {role, content} pairs sent to the API

    function openPanel() {
      panel.hidden = false;
      fab.setAttribute('aria-expanded', 'true');
      input.focus();
    }
    function closePanel() {
      panel.hidden = true;
      fab.setAttribute('aria-expanded', 'false');
      fab.focus();
    }
    fab.addEventListener('click', function () {
      if (panel.hidden) { openPanel(); } else { closePanel(); }
    });
    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) closePanel();
    });

    function addMessage(text, kind) {
      var el = document.createElement('div');
      el.className = 'chat-msg ' + kind;
      el.textContent = text;
      logEl.appendChild(el);
      logEl.scrollTop = logEl.scrollHeight;
      return el;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;

      addMessage(text, 'user');
      history.push({ role: 'user', content: text });
      input.value = '';
      input.disabled = true;
      sendBtn.disabled = true;

      var typing = addMessage('Thinking…', 'bot typing');

      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          typing.remove();
          if (result.ok && result.data && result.data.reply) {
            addMessage(result.data.reply, 'bot');
            history.push({ role: 'assistant', content: result.data.reply });
          } else {
            var msg = (result.data && result.data.error) ||
              'Sorry, something went wrong.';
            addMessage(msg, 'bot error');
          }
        })
        .catch(function () {
          typing.remove();
          addMessage('Network error — please try again.', 'bot error');
        })
        .then(function () {
          input.disabled = false;
          sendBtn.disabled = false;
          input.focus();
        });
    });
  }
})();
