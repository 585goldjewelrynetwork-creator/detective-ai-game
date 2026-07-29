// ============================================================================
// Чиптюн-звук для игры «Детектив и нейросети»
// ----------------------------------------------------------------------------
// Всё синтезируется в браузере через Web Audio API — звуковых файлов нет,
// репозиторий не тяжелеет. Мелодия оригинальная, написана в 8-битной эстетике.
//
// Звук по умолчанию ВЫКЛЮЧЕН. Выбор запоминается в браузере сотрудника.
// ============================================================================

const Sound = (function () {
  let ctx = null;
  let master = null;
  let musicGain = null;
  let sfxGain = null;
  let enabled = false;
  let musicTimer = null;
  let musicStep = 0;

  // ---------- Загрузка сохранённого выбора ----------
  try {
    enabled = localStorage.getItem("detective_sound") === "on";
  } catch (e) { enabled = false; }

  function ensureCtx() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);

    musicGain = ctx.createGain();
    musicGain.gain.value = 0.16;      // фон тише эффектов
    musicGain.connect(master);

    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.5;
    sfxGain.connect(master);
    return true;
  }

  // ---------- Одна нота ----------
  // freq — частота Гц, dur — длительность сек, type — форма волны
  function note(freq, dur, when, type, gainNode, vol) {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type || "square";
    osc.frequency.setValueAtTime(freq, when);

    const v = vol === undefined ? 1 : vol;
    // короткая атака и спад — характерное «пиканье» 8-бит
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(v, when + 0.008);
    g.gain.setValueAtTime(v, when + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);

    osc.connect(g);
    g.connect(gainNode || sfxGain);
    osc.start(when);
    osc.stop(when + dur + 0.02);
  }

  // Скользящая нота (для «прыжка» и открытия)
  function slide(f1, f2, dur, when, type, vol) {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type || "square";
    osc.frequency.setValueAtTime(f1, when);
    osc.frequency.exponentialRampToValueAtTime(f2, when + dur);
    const v = vol === undefined ? 1 : vol;
    g.gain.setValueAtTime(v, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(g); g.connect(sfxGain);
    osc.start(when); osc.stop(when + dur + 0.02);
  }

  // Шумовой «щелчок» для шагов
  function click(when, vol) {
    if (!ctx) return;
    const len = Math.floor(ctx.sampleRate * 0.03);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass"; f.frequency.value = 1400;
    const g = ctx.createGain();
    g.gain.value = vol === undefined ? 0.25 : vol;
    src.connect(f); f.connect(g); g.connect(sfxGain);
    src.start(when);
  }

  // ---------- Ноты ----------
  const N = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
    C6: 1046.50, E6: 1318.51, G3: 196.00, A3: 220.00, C3: 130.81, E3: 164.81, F3: 174.61, D3: 146.83,
  };

  // ---------- Фоновая мелодия ----------
  // Оригинальная тема в мажоре, 16 шагов, зацикливается.
  // Верхний голос — мелодия, нижний — бас.
  const MELODY = [
    N.C5, N.E5, N.G5, N.E5,  N.F5, N.A5, N.G5, N.E5,
    N.D5, N.F5, N.A5, N.F5,  N.E5, N.G5, N.C6, 0,
  ];
  const BASS = [
    N.C3, 0, N.G3, 0,  N.F3, 0, N.C3, 0,
    N.D3, 0, N.A3, 0,  N.E3, 0, N.G3, 0,
  ];
  const STEP = 0.16; // сек на шаг

  function musicTick() {
    if (!enabled || !ctx) return;
    const t = ctx.currentTime + 0.05;
    const m = MELODY[musicStep % MELODY.length];
    const b = BASS[musicStep % BASS.length];
    if (m) note(m, STEP * 0.9, t, "square", musicGain, 0.5);
    if (b) note(b, STEP * 1.6, t, "triangle", musicGain, 0.8);
    // легкая перкуссия на четные шаги
    if (musicStep % 4 === 0) click(t, 0.05);
    musicStep++;
  }

  function startMusic() {
    if (musicTimer || !enabled) return;
    musicStep = 0;
    musicTick();
    musicTimer = setInterval(musicTick, STEP * 1000);
  }
  function stopMusic() {
    if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
  }

  // ---------- Публичные эффекты ----------
  const api = {
    isEnabled() { return enabled; },

    // Включение/выключение. Вызывать по клику — браузеры требуют жест пользователя.
    toggle() {
      enabled = !enabled;
      try { localStorage.setItem("detective_sound", enabled ? "on" : "off"); } catch (e) {}
      if (enabled) {
        if (!ensureCtx()) { enabled = false; return false; }
        if (ctx.state === "suspended") ctx.resume();
        api.blip();
        startMusic();
      } else {
        stopMusic();
      }
      return enabled;
    },

    // Восстановление музыки после первого клика, если звук был включён ранее
    resumeIfEnabled() {
      if (!enabled) return;
      if (!ensureCtx()) return;
      if (ctx.state === "suspended") ctx.resume();
      startMusic();
    },

    // Улика засчитана — восходящая «монетка»
    coin() {
      if (!enabled || !ensureCtx()) return;
      const t = ctx.currentTime;
      note(N.B5, 0.08, t, "square", sfxGain, 0.9);
      note(N.E6, 0.34, t + 0.08, "square", sfxGain, 0.9);
    },

    // Открытие окна с материалом
    open() {
      if (!enabled || !ensureCtx()) return;
      const t = ctx.currentTime;
      note(N.E5, 0.06, t, "square", sfxGain, 0.6);
      note(N.A5, 0.10, t + 0.06, "square", sfxGain, 0.6);
    },

    // Закрытие окна
    close() {
      if (!enabled || !ensureCtx()) return;
      slide(N.A5, N.D5, 0.12, ctx.currentTime, "square", 0.4);
    },

    // Реплика персонажа
    blip() {
      if (!enabled || !ensureCtx()) return;
      note(N.G5, 0.05, ctx.currentTime, "square", sfxGain, 0.35);
    },

    // Шаг персонажа
    step() {
      if (!enabled || !ctx) return;
      click(ctx.currentTime, 0.07);
    },

    // Подошёл к точке интереса
    near() {
      if (!enabled || !ensureCtx()) return;
      const t = ctx.currentTime;
      note(N.C5, 0.05, t, "triangle", sfxGain, 0.4);
      note(N.G5, 0.07, t + 0.05, "triangle", sfxGain, 0.4);
    },

    // Финал — фанфары
    fanfare() {
      if (!enabled || !ensureCtx()) return;
      stopMusic();
      const t = ctx.currentTime;
      const seq = [
        [N.C5, 0.14], [N.E5, 0.14], [N.G5, 0.14], [N.C6, 0.22],
        [N.G5, 0.14], [N.C6, 0.50],
      ];
      let at = t;
      seq.forEach(([f, d]) => {
        note(f, d, at, "square", sfxGain, 0.75);
        note(f / 2, d, at, "triangle", sfxGain, 0.5);
        at += d;
      });
    },
  };

  return api;
})();
