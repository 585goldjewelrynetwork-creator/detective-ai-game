// ============================================================================
// «Детектив и нейросети» — обучающая игра для ИИ-курса 585 GOLD
// ----------------------------------------------------------------------------
// ГДЕ ПРАВИТЬ КОНТЕНТ:
//   POIS      — тексты, видео и ссылки шести находок (блоков курса)
//   BONUS     — бонусная точка (симулятор промптов)
//   NPCS      — реплики коллег
//   COURSE_LINKS — ссылки на полные уроки
// ============================================================================

const COURSE_LINKS = {
  block1: "https://new-acc-space-6754.ispring.ru/app/preview/eb3c9e2d-0343-11f1-afeb-3292ce742d0c",
  block2: "https://new-acc-space-6754.ispring.ru/app/preview/abb24110-0732-11f1-8c42-9a5c27d099db",
  block3: "https://new-acc-space-6754.ispring.ru/app/preview/faeb883a-0ca3-11f1-b4ff-c2aff0ebdc4f",
  block4: "https://new-acc-space-6754.ispring.ru/app/preview/659bcf99-1245-11f1-90a9-c2e14774ea64",
  block5: "https://new-acc-space-6754.ispring.ru/app/preview/77d45172-1947-11f1-a7d7-eef858ee11f2",
  block6: "https://new-acc-space-6754.ispring.ru/app/preview/7188dc1f-1e22-11f1-9ee9-5e011133f086",
};

// ============================================================================
// ГЕОМЕТРИЯ МИРА
// ============================================================================
const TILE = 32;
const COLS = 80;
const ROWS = 26;
const WORLD_W = COLS * TILE;   // 2560
const WORLD_H = ROWS * TILE;   // 832
const ZOOM = 2;                // пиксельный масштаб — тайл рисуется как 64px

// Дорога через всю карту
const ROAD_TOP = 12, ROAD_BOTTOM = 14;

// Границы зон по X (в тайлах)
const ZONES = [
  { key: "office", from: 0,  to: 13, name: "Офис 585 GOLD" },
  { key: "park",   from: 14, to: 28, name: "Городской парк" },
  { key: "square", from: 29, to: 43, name: "Площадь с фонтаном" },
  { key: "cafe",   from: 44, to: 57, name: "Кофейня «Пауза»" },
  { key: "garden", from: 58, to: 67, name: "Сад за кофейней" },
  { key: "vault",  from: 68, to: 79, name: "Хранилище" },
];
function zoneAt(col) {
  for (const z of ZONES) if (col >= z.from && col <= z.to) return z;
  return ZONES[ZONES.length - 1];
}

const px = (c) => c * TILE;
const py = (r) => r * TILE;

// Салон 585 GOLD (интерьер виден сверху)
const SALON = { c0: 2, c1: 12, r0: 2, r1: 10, doorC: [6, 7] };
// Настил кофейни
const DECK = { c0: 45, c1: 55, r0: 3, r1: 10 };
// Пруд в парке
const POND = { c0: 19, c1: 22, r0: 4, r1: 6 };
// Фонтан на площади (64×64 — два тайла)
const FOUNTAIN = { c: 35, r: 5 };

// ============================================================================
// КОНТЕНТ НАХОДОК
// ============================================================================
const POIS = [
  {
    id: "block1", col: 9.5, row: 17.4,
    zone: "Офис 585 GOLD",
    title: "Написание промптов: основа работы с ИИ",
    eyebrow: "Улика 1 · Основы основ",
    link: COURSE_LINKS.block1,
    body: `
      <p>Всё начинается с промпта — вашего запроса или инструкции для ИИ. Это не просто текст в строке ввода, а язык общения с мощным инструментом. Качественный промпт = качественный результат.</p>
      <p>Главное в работе с нейросетью — <b>контекст</b>. Представьте, что вы общаетесь со своим ассистентом, который многое умеет и готов помочь вам, однако не видит полной картины.</p>
      <h3>Что внутри полного урока</h3>
      <p>Как формулировать задачу, чтобы получить нужный результат с первого раза; какую роль и контекст задавать нейросети; как уточнять и переспрашивать, если ответ не подошёл.</p>
      <div class="modal-callout">💡 Хороший промпт отвечает на три вопроса: кто ты (роль), что нужно сделать (задача) и в каком виде выдать результат (формат).</div>
    `,
  },
  {
    id: "block2", col: 16.5, row: 4.4,
    zone: "Городской парк",
    title: "Возможности ИИ в работе с текстом",
    eyebrow: "Улика 2 · Текст",
    link: COURSE_LINKS.block2,
    body: `
      <p>С помощью ИИ можно составлять деловые письма, структурировать информацию, редактировать и улучшать тексты, писать отчёты быстрее. ИИ не напишет текст вместо вас, но станет идеальным черновиком. Для идеального результата загрузите в чат или проект примеры текста, который вам нравится по стилю и содержанию.</p>
      <h3>Короткий пример коллеги</h3>
      <p>Запись ниже — обзор одной из нейросетей для работы с текстом.</p>
      <video controls preload="none" style="width:100%;border-radius:10px;">
        <source src="assets/video-lesson2.mp4" type="video/mp4">
      </video>
    `,
  },
  {
    id: "block3", col: 40.5, row: 5.4,
    zone: "Площадь с фонтаном",
    title: "Анализ данных с помощью ИИ + визуализация",
    eyebrow: "Улика 3 · Аналитика",
    link: COURSE_LINKS.block3,
    body: `
      <p>Анализируйте данные быстрее, находите неочевидные закономерности, стройте прогнозы и тренды. Плюс — визуализация данных прямо через HTML-код: интерактивные графики в браузере, без Excel-эквилибристики.</p>
      <h3>Видео-фрагмент урока</h3>
      <video controls preload="none" style="width:100%;border-radius:10px;">
        <source src="assets/video-tables.mp4" type="video/mp4">
      </video>
    `,
  },
  {
    id: "block4", col: 51.5, row: 8.4,
    zone: "Кофейня «Пауза»",
    title: "Визуальный контент нового поколения. Часть 1",
    eyebrow: "Улика 4 · Презентации",
    link: COURSE_LINKS.block4,
    body: `
      <p>Хорошая картинка говорит громче тысячи слов, а качественная презентация усиливает любую идею в разы. В этом блоке — главные принципы работы с презентациями через ИИ (сервис Gamma).</p>
      <h3>Обзор сервиса Gamma</h3>
      <video controls preload="none" style="width:100%;border-radius:10px;">
        <source src="assets/video-gamma.mp4" type="video/mp4">
      </video>
      <div class="modal-callout">📄 Есть пошаговая письменная инструкция — <a href="assets/instruction-gamma.pdf" target="_blank" rel="noopener">открыть PDF</a>.</div>
    `,
  },
  {
    id: "block5", col: 8.5, row: 5.4,
    zone: "Салон 585 GOLD",
    title: "Визуальный контент нового поколения. Часть 2",
    eyebrow: "Улика 5 · Изображения и видео",
    link: COURSE_LINKS.block5,
    body: `
      <p>ИИ станет вашим личным художником, фоторедактором и режиссёром: создание изображений с нуля, редактирование готовых фото, короткие видео — без съёмочной группы и сложного монтажа.</p>
      <h3>Что внутри полного урока</h3>
      <p>Разбор нейросетей для картинок и видео, примеры для витрин и соцсетей, готовые сценарии для ювелирного контента.</p>
      <div class="modal-callout">🎨 Шпаргалка по стилям изображений — <a href="assets/cheatsheet-image-styles.pdf" target="_blank" rel="noopener">открыть PDF</a>. Пригодится, когда будете описывать нейросети желаемую картинку.</div>
    `,
  },
  {
    id: "block6", col: 74.5, row: 5.4,
    zone: "Хранилище",
    title: "Продвинутый промптинг",
    eyebrow: "Улика 6 · Мастерство",
    link: COURSE_LINKS.block6,
    body: `
      <p>Управляйте ИИ как профи: сложные цепочки запросов, управление контекстом, промптинг для многостраничных документов и комплексных исследований. От любителя — к мастеру.</p>
      <div class="modal-callout">🎯 Именно этот навык отличает того, кто «спрашивает у ИИ», от того, кто «работает с ИИ как с командой».</div>
    `,
  },
];

const BONUS = {
  id: "sim", col: 58.5, row: 12.8,          // прямо на главной дороге за кофейней
  zone: "Главная дорога у сада",
  title: "Симулятор диалога с ИИ",
  eyebrow: "Бонус · Тренажёр",
  body: `<p>Потренируйся вести диалог с ИИ прямо сейчас — тренажёр оценивает твои формулировки и начисляет баллы. Не входит в общий счёт улик, но полезен для практики.</p>`,
  openUrl: "assets/simulator/index.html",
};

// ---------- Коллеги ----------
const NPCS = [
  { name: "Марина", spriteIndex: 1, col: 6.5, row: 15.6, lines: [
    "Детектив, наконец-то! Мы все пробуем нейросети, но результаты — как повезёт.",
    "Обойди территорию: коллеги оставили записи о том, что уже попробовали сами.",
    "Собери шесть улик — и поймёшь, где та самая максимальная эффективность.",
  ]},
  { name: "Оля", spriteIndex: 4, col: 5.5, row: 6.6, lines: [
    "У нас в отделе ИИ рисует черновики визуалов для курсов. Составляет программы обучения, пишет посты для ленты новостей. И даже эту игру помогла собрать за час.",
    "Финальный вид доводим руками, но стартовая точка появляется за минуту.",
  ]},
  { name: "Дмитрий", spriteIndex: 0, col: 25.5, row: 5.6, lines: [
    "Раньше я писал «сделай красиво» и злился, что ИИ не понимает.",
    "Оказалось, дело было в промпте, а не в нейросети. Как говорит житейская мудрость, мусор на входе = мусор на выходе.",
  ]},
  { name: "Алексей", spriteIndex: 2, col: 32.5, row: 8.6, lines: [
    "Аналитический отчёт по продажам за декабрь я собрал за 20 минут вместо трёх часов.",
    "Записка рядом с фонтаном — там показан весь процесс.",
  ]},
  { name: "Светлана", spriteIndex: 3, col: 47.5, row: 6.6, lines: [
    "Обед — лучшее время потренироваться. Тут главное начать, не нужно бояться плохого результата. Регулярная практика творит чудеса.",
    "Я тут в перерыве собрала презентацию на десять слайдов. Загляни в записку у столика, тебе будет интересно.",
  ]},
  { name: "Игорь", spriteIndex: 5, col: 70.5, row: 16.6, lines: [
    "Дальше — хранилище. Там лежит то, что отличает новичка от профи.",
    "Продвинутый промптинг. Дочитаешь — и дело закрыто.",
  ]},
];

// ============================================================================
// ОБЪЕКТЫ КАРТЫ
// ============================================================================
// Прямоугольник коллизии внутри спрайта (или null — сквозь объект можно ходить)
const OBJ_SOLID = {
  obj_tree:        { x: 9,  y: 32, w: 14, h: 10 },
  obj_tree_autumn: { x: 9,  y: 32, w: 14, h: 10 },
  obj_tree_pine:   { x: 9,  y: 32, w: 14, h: 10 },
  obj_bush:        { x: 2,  y: 9,  w: 20, h: 9  },
  obj_bench:       { x: 1,  y: 3,  w: 30, h: 14 },
  obj_lamp:        { x: 5,  y: 38, w: 7,  h: 9  },
  obj_fence:       { x: 0,  y: 7,  w: 32, h: 9  },
  obj_planter:     { x: 2,  y: 10, w: 28, h: 17 },
  obj_trash:       { x: 2,  y: 8,  w: 16, h: 15 },
  obj_fountain:    { x: 4,  y: 20, w: 56, h: 42 },
  obj_showcase:    { x: 1,  y: 10, w: 30, h: 17 },
  obj_counter:     { x: 0,  y: 6,  w: 32, h: 19 },
  obj_ringstand:   { x: 4,  y: 18, w: 16, h: 8  },
  obj_cafetable:   { x: 8,  y: 36, w: 24, h: 13 },
  obj_chair:       { x: 2,  y: 8,  w: 14, h: 12 },
  obj_coffeecart:  { x: 4,  y: 16, w: 32, h: 26 },
  obj_board:       { x: 1,  y: 20, w: 24, h: 10 },
  obj_wall_window: { x: 0,  y: 0,  w: 32, h: 32 },
  obj_wall_plain:  { x: 0,  y: 0,  w: 32, h: 32 },
  obj_wall_door:   { x: 0,  y: 0,  w: 32, h: 32 },
  obj_wall_stone:  { x: 0,  y: 0,  w: 32, h: 32 },
  obj_wall_glass:  { x: 0,  y: 0,  w: 32, h: 32 },
  obj_gold:        null,
  obj_flower:      null,
  obj_flower2:     null,
  obj_flower3:     null,
  obj_roof:        null,
  obj_vaultdoor:   null,
  obj_sign585:     null,
  obj_cup:         null,
};

const OBJECTS = [];
const addObj = (key, col, row) => OBJECTS.push({ key, x: px(col), y: py(row) });

// Зоны, куда случайный декор не ставим
const noDecor = [];
const reserve = (c0, r0, c1, r1) => noDecor.push({ c0, r0, c1, r1 });

// Широкая чистая полоса вокруг дороги — гарантирует проходимость
reserve(0, ROAD_TOP - 2, COLS - 1, ROAD_BOTTOM + 2);
// Салон, фонтан, настил кофейни, пруд
reserve(SALON.c0 - 1, 0, SALON.c1 + 1, SALON.r1 + 1);
reserve(FOUNTAIN.c - 2, FOUNTAIN.r - 2, FOUNTAIN.c + 4, FOUNTAIN.r + 4);
reserve(DECK.c0 - 1, DECK.r0 - 1, DECK.c1 + 1, DECK.r1 + 1);
reserve(POND.c0 - 1, POND.r0 - 1, POND.c1 + 1, POND.r1 + 1);
// Вокруг находок, бонуса и коллег
[...POIS, BONUS].forEach((p) => reserve(Math.floor(p.col) - 2, Math.floor(p.row) - 2, Math.floor(p.col) + 2, Math.floor(p.row) + 2));
NPCS.forEach((n) => reserve(Math.floor(n.col) - 1, Math.floor(n.row) - 1, Math.floor(n.col) + 1, Math.floor(n.row) + 1));

function isReserved(c, r) {
  for (const z of noDecor) if (c >= z.c0 && c <= z.c1 && r >= z.r0 && r <= z.r1) return true;
  return false;
}

// ---------- Салон 585 GOLD ----------
function buildSalon() {
  for (let c = SALON.c0; c <= SALON.c1; c++) addObj("obj_wall_stone", c, SALON.r0);
  for (let r = SALON.r0 + 1; r <= SALON.r1; r++) {
    addObj("obj_wall_stone", SALON.c0, r);
    addObj("obj_wall_stone", SALON.c1, r);
  }
  for (let c = SALON.c0 + 1; c < SALON.c1; c++) {
    if (SALON.doorC.includes(c)) continue;          // проём входа
    addObj("obj_wall_glass", c, SALON.r1);
  }
  addObj("obj_sign585", 8.7, SALON.r1 - 0.85);
  // витрины вдоль верхней стены
  [3, 4, 6, 9, 10, 11].forEach((c) => addObj("obj_showcase", c, SALON.r0 + 1.2));
  addObj("obj_counter", 3.2, 7.2);
  addObj("obj_counter", 4.2, 7.2);
  addObj("obj_ringstand", 10.3, 7.4);
  addObj("obj_showcase", 11, 5.5);
  addObj("obj_planter", 3.2, 8.9);
  addObj("obj_planter", 11.1, 8.9);
}
buildSalon();

// ---------- Офисная площадь ----------
addObj("obj_lamp", 1.2, 10.3);
addObj("obj_lamp", 12.6, 10.3);
addObj("obj_bench", 4, 16.4);
addObj("obj_bench", 7, 16.4);
addObj("obj_planter", 1.3, 16.2);
addObj("obj_planter", 12, 16.2);
addObj("obj_trash", 11, 16.6);
addObj("obj_lamp", 2.2, 18.4);
addObj("obj_lamp", 11.6, 18.4);
addObj("obj_bench", 4, 21.4);
addObj("obj_bench", 8, 21.4);
addObj("obj_planter", 6.4, 20.2);

// ---------- Площадь с фонтаном ----------
addObj("obj_fountain", FOUNTAIN.c, FOUNTAIN.r);
[[33.2, 3.4], [37.4, 3.4], [33.2, 8.6], [37.4, 8.6]].forEach(([c, r]) => addObj("obj_bench", c, r));
[[31.3, 3.2], [39.3, 3.2], [31.3, 8.4], [39.3, 8.4], [35.2, 1.4]].forEach(([c, r]) => addObj("obj_planter", c, r));
[[30.2, 5.3], [41.6, 5.3], [30.2, 9.3], [41.6, 9.3]].forEach(([c, r]) => addObj("obj_lamp", c, r));
addObj("obj_trash", 38.4, 2.6);
addObj("obj_trash", 31.4, 9.6);
// площадь южнее дороги
[[31.2, 17.4], [35.2, 17.4], [39.2, 17.4], [33.2, 21.4], [37.2, 21.4]].forEach(([c, r]) => addObj("obj_bench", c, r));
[[29.3, 16.2], [42.3, 16.2], [35.3, 19.6], [31.3, 23.2], [40.3, 23.2]].forEach(([c, r]) => addObj("obj_planter", c, r));
[[30.2, 19.3], [41.6, 19.3], [35.6, 23.3]].forEach(([c, r]) => addObj("obj_lamp", c, r));

// ---------- Кофейня ----------
addObj("obj_coffeecart", 45.4, 3.3);
addObj("obj_board", 47.3, 4.4);
[[49.2, 4.1], [53.2, 4.1], [49.2, 7.6], [53.2, 7.6]].forEach(([c, r]) => {
  addObj("obj_cafetable", c, r);
  addObj("obj_chair", c - 0.55, r + 1.15);
  addObj("obj_chair", c + 1.2, r + 1.15);
  addObj("obj_cup", c + 0.42, r + 1.02);
});
[[45.2, 9.3], [55.1, 9.3], [55.1, 3.3]].forEach(([c, r]) => addObj("obj_planter", c, r));
addObj("obj_trash", 54.4, 5.6);
addObj("obj_lamp", 44.4, 6.3);
addObj("obj_lamp", 56.2, 6.3);
addObj("obj_fence", 45, 2.2);
addObj("obj_fence", 46, 2.2);
addObj("obj_fence", 54, 2.2);
addObj("obj_fence", 55, 2.2);

// ---------- Стенд с тренажёром у дороги ----------
addObj("obj_board", 58.2, 11.2);
addObj("obj_planter", 57.2, 11.1);
addObj("obj_planter", 59.6, 11.1);

// ---------- Сад ----------
for (let c = 58; c <= 61; c++) addObj("obj_fence", c, 3.2);
for (let c = 64; c <= 66; c++) addObj("obj_fence", c, 20.2);
addObj("obj_bench", 59.2, 5.4);
addObj("obj_bench", 64.2, 18.4);
addObj("obj_lamp", 62.2, 9.3);
addObj("obj_lamp", 60.2, 19.3);

// ---------- Хранилище ----------
// ряды сейфовых ячеек вдоль стен
for (let c = 69; c <= 78; c += 1) {
  if (c === 74 || c === 75) continue;          // проход к главной находке
  addObj("obj_showcase", c, 1.2);
  addObj("obj_showcase", c, 23.4);
}
addObj("obj_vaultdoor", 74.5, 4.3);
addObj("obj_vaultdoor", 68.4, 6.3);
addObj("obj_vaultdoor", 78.6, 6.3);
addObj("obj_vaultdoor", 68.4, 20.3);
addObj("obj_vaultdoor", 78.6, 20.3);
// золото и стойки с украшениями
[[70.2, 4.4], [77.2, 6.4], [72.3, 8.4], [76.4, 3.4], [69.4, 17.4],
 [76.4, 19.4], [72.4, 21.4], [70.6, 20.6], [74.3, 17.5], [78.1, 16.4]]
  .forEach(([c, r]) => addObj("obj_gold", c, r));
[[71.4, 6.5], [76.4, 8.5], [73.4, 3.5], [71.4, 18.5], [75.4, 21.5]]
  .forEach(([c, r]) => addObj("obj_ringstand", c, r));
[[69.2, 9.3], [73.2, 9.3], [77.2, 9.3], [70.2, 19.3], [75.2, 19.3],
 [68.6, 2.3], [78.2, 2.3], [72.2, 16.3], [77.4, 22.3]]
  .forEach(([c, r]) => addObj("obj_lamp", c, r));
[[70.4, 11.6], [76.4, 11.6], [73.4, 22.6]].forEach(([c, r]) => addObj("obj_trash", c, r));

// ---------- Центр салона: подиум с украшениями ----------
[[6.3, 5.4], [7.4, 5.4], [6.3, 6.6], [7.4, 6.6]].forEach(([c, r]) => addObj("obj_ringstand", c, r));
addObj("obj_showcase", 3, 5.5);

// ---------- Случайный природный декор ----------
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260729);

const DECOR_BY_ZONE = {
  park:   [["obj_tree", .30], ["obj_tree_pine", .14], ["obj_bush", .16], ["obj_flower", .18], ["obj_flower3", .10]],
  garden: [["obj_tree_autumn", .30], ["obj_tree", .14], ["obj_bush", .16], ["obj_flower2", .20], ["obj_flower", .10]],
  cafe:   [["obj_tree", .22], ["obj_bush", .22], ["obj_flower", .24], ["obj_flower2", .16]],
  square: [["obj_flower2", .5], ["obj_flower3", .5]],
  office: [["obj_flower", .5], ["obj_flower2", .5]],
  vault:  [],
};

function pickDecor(list) {
  let acc = 0;
  const roll = rng();
  for (const [key, w] of list) { acc += w; if (roll <= acc) return key; }
  return list.length ? list[0][0] : null;
}

for (let c = 0; c < COLS; c++) {
  const z = zoneAt(c);
  const list = DECOR_BY_ZONE[z.key] || [];
  if (!list.length) continue;
  const density = (z.key === "park" || z.key === "garden") ? 0.30
                : (z.key === "cafe") ? 0.22
                : 0.10;
  for (let r = 0; r < ROWS; r++) {
    if (isReserved(c, r)) continue;
    if (rng() > density) continue;
    const key = pickDecor(list);
    if (!key) continue;
    const jx = (rng() - 0.5) * 0.35;
    const jy = (rng() - 0.5) * 0.35;
    addObj(key, c + jx, r + jy);
  }
}

// ============================================================================
// ТАЙЛЫ
// ============================================================================
const inRect = (c, r, o) => c >= o.c0 && c <= o.c1 && r >= o.r0 && r <= o.r1;

function tileKeyAt(col, row) {
  if (row >= ROAD_TOP && row <= ROAD_BOTTOM) return col >= 68 ? "tile_vaultpath" : "tile_path";
  // интерьер салона
  if (col > SALON.c0 && col < SALON.c1 && row > SALON.r0 && row < SALON.r1) return "tile_marble";
  if (row === SALON.r1 && SALON.doorC.includes(col)) return "tile_marble";
  // настил кофейни
  if (inRect(col, row, DECK)) return "tile_deck";
  // пруд
  if (inRect(col, row, POND)) return "tile_water";
  const z = zoneAt(col);
  if (z.key === "office") return "tile_plaza";
  if (z.key === "square") return "tile_cobble";
  if (z.key === "vault")  return "tile_vault";
  if (z.key === "park")   return (col + row) % 7 === 0 ? "tile_grass2" : "tile_grass";
  if (z.key === "garden") return (col + row) % 6 === 0 ? "tile_grass2" : "tile_grass";
  return (col * row) % 9 === 0 ? "tile_grass2" : "tile_grass";
}

// ============================================================================
// АССЕТЫ
// ============================================================================
const IMAGE_KEYS = [
  "tile_grass","tile_grass2","tile_path","tile_plaza","tile_cobble","tile_marble",
  "tile_deck","tile_water","tile_vault","tile_vaultpath",
  "obj_tree","obj_tree_autumn","obj_tree_pine","obj_bush","obj_flower","obj_flower2","obj_flower3",
  "obj_bench","obj_lamp","obj_fence","obj_planter","obj_trash","obj_gold","obj_fountain",
  "obj_showcase","obj_counter","obj_ringstand","obj_sign585",
  "obj_cafetable","obj_chair","obj_coffeecart","obj_cup","obj_board",
  "obj_wall_window","obj_wall_plain","obj_wall_door","obj_wall_stone","obj_wall_glass",
  "obj_roof","obj_vaultdoor","player","npcs",
];
const IMAGES = {};
let loaded = 0;
function loadImages(cb) {
  IMAGE_KEYS.forEach((key) => {
    const img = new Image();
    const done = () => { if (++loaded === IMAGE_KEYS.length) cb(); };
    img.onload = done;
    img.onerror = done;
    img.src = "assets/" + key + ".png";
    IMAGES[key] = img;
  });
}

// ============================================================================
// СОСТОЯНИЕ
// ============================================================================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let viewW = 960, viewH = 540;   // размер видимой области в мировых пикселях

const player = {
  x: px(7), y: py(13.1), w: 32, h: 32,
  dir: "down", moving: false, animFrame: 0, animTimer: 0,
  speed: 165,
};

const solids = [];
function buildSolids() {
  OBJECTS.forEach((o) => {
    const s = OBJ_SOLID[o.key];
    if (s) solids.push({ x: o.x + s.x, y: o.y + s.y, w: s.w, h: s.h });
  });
  for (let c = POND.c0; c <= POND.c1; c++)
    for (let r = POND.r0; r <= POND.r1; r++)
      solids.push({ x: px(c), y: py(r), w: TILE, h: TILE });
}

const keys = {};
let gameState = "intro";       // intro | playing | paused
const camera = { x: 0, y: 0 };
const progressDone = new Set();
let finalShown = false;
let activeTarget = null;
let dialogQueue = null, dialogIndex = 0;
let currentZoneName = "";

// ============================================================================
// РАЗМЕР КАНВАСА / ПОЛНЫЙ ЭКРАН
// ============================================================================
function resizeCanvas() {
  const w = window.innerWidth, h = window.innerHeight;
  const dpr = 1; // пиксель-арт: рисуем 1:1, масштаб даёт ZOOM
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  viewW = canvas.width / ZOOM;
  viewH = canvas.height / ZOOM;
  ctx.imageSmoothingEnabled = false;
}
window.addEventListener("resize", resizeCanvas);

// ============================================================================
// ЗВУК
// ============================================================================
const soundBtn = document.getElementById("sound-btn");
function refreshSoundBtn() {
  const on = Sound.isEnabled();
  soundBtn.textContent = on ? "🔊 Звук вкл" : "🔇 Звук выкл";
  soundBtn.classList.toggle("hud-btn-accent", on);
}
function toggleSound() {
  Sound.toggle();
  refreshSoundBtn();
}
soundBtn.onclick = toggleSound;
refreshSoundBtn();

const fsBtn = document.getElementById("fullscreen-btn");
function toggleFullscreen() {
  const el = document.documentElement;
  if (!document.fullscreenElement) {
    (el.requestFullscreen || el.webkitRequestFullscreen || function () {}).call(el);
  } else {
    (document.exitFullscreen || document.webkitExitFullscreen || function () {}).call(document);
  }
}
fsBtn.onclick = toggleFullscreen;
document.addEventListener("fullscreenchange", () => {
  fsBtn.textContent = document.fullscreenElement ? "⛶ Обычный режим" : "⛶ Во весь экран";
  setTimeout(resizeCanvas, 60);
});

// ============================================================================
// ВВОД
// ============================================================================
const BLOCKED_KEYS = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "];
window.addEventListener("keydown", (e) => {
  if (BLOCKED_KEYS.includes(e.key)) e.preventDefault();
  keys[e.key] = true;

  if (e.key === " ") handleInteract();
  if (e.key === "Escape") closeTopLayer();
  if (e.key === "b" || e.key === "B" || e.key === "и" || e.key === "И") toggleNotebook();
  if (e.key === "f" || e.key === "F" || e.key === "а" || e.key === "А") toggleFullscreen();
  if (e.key === "m" || e.key === "M" || e.key === "ь" || e.key === "Ь") toggleSound();
}, { passive: false });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

function anyModalOpen() {
  return !document.getElementById("find-modal").classList.contains("hidden")
      || !document.getElementById("final-modal").classList.contains("hidden")
      || !document.getElementById("intro-modal").classList.contains("hidden");
}

function handleInteract() {
  if (gameState === "intro" || anyModalOpen()) return;
  const dialogBox = document.getElementById("dialog-box");
  if (!dialogBox.classList.contains("hidden")) { advanceDialog(); return; }
  if (!activeTarget) return;
  if (activeTarget.kind === "npc") startDialog(activeTarget.data);
  else if (activeTarget.kind === "poi") openFind(activeTarget.data);
  else if (activeTarget.kind === "bonus") openBonus(activeTarget.data);
}

function closeTopLayer() {
  const nb = document.getElementById("notebook-panel");
  if (!nb.classList.contains("hidden")) { closeNotebook(); return; }
  const fm = document.getElementById("find-modal");
  if (!fm.classList.contains("hidden")) { closeFind(); return; }
  const db = document.getElementById("dialog-box");
  if (!db.classList.contains("hidden")) { closeDialog(); return; }
}

// ---------- Диалоги ----------
function startDialog(npc) {
  dialogQueue = npc.lines; dialogIndex = 0;
  document.getElementById("dialog-name").textContent = npc.name.toUpperCase();
  document.getElementById("dialog-text").textContent = dialogQueue[0];
  document.getElementById("dialog-box").classList.remove("hidden");
  Sound.blip();
  gameState = "paused";
}
function advanceDialog() {
  if (!dialogQueue) return;
  if (++dialogIndex >= dialogQueue.length) { closeDialog(); return; }
  document.getElementById("dialog-text").textContent = dialogQueue[dialogIndex];
  Sound.blip();
}
function closeDialog() {
  document.getElementById("dialog-box").classList.add("hidden");
  dialogQueue = null;
  gameState = "playing";
}

// ---------- Находки ----------
function openFind(poi) {
  document.getElementById("find-eyebrow").textContent = poi.eyebrow;
  document.getElementById("find-title").textContent = poi.title;
  document.getElementById("find-sub").textContent =
    (progressDone.has(poi.id) ? "Уже изучено · " : "Новая улика · ") + poi.zone;
  document.getElementById("find-body").innerHTML = poi.body;
  document.getElementById("find-body").scrollTop = 0;

  const linkEl = document.getElementById("find-link");
  linkEl.textContent = "Открыть полный урок ↗";
  if (poi.link) { linkEl.href = poi.link; linkEl.classList.remove("hidden"); }
  else linkEl.classList.add("hidden");

  // подсказка «улика засчитается» нужна только для ещё не собранных улик
  const countNote = document.getElementById("find-count-note");
  if (progressDone.has(poi.id)) countNote.classList.add("hidden");
  else countNote.classList.remove("hidden");

  document.getElementById("find-ok").textContent = "Понятно, иду дальше";
  document.getElementById("find-ok").onclick = () => {
    const isNew = !progressDone.has(poi.id);
    closeFind();
    if (isNew) {
      progressDone.add(poi.id);
      updateProgress();
      Sound.coin();          // улика засчитана
      maybeShowFinal();
    }
  };
  closeNotebook();
  document.getElementById("find-modal").classList.remove("hidden");
  Sound.open();
  gameState = "paused";
}

function openBonus(bonus) {
  document.getElementById("find-eyebrow").textContent = bonus.eyebrow;
  document.getElementById("find-title").textContent = bonus.title;
  document.getElementById("find-sub").textContent = "Дополнительно · " + bonus.zone;
  document.getElementById("find-body").innerHTML = bonus.body;
  const linkEl = document.getElementById("find-link");
  linkEl.href = bonus.openUrl;
  linkEl.textContent = "Открыть симулятор ↗";
  linkEl.classList.remove("hidden");
  document.getElementById("find-count-note").classList.add("hidden");  // бонус не в счёте
  document.getElementById("find-ok").textContent = "Закрыть";
  document.getElementById("find-ok").onclick = closeFind;
  closeNotebook();
  document.getElementById("find-modal").classList.remove("hidden");
  Sound.open();
  gameState = "paused";
}

function closeFind() {
  document.getElementById("find-modal").classList.add("hidden");
  document.getElementById("find-body").innerHTML = "";  // останавливает видео
  Sound.close();
  gameState = "playing";
}
document.getElementById("find-close").onclick = closeFind;

function updateProgress() {
  const total = POIS.length;
  document.getElementById("notebook-count").textContent = progressDone.size + "/" + total;
  document.getElementById("nb-progress-text").textContent =
    progressDone.size + " из " + total + " находок";
  document.getElementById("nb-bar-fill").style.width = (progressDone.size / total * 100) + "%";
  renderNotebook();
}

function maybeShowFinal() {
  if (finalShown || progressDone.size < POIS.length) return;
  finalShown = true;
  setTimeout(() => {
    document.getElementById("final-modal").classList.remove("hidden");
    Sound.fanfare();
    gameState = "paused";
  }, 400);
}

// ============================================================================
// БЛОКНОТ УЛИК
// ============================================================================
const nbPanel = document.getElementById("notebook-panel");

function renderNotebook() {
  const list = document.getElementById("nb-list");
  list.innerHTML = "";
  POIS.forEach((poi, i) => {
    const done = progressDone.has(poi.id);
    const btn = document.createElement("button");
    btn.className = "nb-item" + (done ? " done" : " locked");
    btn.innerHTML =
      '<span class="nb-mark">' + (done ? "✓" : (i + 1)) + "</span>" +
      '<span><span class="nb-item-title">' + (done ? poi.title : "Улика не найдена") + "</span>" +
      '<span class="nb-item-meta">' + (done ? poi.zone : "Ищи здесь: " + poi.zone) + "</span></span>";
    if (done) btn.onclick = () => openFind(poi);
    list.appendChild(btn);
  });
  // бонус
  const b = document.createElement("button");
  b.className = "nb-item bonus";
  b.innerHTML =
    '<span class="nb-mark">★</span>' +
    '<span><span class="nb-item-title">' + BONUS.title + "</span>" +
    '<span class="nb-item-meta">Бонус · ' + BONUS.zone + "</span></span>";
  b.onclick = () => openBonus(BONUS);
  list.appendChild(b);
}

function openNotebook() {
  renderNotebook();
  nbPanel.classList.remove("hidden");
  gameState = "paused";
}
function closeNotebook() {
  nbPanel.classList.add("hidden");
  if (!anyModalOpen() && document.getElementById("dialog-box").classList.contains("hidden")) {
    gameState = "playing";
  }
}
function toggleNotebook() {
  if (gameState === "intro" || anyModalOpen()) return;
  nbPanel.classList.contains("hidden") ? openNotebook() : closeNotebook();
}
document.getElementById("notebook-btn").onclick = toggleNotebook;
document.getElementById("notebook-close").onclick = closeNotebook;

// ---------- Вступление ----------
document.getElementById("intro-start").onclick = () => {
  document.getElementById("intro-modal").classList.add("hidden");
  Sound.resumeIfEnabled();   // клик — это жест пользователя, музыку можно запускать
  refreshSoundBtn();
  gameState = "playing";
};

// ============================================================================
// ФИЗИКА
// ============================================================================
const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
const feet = (x, y) => ({ x: x + 8, y: y + 22, w: 16, h: 9 });

function canMoveTo(x, y) {
  if (x < 0 || y < 0 || x + player.w > WORLD_W || y + player.h > WORLD_H) return false;
  const box = feet(x, y);
  for (const s of solids) if (overlap(box, s)) return false;
  return true;
}

function update(dt) {
  if (gameState !== "playing") { player.moving = false; return; }

  let dx = 0, dy = 0;
  if (keys.ArrowLeft  || keys.a || keys.A || keys.ф || keys.Ф) dx -= 1;
  if (keys.ArrowRight || keys.d || keys.D || keys.в || keys.В) dx += 1;
  if (keys.ArrowUp    || keys.w || keys.W || keys.ц || keys.Ц) dy -= 1;
  if (keys.ArrowDown  || keys.s || keys.S || keys.ы || keys.Ы) dy += 1;

  player.moving = dx !== 0 || dy !== 0;
  if (dx && dy) { dx *= 0.7071; dy *= 0.7071; }
  if (dx) player.dir = dx > 0 ? "right" : "left";
  else if (dy) player.dir = dy > 0 ? "down" : "up";

  const mx = dx * player.speed * dt, my = dy * player.speed * dt;
  if (mx && canMoveTo(player.x + mx, player.y)) player.x += mx;
  if (my && canMoveTo(player.x, player.y + my)) player.y += my;

  if (player.moving) {
    player.animTimer += dt;
    if (player.animTimer > 0.17) {
      player.animTimer = 0;
      player.animFrame = 1 - player.animFrame;
      Sound.step();          // шаг совпадает со сменой кадра
    }
  } else player.animFrame = 0;

  camera.x = Math.max(0, Math.min(player.x + player.w / 2 - viewW / 2, Math.max(0, WORLD_W - viewW)));
  camera.y = Math.max(0, Math.min(player.y + player.h / 2 - viewH / 2, Math.max(0, WORLD_H - viewH)));

  updateZoneLabel();
  findActiveTarget();
}

function updateZoneLabel() {
  const col = Math.floor((player.x + 16) / TILE);
  const row = Math.floor((player.y + 16) / TILE);
  let name;
  if (col > SALON.c0 && col < SALON.c1 && row >= SALON.r0 && row <= SALON.r1) name = "Салон 585 GOLD";
  else if (inRect(col, row, DECK)) name = "Кофейня «Пауза»";
  else name = zoneAt(col).name;
  if (name !== currentZoneName) {
    currentZoneName = name;
    document.getElementById("zone-label").textContent = name;
  }
}

const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

function findActiveTarget() {
  const pcx = player.x + player.w / 2, pcy = player.y + player.h / 2;
  let best = null, bestD = 44;

  NPCS.forEach((npc) => {
    const d = dist(pcx, pcy, px(npc.col) + 16, py(npc.row) + 16);
    if (d < bestD) { bestD = d; best = { kind: "npc", data: npc }; }
  });
  POIS.forEach((poi) => {
    const d = dist(pcx, pcy, px(poi.col), py(poi.row));
    if (d < bestD) { bestD = d; best = { kind: "poi", data: poi }; }
  });
  const bd = dist(pcx, pcy, px(BONUS.col), py(BONUS.row));
  if (bd < bestD) { bestD = bd; best = { kind: "bonus", data: BONUS }; }

  // звук при подходе к новой точке (один раз, а не каждый кадр)
  const prevId = activeTarget ? (activeTarget.data.id || activeTarget.data.name) : null;
  const newId = best ? (best.data.id || best.data.name) : null;
  if (newId && newId !== prevId && gameState === "playing") Sound.near();

  activeTarget = best;
  const hint = document.getElementById("hint");
  if (best && gameState === "playing") {
    hint.classList.remove("hidden");
    hint.textContent = best.kind === "npc" ? "Пробел — поговорить" : "Пробел — открыть материал";
  } else hint.classList.add("hidden");
}

// ============================================================================
// РЕНДЕР
// ============================================================================
function drawTiles() {
  const c0 = Math.max(0, Math.floor(camera.x / TILE) - 1);
  const c1 = Math.min(COLS - 1, Math.ceil((camera.x + viewW) / TILE) + 1);
  const r0 = Math.max(0, Math.floor(camera.y / TILE) - 1);
  const r1 = Math.min(ROWS - 1, Math.ceil((camera.y + viewH) / TILE) + 1);
  for (let c = c0; c <= c1; c++)
    for (let r = r0; r <= r1; r++) {
      const img = IMAGES[tileKeyAt(c, r)];
      if (img) ctx.drawImage(img, Math.round(px(c) - camera.x), Math.round(py(r) - camera.y), TILE, TILE);
    }
}

function drawMarker(wx, wy, done, isBonus, t) {
  const bob = Math.sin(t / 320) * 3;
  const cx = Math.round(wx - camera.x), cy = Math.round(wy - camera.y - 32 + bob);
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, 11, 0, Math.PI * 2);
  ctx.fillStyle = done ? "#3fb96a" : "#f0b429";   // бонус тоже жёлтый, но со звёздочкой
  ctx.fill();
  ctx.lineWidth = 2; ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 14px Arial";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(done ? "✓" : (isBonus ? "★" : "!"), cx, cy + 1);
  ctx.restore();
}

function drawNpc(npc) {
  const x = px(npc.col), y = py(npc.row);
  ctx.drawImage(IMAGES.npcs, npc.spriteIndex * 32, 0, 32, 32,
                Math.round(x - camera.x), Math.round(y - camera.y), 32, 32);
  const lx = Math.round(x - camera.x + 16), ly = Math.round(y - camera.y - 5);
  ctx.font = "bold 10px Manrope, Arial";
  ctx.textAlign = "center";
  const w = ctx.measureText(npc.name).width + 8;
  ctx.fillStyle = "rgba(10,12,15,0.6)";
  ctx.fillRect(lx - w / 2, ly - 11, w, 14);
  ctx.fillStyle = "#fff";
  ctx.fillText(npc.name, lx, ly);
}

function drawPlayer() {
  const dIdx = ["down","up","left","right"].indexOf(player.dir);
  const frame = dIdx * 2 + player.animFrame;
  ctx.drawImage(IMAGES.player, frame * 32, 0, 32, 32,
                Math.round(player.x - camera.x), Math.round(player.y - camera.y), 32, 32);
}

let pulse = 0;
function render(dt) {
  pulse += dt * 1000;
  ctx.setTransform(ZOOM, 0, 0, ZOOM, 0, 0);
  ctx.clearRect(0, 0, viewW, viewH);
  ctx.imageSmoothingEnabled = false;

  drawTiles();

  const xMin = camera.x - 96, xMax = camera.x + viewW + 96;
  const yMin = camera.y - 96, yMax = camera.y + viewH + 96;

  const drawables = [];
  OBJECTS.forEach((o) => {
    if (o.x < xMin || o.x > xMax || o.y < yMin || o.y > yMax) return;
    const img = IMAGES[o.key];
    drawables.push({ img, x: o.x, y: o.y, sortY: o.y + (img ? img.height : 32) });
  });
  NPCS.forEach((npc) => {
    const x = px(npc.col), y = py(npc.row);
    if (x < xMin || x > xMax || y < yMin || y > yMax) return;
    drawables.push({ npc, sortY: y + 32 });
  });
  drawables.push({ self: true, sortY: player.y + player.h });
  drawables.sort((a, b) => a.sortY - b.sortY);

  drawables.forEach((d) => {
    if (d.self) drawPlayer();
    else if (d.npc) drawNpc(d.npc);
    else if (d.img) ctx.drawImage(d.img, Math.round(d.x - camera.x), Math.round(d.y - camera.y));
  });

  POIS.forEach((poi) => drawMarker(px(poi.col), py(poi.row), progressDone.has(poi.id), false, pulse));
  drawMarker(px(BONUS.col), py(BONUS.row), false, true, pulse);
}

// ============================================================================
// ЦИКЛ
// ============================================================================
let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  update(dt);
  render(dt);
  requestAnimationFrame(loop);
}

// ============================================================================
// СТАРТ
// ============================================================================
buildSolids();
resizeCanvas();
updateProgress();
loadImages(() => requestAnimationFrame(loop));
