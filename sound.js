// ============================================================================
// Чиптюн-звук для игры «Детектив и нейросети»
// ----------------------------------------------------------------------------
// Всё синтезируется в браузере через Web Audio API — звуковых файлов нет,
// репозиторий не тяжелеет. Мелодия оригинальная, написана в 8-битной эстетике.
//
// ЛОГИКА:
//   Звуковые эффекты (шаги, монетка, блипы, фанфары) — работают всегда.
//   Фоновая мелодия — включается и выключается: кнопкой сверху, кнопкой «♫»
//   в окне улики и клавишей M. Выбор запоминается в браузере сотрудника.
//
// Браузеры не разрешают звук до первого действия пользователя, поэтому
// game.js вызывает Sound.resume() по клику «Начать расследование».
// ============================================================================

const Sound = (function () {
  let ctx = null;
  let master = null;
  let musicGain = null;
  let sfxGain = null;
  let musicOn = true;          // фоновая мелодия
  let musicTimer = null;
  let musicStep = 0;

  // ---------- Загрузка сохранённого выбора ----------
  try {
    musicOn = localStorage.getItem("detective_music") !== "off";
  } catch (e) { musicOn = true; }

  function ensureCtx() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);

    musicGain = ctx.createGain();
    // Громкость фоновой музыки. 0.06 — заметно тише эффектов, не мешает читать.
    // Если понадобится ещё тише — 0.04; громче — 0.10.
    musicGain.gain.value = 0.06;
    musicGain.connect(master);

    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.5;
    sfxGain.connect(master);
    return true;
  }

  // ---------- Одна нота ----------
  function note(freq, dur, when, type, gainNode, vol) {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type || "square";
    osc.frequency.setValueAtTime(freq, when);

    const v = vol === undefined ? 1 : vol;
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(v, when + 0.008);
    g.gain.setValueAtTime(v, when + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);

    osc.connect(g);
    g.connect(gainNode || sfxGain);
    osc.start(when);
    osc.stop(when + dur + 0.02);
  }

  // Скользящая нота
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
    if (!musicOn || !ctx) return;
    const t = ctx.currentTime + 0.05;
    const m = MELODY[musicStep % MELODY.length];
    const b = BASS[musicStep % BASS.length];
    if (m) note(m, STEP * 0.9, t, "square", musicGain, 0.42);
    if (b) note(b, STEP * 1.6, t, "triangle", musicGain, 0.6);
    if (musicStep % 4 === 0) click(t, 0.025);
    musicStep++;
  }

  function startMusic() {
    if (musicTimer || !musicOn) return;
    if (!ensureCtx()) return;
    musicStep = 0;
    musicTick();
    musicTimer = setInterval(musicTick, STEP * 1000);
  }
  function stopMusic() {
    if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
  }

  // Эффект можно играть только если звук уже «разбужен» жестом пользователя
  function sfxReady() {
    if (!ensureCtx()) return false;
    if (ctx.state === "suspended") ctx.resume();
    return true;
  }

  const api = {
    // ---- Фоновая мелодия ----
    isMusicOn() { return musicOn; },

    // Переключает только мелодию. Эффекты не затрагивает.
    toggleMusic() {
      musicOn = !musicOn;
      try { localStorage.setItem("detective_music", musicOn ? "on" : "off"); } catch (e) {}
      if (musicOn) {
        if (sfxReady()) startMusic();
      } else {
        stopMusic();
      }
      return musicOn;
    },

    // Вызывается по первому клику пользователя: разрешает звук в браузере
    // и запускает мелодию, если она включена.
    resume() {
      if (!ensureCtx()) return;
      if (ctx.state === "suspended") ctx.resume();
      if (musicOn) startMusic();
    },

    // ---- Эффекты: работают всегда ----

    // Улика засчитана — восходящая «монетка»
    coin() {
      if (!sfxReady()) return;
      const t = ctx.currentTime;
      note(N.B5, 0.08, t, "square", sfxGain, 0.9);
      note(N.E6, 0.34, t + 0.08, "square", sfxGain, 0.9);
    },

    // Открытие окна с материалом
    open() {
      if (!sfxReady()) return;
      const t = ctx.currentTime;
      note(N.E5, 0.06, t, "square", sfxGain, 0.6);
      note(N.A5, 0.10, t + 0.06, "square", sfxGain, 0.6);
    },

    // Закрытие окна
    close() {
      if (!sfxReady()) return;
      slide(N.A5, N.D5, 0.12, ctx.currentTime, "square", 0.4);
    },

    // Реплика персонажа
    blip() {
      if (!sfxReady()) return;
      note(N.G5, 0.05, ctx.currentTime, "square", sfxGain, 0.35);
    },

    // Шаг персонажа
    step() {
      if (!ctx) return;              // до первого жеста молчим
      click(ctx.currentTime, 0.07);
    },

    // Подошёл к точке интереса
    near() {
      if (!sfxReady()) return;
      const t = ctx.currentTime;
      note(N.C5, 0.05, t, "triangle", sfxGain, 0.4);
      note(N.G5, 0.07, t + 0.05, "triangle", sfxGain, 0.4);
    },

    // Финал — фанфары. Мелодию на время глушим, чтобы не мешала.
    fanfare() {
      if (!sfxReady()) return;
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
