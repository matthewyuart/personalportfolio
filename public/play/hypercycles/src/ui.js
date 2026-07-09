/* =====================================================================
 * HyperCycles — UI, rendering & animation
 * ===================================================================== */
(function () {
  'use strict';

  var E = window.HCEngine;

  // ---- defaults -----------------------------------------------------
  function defaultStages() {
    return [
      { R: 144, r: 52, d: 0.75, phase: 0 },
      { R: 60, r: 24, d: 0.80, phase: 0 }
    ];
  }

  // light is pure white; the panel derives a light gray from it
  var BG_PRESETS = { light: '#ffffff', dark: '#14151a' };

  // ---- state ---------------------------------------------------------
  var state = {
    stages: defaultStages(),
    penColor: '#ff5a1f',
    opacity: 0.7,
    lineWidth: 1.2,
    bgColor: BG_PRESETS.light,
    bgMode: 'light',
    rainbow: false,
    animate: true,
    showMachine: true,
    speed: 1,
    hasDrawn: false
  };

  // ---- canvases ------------------------------------------------------
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var curveCanvas = document.createElement('canvas'); // persistent ink layer
  var cctx = curveCanvas.getContext('2d');
  var dpr = Math.max(1, window.devicePixelRatio || 1);

  var view = { w: 0, h: 0, cx: 0, cy: 0, scale: 1 };
  var curve = null;
  var arms = null;
  var meta = { revolutions: 1, closed: true };
  var anim = { raf: 0, index: 0, drawn: 0, running: false, paused: false, lastT: 0, steps: 0 };

  // ---- sizing --------------------------------------------------------
  function resize() {
    var rect = document.getElementById('stage').getBoundingClientRect();
    view.w = rect.width;
    view.h = rect.height;
    [canvas, curveCanvas].forEach(function (c) {
      c.width = Math.round(rect.width * dpr);
      c.height = Math.round(rect.height * dpr);
      c.style.width = rect.width + 'px';
      c.style.height = rect.height + 'px';
    });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    view.cx = rect.width / 2;
    view.cy = rect.height / 2;
    rebuild();
  }

  function project(p) {
    return { x: view.cx + p.x * view.scale, y: view.cy - p.y * view.scale };
  }

  // ---- build geometry from current state (cheap; no sampling) -------
  // Runs on every slider tick, so it stays light: it only computes the arms,
  // the closing period (for the readout) and the autoscale. The expensive
  // point sampling happens lazily in draw().
  function rebuild() {
    arms = E.stagesToArms(state.stages);

    var closeRev = E.closureRevolutions(arms);
    meta.closed = closeRev != null;
    meta.revolutions = meta.closed ? closeRev : 240;

    var margin = 56;
    var maxR = E.maxRadius(arms);
    view.scale = (Math.min(view.w, view.h) / 2 - margin) / maxR;

    // geometry changed: discard any existing drawing and wait for "draw"
    stopAnim();
    anim.paused = false;
    cctx.clearRect(0, 0, view.w, view.h);
    curve = null;
    anim.steps = 0;
    anim.index = 0;
    anim.drawn = 0;
    state.hasDrawn = false;

    applyStageTheme();
    updateReadout();
    composite(0); // blank background, nothing drawn yet
    updatePauseControl();
  }

  // explicitly render the current configuration (triggered by the draw button)
  function draw() {
    // already animating? ignore extra clicks so they don't restart it
    if (anim.running) return;

    stopAnim();
    anim.paused = false;
    var perRev = state.stages.length >= 3 ? 220 : 360;
    curve = E.sampleCurve(arms, { samplesPerRev: perRev, maxRevolutions: 240 });

    cctx.clearRect(0, 0, view.w, view.h);
    anim.steps = curve.points.length - 1;
    anim.index = 0;
    anim.drawn = 0;
    state.hasDrawn = true;
    if (state.animate) {
      startAnim();
    } else {
      strokeRange(0, anim.steps);
      composite(anim.steps);
    }
    updatePauseControl();
  }

  // pause / resume the running trace at any point
  function togglePause() {
    if (anim.running) {
      anim.running = false;
      if (anim.raf) cancelAnimationFrame(anim.raf);
      anim.raf = 0;
      anim.paused = true;
      composite(Math.floor(anim.index)); // hide the moving gears while paused
    } else if (anim.paused) {
      anim.paused = false;
      anim.running = true;
      anim.lastT = performance.now();
      anim.raf = requestAnimationFrame(tick);
    }
    updatePauseControl();
  }

  function updatePauseControl() {
    var b = document.getElementById('pause');
    if (anim.running) { b.textContent = 'pause'; b.disabled = false; }
    else if (anim.paused) { b.textContent = 'resume'; b.disabled = false; }
    else { b.textContent = 'pause'; b.disabled = true; }
  }

  // wipe the canvas back to a blank background
  function clearCanvas() {
    stopAnim();
    anim.paused = false;
    cctx.clearRect(0, 0, view.w, view.h);
    anim.index = 0;
    anim.drawn = 0;
    state.hasDrawn = false;
    composite(0);
    updatePauseControl();
  }

  // ---- ink rendering -------------------------------------------------
  function strokeRange(from, to) {
    if (!curve) return;
    from = Math.max(0, from);
    to = Math.min(curve.points.length - 1, to);
    if (to <= from) return;
    cctx.lineWidth = state.lineWidth;
    cctx.lineJoin = 'round';
    cctx.lineCap = 'round';

    if (state.rainbow) {
      for (var i = from; i < to; i++) {
        var a = project(curve.points[i]);
        var b = project(curve.points[i + 1]);
        cctx.strokeStyle = 'hsla(' + Math.round(360 * (i / anim.steps)) +
          ', 85%, 55%, ' + state.opacity + ')';
        cctx.beginPath();
        cctx.moveTo(a.x, a.y);
        cctx.lineTo(b.x, b.y);
        cctx.stroke();
      }
    } else {
      cctx.strokeStyle = hexToRgba(state.penColor, state.opacity);
      cctx.beginPath();
      var s = project(curve.points[from]);
      cctx.moveTo(s.x, s.y);
      for (var j = from + 1; j <= to; j++) {
        var p = project(curve.points[j]);
        cctx.lineTo(p.x, p.y);
      }
      cctx.stroke();
    }
  }

  function composite(index) {
    ctx.fillStyle = state.bgColor;
    ctx.fillRect(0, 0, view.w, view.h);
    ctx.drawImage(curveCanvas, 0, 0, view.w, view.h);
    if (anim.running && state.showMachine && index < anim.steps) {
      drawMachine(index);
    }
  }

  function recomposite() {
    composite(anim.running ? Math.floor(anim.index) : anim.steps);
  }

  function drawMachine(index) {
    var mc = machineColors();
    var t = curve.tMax * (index / anim.steps);
    var pts = E.joints(arms, t).map(project);

    ctx.lineWidth = 1;
    for (var k = 0; k < arms.length; k++) {
      ctx.strokeStyle = mc.circle;
      ctx.beginPath();
      ctx.arc(pts[k].x, pts[k].y, Math.abs(arms[k].amp) * view.scale, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.strokeStyle = mc.arm;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();

    for (var j = 0; j < pts.length; j++) {
      var last = j === pts.length - 1;
      ctx.fillStyle = last ? state.penColor : mc.joint;
      ctx.beginPath();
      ctx.arc(pts[j].x, pts[j].y, last ? 4 : 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function machineColors() {
    if (isLight(state.bgColor)) {
      return {
        circle: 'rgba(22,22,15,0.13)',
        arm: 'rgba(22,22,15,0.55)',
        joint: 'rgba(22,22,15,0.9)'
      };
    }
    return {
      circle: 'rgba(170,185,215,0.16)',
      arm: 'rgba(195,210,240,0.7)',
      joint: 'rgba(228,235,252,0.95)'
    };
  }

  function applyStageTheme() {
    var dark = !isLight(state.bgColor);
    document.getElementById('stage').classList.toggle('dark', dark);
    applyPanelTheme(state.bgColor, dark);
  }

  // derive the whole panel palette from the background color: a darker version
  // when the bg is light, a lighter version when the bg is dark — tinted with
  // the background's own hue.
  function applyPanelTheme(bg, dark) {
    var hsl = hexToHsl(bg);                 // { h, s:0-1, l:0-100 }
    var h = hsl.h, s = Math.min(hsl.s, 0.30), L = hsl.l;
    var root = document.documentElement.style;
    function setv(name, l, sat) {
      root.setProperty(name, hslToHex(h, sat == null ? s : sat, clamp(l, 4, 96) / 100));
    }
    if (!dark) {
      setv('--bg', L - 9);     // panel surface (darker than the light stage)
      setv('--paper', L - 2);  // cards
      setv('--paper-2', L - 5);
      setv('--line', L - 18);
      setv('--line-2', L - 28);
      setv('--ink', 10, Math.min(s, 0.18));
      setv('--muted', 46, Math.min(s, 0.12));
    } else {
      setv('--bg', L + 11);    // panel surface (lighter than the dark stage)
      setv('--paper', L + 6);
      setv('--paper-2', L + 9);
      setv('--line', L + 20);
      setv('--line-2', L + 30);
      setv('--ink', 93, Math.min(s, 0.10));
      setv('--muted', 60, Math.min(s, 0.10));
    }
  }

  // ---- animation loop ------------------------------------------------
  function startAnim() {
    stopAnim();
    anim.running = true;
    anim.lastT = performance.now();
    anim.raf = requestAnimationFrame(tick);
  }
  function stopAnim() {
    anim.running = false;
    if (anim.raf) cancelAnimationFrame(anim.raf);
    anim.raf = 0;
  }
  function tick(now) {
    if (!anim.running) return;
    // dt must never be negative: rAF timestamps can lag performance.now()
    // (esp. on a backgrounded tab), and a negative dt would drive the index
    // backwards into undefined curve points and stall the trace.
    var dt = Math.max(0, Math.min(0.05, (now - anim.lastT) / 1000));
    anim.lastT = now;

    var durationSec = clamp(curve.revolutions * 0.06, 2.5, 10) / state.speed;
    var segsPerSec = anim.steps / durationSec;
    anim.index = Math.max(0, Math.min(anim.steps, anim.index + segsPerSec * dt));

    var target = Math.floor(anim.index);
    strokeRange(anim.drawn, target);
    anim.drawn = target;
    composite(target);

    if (anim.index >= anim.steps) {
      composite(anim.steps);
      stopAnim();
      anim.paused = false;
      updatePauseControl();
      return;
    }
    anim.raf = requestAnimationFrame(tick);
  }

  // ---- readout -------------------------------------------------------
  function updateReadout() {
    var el = document.getElementById('readout');
    var period = meta.closed
      ? '<b>' + meta.revolutions + '</b> rev to close'
      : '<b>open</b> · non-repeating';
    el.innerHTML =
      '<b>' + state.stages.length + '</b> stage' + (state.stages.length > 1 ? 's' : '') +
      ' &nbsp;/&nbsp; <b>' + arms.length + '</b> arms' +
      ' &nbsp;/&nbsp; ' + period;
  }

  // ---- stage card UI -------------------------------------------------
  var KEYS = ['R', 'r', 'd', 'phase'];

  function renderStages() {
    var host = document.getElementById('stages');
    host.innerHTML = '';
    state.stages.forEach(function (s, idx) {
      var card = document.createElement('div');
      card.className = 'stage-card';
      var label = idx === 0 ? 'outer' :
        (idx === state.stages.length - 1 ? 'pen' : 'nested');
      card.innerHTML =
        '<div class="stage-title"><span>stage ' + (idx + 1) + '</span>' +
        '<span class="badge">' + label + '</span></div>' +
        field('R', 'ring teeth', 24, 240, 1, s.R) +
        field('r', 'gear teeth', 6, Math.max(8, s.R - 2), 1, s.r) +
        field('d', 'pen offset', 0, 1, 0.01, s.d) +
        field('phase', 'phase', 0, 360, 1, Math.round(s.phase * 180 / Math.PI));

      var ranges = {}, nums = {};
      KEYS.forEach(function (k) {
        ranges[k] = card.querySelector('input[type="range"][data-key="' + k + '"]');
        nums[k] = card.querySelector('input.num[data-key="' + k + '"]');
      });

      function valOf(k) {
        return k === 'phase' ? Math.round(s.phase * 180 / Math.PI) : s[k];
      }
      function fmt(k, v) { return k === 'd' ? Number(v).toFixed(2) : String(Math.round(v)); }
      function sync(k) {
        var v = valOf(k);
        ranges[k].value = k === 'd' ? v : Math.round(v);
        if (document.activeElement !== nums[k]) nums[k].value = fmt(k, v);
      }
      function apply(k, v) {
        if (k === 'phase') { s.phase = Math.round(v) * Math.PI / 180; return; }
        if (k === 'd') { s.d = v; return; }
        v = Math.round(v);
        if (k === 'R') {
          s.R = v;
          var rmax = v - 2;
          ranges.r.max = rmax; nums.r.max = rmax;
          if (s.r > rmax) { s.r = rmax; sync('r'); }
        } else { // r
          s.r = Math.min(v, s.R - 2);
        }
      }
      function commit(k, raw) {
        var v = parseFloat(raw);
        if (isNaN(v)) { sync(k); return; }
        v = clamp(v, parseFloat(ranges[k].min), parseFloat(ranges[k].max));
        apply(k, v);
        sync(k);
        rebuild();
      }

      KEYS.forEach(function (k) {
        // slider: live while dragging (smooth, no DOM rebuild)
        ranges[k].addEventListener('input', function () { commit(k, ranges[k].value); });
        // typed value: commit on Enter / blur, allow Enter to confirm
        nums[k].addEventListener('change', function () { commit(k, nums[k].value); });
        nums[k].addEventListener('keydown', function (e) { if (e.key === 'Enter') nums[k].blur(); });
      });

      host.appendChild(card);
    });
  }

  function field(key, label, min, max, step, val) {
    var disp = key === 'd' ? Number(val).toFixed(2) : val;
    return '<div class="field">' +
      '<span class="field-head"><span class="field-name">' + label + '</span>' +
      '<input class="num" type="number" inputmode="decimal" data-key="' + key + '"' +
      ' min="' + min + '" max="' + max + '" step="' + step + '" value="' + disp + '"></span>' +
      '<input type="range" data-key="' + key + '" min="' + min + '" max="' + max +
      '" step="' + step + '" value="' + val + '"></div>';
  }

  // ---- color wheel (HSV-ish disc + lightness) ------------------------
  function buildWheel(container, initialHex, onChange) {
    container.innerHTML = '';
    var size = 150;
    var cv = document.createElement('canvas');
    cv.width = size; cv.height = size; cv.className = 'wheel-disc';
    var marker = document.createElement('div'); marker.className = 'wheel-marker';
    var wrap = document.createElement('div'); wrap.className = 'wheel-wrap';
    wrap.appendChild(cv); wrap.appendChild(marker);

    var light = document.createElement('input');
    light.type = 'range'; light.min = 0; light.max = 100; light.step = 1;
    light.className = 'wheel-light';

    var hexRow = document.createElement('div'); hexRow.className = 'wheel-hex';
    var hexIn = document.createElement('input'); hexIn.type = 'text'; hexIn.maxLength = 7;
    hexRow.appendChild(hexIn);

    container.appendChild(wrap);
    container.appendChild(light);
    container.appendChild(hexRow);

    var dctx = cv.getContext('2d');
    var hsl = hexToHsl(initialHex); // { h:0-360, s:0-1, l:0-100 }

    function renderDisc() {
      var img = dctx.createImageData(size, size);
      var d = img.data, R = size / 2;
      for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
          var dx = x - R, dy = y - R, dist = Math.sqrt(dx * dx + dy * dy), idx = (y * size + x) * 4;
          if (dist > R) { d[idx + 3] = 0; continue; }
          var h = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
          var rgb = hslToRgb(h, Math.min(1, dist / R), hsl.l / 100);
          d[idx] = rgb[0]; d[idx + 1] = rgb[1]; d[idx + 2] = rgb[2]; d[idx + 3] = 255;
        }
      }
      dctx.putImageData(img, 0, 0);
    }
    function placeMarker() {
      var R = size / 2, ang = hsl.h * Math.PI / 180, rad = hsl.s * R;
      marker.style.left = (R + Math.cos(ang) * rad) + 'px';
      marker.style.top = (R + Math.sin(ang) * rad) + 'px';
    }
    function emit(fire) {
      var hex = hslToHex(hsl.h, hsl.s, hsl.l / 100);
      hexIn.value = hex.toUpperCase();
      marker.style.background = hex;
      if (fire !== false) onChange(hex);
    }
    function fromPointer(e) {
      var rect = cv.getBoundingClientRect(), R = size / 2;
      var x = (e.clientX - rect.left) * (size / rect.width) - R;
      var y = (e.clientY - rect.top) * (size / rect.height) - R;
      hsl.h = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
      hsl.s = Math.min(1, Math.sqrt(x * x + y * y) / R);
      placeMarker(); emit(true);
    }

    var dragging = false;
    wrap.addEventListener('pointerdown', function (e) { dragging = true; wrap.setPointerCapture(e.pointerId); fromPointer(e); });
    wrap.addEventListener('pointermove', function (e) { if (dragging) fromPointer(e); });
    wrap.addEventListener('pointerup', function () { dragging = false; });
    wrap.addEventListener('pointercancel', function () { dragging = false; });

    light.value = hsl.l;
    light.addEventListener('input', function () { hsl.l = parseFloat(light.value); renderDisc(); emit(true); });
    hexIn.addEventListener('change', function () {
      var v = hexIn.value.trim();
      if (/^#?[0-9a-fA-F]{6}$/.test(v)) {
        if (v[0] !== '#') v = '#' + v;
        hsl = hexToHsl(v); light.value = hsl.l; renderDisc(); placeMarker(); emit(true);
      }
    });

    renderDisc(); placeMarker();
    hexIn.value = initialHex.toUpperCase();
    marker.style.background = initialHex;

    function applyHex(hex, fire) {
      hsl = hexToHsl(hex); light.value = hsl.l; renderDisc(); placeMarker(); emit(fire);
    }
    return {
      set: function (hex) { applyHex(hex, true); },
      setSilent: function (hex) { applyHex(hex, false); }
    };
  }

  // ---- helpers -------------------------------------------------------
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function hexToRgba(hex, a) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function isLight(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 140;
  }
  function hslToRgb(h, s, l) {
    var c = (1 - Math.abs(2 * l - 1)) * s, hp = h / 60, x = c * (1 - Math.abs(hp % 2 - 1)), r, g, b;
    if (hp < 1) { r = c; g = x; b = 0; } else if (hp < 2) { r = x; g = c; b = 0; }
    else if (hp < 3) { r = 0; g = c; b = x; } else if (hp < 4) { r = 0; g = x; b = c; }
    else if (hp < 5) { r = x; g = 0; b = c; } else { r = c; g = 0; b = x; }
    var m = l - c / 2;
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  }
  function hslToHex(h, s, l) {
    return '#' + hslToRgb(h, s, l).map(function (v) { return ('0' + v.toString(16)).slice(-2); }).join('');
  }
  function hexToHsl(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var r = parseInt(h.slice(0, 2), 16) / 255, g = parseInt(h.slice(2, 4), 16) / 255, b = parseInt(h.slice(4, 6), 16) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min, s = 0, hue = 0;
    if (d) {
      s = d / (1 - Math.abs(2 * l - 1));
      if (max === r) hue = ((g - b) / d) % 6;
      else if (max === g) hue = (b - r) / d + 2;
      else hue = (r - g) / d + 4;
      hue *= 60; if (hue < 0) hue += 360;
    }
    return { h: hue, s: s, l: l * 100 };
  }

  // ---- controls wiring ----------------------------------------------
  function el(id) { return document.getElementById(id); }
  function bind(id, evt, fn) { el(id).addEventListener(evt, fn); }

  function setupSwitch(id, initial, onChange) {
    var node = el(id);
    function set(v) { node.classList.toggle('on', v); node.setAttribute('aria-pressed', v); }
    set(initial);
    node.addEventListener('click', function () {
      var v = !node.classList.contains('on');
      set(v); onChange(v);
    });
  }

  var penWheel, bgWheel;

  function initControls() {
    bind('addStage', 'click', function () {
      if (state.stages.length >= 5) return;
      state.stages.push({ R: 60, r: 23, d: 0.8, phase: 0 });
      renderStages(); rebuild();
    });
    bind('removeStage', 'click', function () {
      if (state.stages.length <= 1) return;
      state.stages.pop();
      renderStages(); rebuild();
    });

    // --- background light/dark toggle ---
    var bgMode = el('bgMode');
    bgMode.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        bgMode.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        state.bgMode = b.dataset.v;
        state.bgColor = BG_PRESETS[state.bgMode];
        el('bgSwatch').style.background = state.bgColor;
        if (bgWheel) bgWheel.setSilent(state.bgColor);
        applyStageTheme();
        recomposite();
      });
    });

    // --- color wheels (toggleable) ---
    el('penSwatch').style.background = state.penColor;
    el('bgSwatch').style.background = state.bgColor;

    penWheel = buildWheel(el('penWheel'), state.penColor, function (hex) {
      state.penColor = hex;
      el('penSwatch').style.background = hex;
      redrawStatic();
    });
    bgWheel = buildWheel(el('bgWheel'), state.bgColor, function (hex) {
      state.bgColor = hex;
      state.bgMode = 'custom';
      el('bgSwatch').style.background = hex;
      bgMode.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
      applyStageTheme();
      recomposite();
    });
    setupWheelToggle('penSwatch', 'penWheel');
    setupWheelToggle('bgSwatch', 'bgWheel');

    // --- sliders ---
    bind('opacity', 'input', function (e) {
      state.opacity = parseFloat(e.target.value);
      el('opacityVal').textContent = state.opacity.toFixed(2);
      redrawStatic();
    });
    bind('lineWidth', 'input', function (e) {
      state.lineWidth = parseFloat(e.target.value);
      el('widthVal').textContent = state.lineWidth.toFixed(1);
      redrawStatic();
    });
    bind('speed', 'input', function (e) {
      state.speed = parseFloat(e.target.value);
      el('speedVal').textContent = state.speed.toFixed(1) + '×';
    });

    // --- switches ---
    setupSwitch('rainbow', state.rainbow, function (v) { state.rainbow = v; redrawStatic(); });
    setupSwitch('animate', state.animate, function (v) { state.animate = v; });
    setupSwitch('showMachine', state.showMachine, function (v) { state.showMachine = v; recomposite(); });

    // --- actions ---
    bind('draw', 'click', draw);
    bind('pause', 'click', togglePause);
    bind('clear', 'click', clearCanvas);
    bind('export', 'click', exportPng);
  }

  function setupWheelToggle(swatchId, popId) {
    var sw = el(swatchId), pop = el(popId);
    sw.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = pop.hidden;
      // close any other open wheel
      document.querySelectorAll('.wheel-pop').forEach(function (p) { p.hidden = true; });
      pop.hidden = !open;
    });
    pop.addEventListener('click', function (e) { e.stopPropagation(); });
  }
  document.addEventListener('click', function () {
    document.querySelectorAll('.wheel-pop').forEach(function (p) { p.hidden = true; });
  });

  function redrawStatic() {
    if (anim.running) return;            // mid-trace: new colors apply to upcoming segments
    if (!state.hasDrawn) { recomposite(); return; } // nothing drawn yet -> just refresh bg
    cctx.clearRect(0, 0, view.w, view.h);
    strokeRange(0, anim.steps);
    composite(anim.steps);
  }

  function exportPng() {
    // save exactly what is currently on the canvas (background + drawn ink)
    var out = document.createElement('canvas');
    out.width = curveCanvas.width;
    out.height = curveCanvas.height;
    var octx = out.getContext('2d');
    octx.fillStyle = state.bgColor;
    octx.fillRect(0, 0, out.width, out.height);
    octx.drawImage(curveCanvas, 0, 0);
    var link = document.createElement('a');
    link.download = 'hypercycles.png';
    link.href = out.toDataURL('image/png');
    link.click();
  }

  // ---- boot ----------------------------------------------------------
  window.addEventListener('resize', resize);
  renderStages();
  initControls();
  resize();
})();
