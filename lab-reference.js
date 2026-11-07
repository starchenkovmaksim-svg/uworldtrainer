(() => {
  const groups = [
  [
    "Кровь",
    [
      [
        "Гемоглобин · Hb",
        "М: 135–175; Ж: 120–160 г/л",
        "hemoglobin"
      ],
      [
        "Гематокрит · Hct",
        "М: 41–53%; Ж: 36–46%",
        "hematocrit"
      ],
      [
        "Лейкоциты · WBC",
        "4,5–11 × 10⁹/л",
        "leukocytes"
      ],
      [
        "Тромбоциты · PLT",
        "150–400 × 10⁹/л",
        "platelets"
      ],
      [
        "MCV",
        "80–100 фл",
        "объем эритроцитов"
      ],
      [
        "Ретикулоциты",
        "0,5–1,5%",
        "reticulocytes"
      ],
      [
        "Протромбиновое время · PT",
        "11–15 с",
        "coagulation"
      ],
      [
        "АЧТВ · aPTT",
        "25–40 с",
        "ptt coagulation"
      ],
      [
        "Эритроциты · RBC",
        "М: 4,3–5,9; Ж: 3,5–5,5 × 10¹²/л",
        "red blood cells"
      ],
      [
        "MCH",
        "25–35 пг/клетку",
        "гемоглобин эритроцит"
      ],
      [
        "MCHC",
        "31–36 г/дл",
        "концентрация гемоглобина"
      ],
      [
        "Нейтрофилы сегментоядерные",
        "54–62%",
        "neutrophils segmented"
      ],
      [
        "Нейтрофилы палочкоядерные",
        "3–5%",
        "neutrophils bands"
      ],
      [
        "Лимфоциты",
        "25–33%",
        "lymphocytes"
      ],
      [
        "Моноциты",
        "3–7%",
        "monocytes"
      ],
      [
        "Эозинофилы",
        "1–3%",
        "eosinophils"
      ],
      [
        "Базофилы",
        "0–0,75%",
        "basophils"
      ],
      [
        "D-димер",
        "≤250 ng/mL; зависит от метода и единиц лаборатории",
        "d-dimer"
      ],
      [
        "СОЭ · Westergren",
        "М: 0–15; Ж: 0–20 мм/ч",
        "esr sedimentation"
      ],
      [
        "CD4⁺ T-лимфоциты",
        "≥500 клеток/мкл",
        "cd4 lymphocyte"
      ],
      [
        "HbA1c · таблица USMLE",
        "≤6%; это справочный диапазон таблицы, не диагностический порог диабета",
        "гликированный гемоглобин a1c"
      ],
      [
        "Объём плазмы",
        "М: 25–43; Ж: 28–45 мл/кг",
        "plasma volume"
      ],
      [
        "Объём эритроцитов",
        "М: 20–36; Ж: 19–31 мл/кг",
        "red cell volume"
      ]
    ]
  ],
  [
    "Биохимия",
    [
      [
        "Натрий · Na⁺",
        "136–146 ммоль/л",
        "sodium"
      ],
      [
        "Калий · K⁺",
        "3,5–5,0 ммоль/л",
        "potassium"
      ],
      [
        "Хлор · Cl⁻",
        "95–105 ммоль/л",
        "chloride"
      ],
      [
        "Бикарбонат · HCO₃⁻",
        "22–28 ммоль/л",
        "hco3 bicarbonate"
      ],
      [
        "Кальций общий · Ca",
        "8,4–10,2 mg/dL",
        "calcium"
      ],
      [
        "Креатинин",
        "0,6–1,2 mg/dL",
        "creatinine"
      ],
      [
        "Азот мочевины · BUN",
        "7–18 mg/dL",
        "urea nitrogen"
      ],
      [
        "Глюкоза натощак",
        "70–100 mg/dL",
        "glucose fasting"
      ],
      [
        "Осмоляльность сыворотки",
        "275–295 мОсм/кг",
        "osmolality"
      ],
      [
        "АЛТ · ALT",
        "10–40 Ед/л",
        "alanine"
      ],
      [
        "АСТ · AST",
        "12–38 Ед/л",
        "aspartate"
      ],
      [
        "Щелочная фосфатаза · ALP",
        "25–100 Ед/л",
        "alkaline phosphatase"
      ],
      [
        "Билирубин общий",
        "0,1–1,0 mg/dL",
        "bilirubin total"
      ],
      [
        "Билирубин прямой",
        "0–0,3 mg/dL",
        "bilirubin direct"
      ],
      [
        "Альбумин",
        "35–55 г/л",
        "albumin"
      ],
      [
        "Магний · Mg²⁺",
        "0,75–1,0 ммоль/л (SI в таблице USMLE)",
        "magnesium"
      ],
      [
        "Фосфор неорганический",
        "3,0–4,5 mg/dL",
        "phosphorus phosphate"
      ],
      [
        "Глюкоза не натощак",
        "<140 mg/dL",
        "glucose random"
      ],
      [
        "Общий белок",
        "60–78 г/л",
        "total protein"
      ],
      [
        "Глобулины",
        "23–35 г/л",
        "globulins"
      ],
      [
        "Амилаза",
        "25–125 Ед/л",
        "amylase"
      ],
      [
        "Липаза",
        "13–60 Ед/л",
        "lipase"
      ],
      [
        "Клиренс креатинина",
        "М: 97–137; Ж: 88–128 мл/мин",
        "creatinine clearance"
      ],
      [
        "Креатинкиназа · CK",
        "М: 25–90; Ж: 10–70 Ед/л",
        "creatine kinase кфк"
      ],
      [
        "ЛДГ · LDH",
        "45–200 Ед/л",
        "lactate dehydrogenase"
      ],
      [
        "Тропонин I",
        "≤0,04 ng/mL; для высокочувствительного теста используйте референс лаборатории",
        "troponin"
      ],
      [
        "Мочевая кислота",
        "3,0–8,2 mg/dL",
        "uric acid"
      ]
    ]
  ],
  [
    "Гормоны",
    [
      [
        "ТТГ · TSH",
        "0,4–4,0 мМЕ/л",
        "thyroid"
      ],
      [
        "Свободный T4",
        "0,9–1,7 ng/dL",
        "free ft4 thyroxine"
      ],
      [
        "Паратгормон · PTH",
        "10–60 pg/mL",
        "parathyroid"
      ],
      [
        "Кортизол · 08:00",
        "5–23 μg/dL",
        "cortisol"
      ],
      [
        "ФСГ · FSH",
        "М: 4–25; Ж до менопаузы: 4–30; пик цикла: 10–90; после менопаузы: 40–250 мМЕ/мл",
        "follicle stimulating"
      ],
      [
        "ЛГ · LH",
        "М: 6–23; Ж, фолликулярная фаза: 5–30; пик цикла: 75–150; после менопаузы: 30–200 мМЕ/мл",
        "luteinizing"
      ],
      [
        "Гормон роста · GH",
        "Натощак: <5 ng/mL; после стимуляции аргинином: >7 ng/mL",
        "growth hormone соматотропин"
      ],
      [
        "Пролактин",
        "М: <17; Ж: <25 ng/mL",
        "prolactin"
      ],
      [
        "Кортизол · 16:00",
        "3–15 μg/dL",
        "cortisol"
      ],
      [
        "Кортизол · 20:00",
        "<50% значения в 08:00",
        "cortisol"
      ],
      [
        "T3 общий · RIA",
        "100–200 ng/dL",
        "triiodothyronine трийодтиронин"
      ],
      [
        "Захват T3 смолой",
        "25–35%",
        "t3 resin uptake"
      ],
      [
        "T4 общий",
        "5–12 μg/dL",
        "thyroxine тироксин"
      ],
      [
        "Захват ¹²³I щитовидной железой",
        "8–30% введённой дозы за 24 ч",
        "iodine uptake"
      ],
      [
        "17-гидроксикортикостероиды, моча",
        "М: 3–10; Ж: 2–8 мг/сут",
        "hydroxycorticosteroids"
      ],
      [
        "17-кетостероиды, моча",
        "М: 8–20; Ж: 6–15 мг/сут",
        "ketosteroids"
      ]
    ]
  ],
  [
    "Газы крови",
    [
      [
        "pH",
        "7,35–7,45",
        "кислотность"
      ],
      [
        "PaCO₂",
        "33–45 мм рт. ст.",
        "paco2 pco2 углекислый"
      ],
      [
        "PaO₂",
        "75–105 мм рт. ст.",
        "pao2 po2 кислород"
      ]
    ]
  ],
  [
    "Железо",
    [
      [
        "Ферритин",
        "М: 20–250; Ж: 10–120 ng/mL",
        "ferritin"
      ],
      [
        "Железо сыворотки",
        "М: 65–175; Ж: 50–170 μg/dL",
        "iron"
      ],
      [
        "ОЖСС · TIBC",
        "250–400 μg/dL",
        "total iron binding capacity"
      ],
      [
        "Трансферрин",
        "200–360 mg/dL",
        "transferrin"
      ]
    ]
  ],
  [
    "Липиды",
    [
      [
        "Холестерин общий",
        "<200 mg/dL; высокий: >240 mg/dL",
        "cholesterol total"
      ],
      [
        "ЛПВП · HDL",
        "40–60 mg/dL",
        "cholesterol"
      ],
      [
        "ЛПНП · LDL · таблица USMLE",
        "<160 mg/dL; не целевой уровень лечения",
        "cholesterol"
      ],
      [
        "Триглицериды",
        "<150 mg/dL; пограничные по таблице: 151–199 mg/dL",
        "triglycerides"
      ]
    ]
  ],
  [
    "Иммуноглобулины",
    [
      [
        "IgA",
        "76–390 mg/dL",
        "иммуноглобулин"
      ],
      [
        "IgE",
        "0–380 МЕ/мл",
        "иммуноглобулин"
      ],
      [
        "IgG",
        "650–1500 mg/dL",
        "иммуноглобулин"
      ],
      [
        "IgM",
        "50–300 mg/dL",
        "иммуноглобулин"
      ]
    ]
  ],
  [
    "Ликвор",
    [
      [
        "Клетки ликвора",
        "0–5 клеток/мкл",
        "csf cell count"
      ],
      [
        "Хлор ликвора",
        "118–132 ммоль/л",
        "csf chloride"
      ],
      [
        "Гамма-глобулин ликвора",
        "3–12% общего белка",
        "csf gamma globulin"
      ],
      [
        "Глюкоза ликвора",
        "40–70 mg/dL",
        "csf glucose"
      ],
      [
        "Давление ликвора",
        "70–180 мм вод. ст.",
        "csf pressure"
      ],
      [
        "Белок ликвора",
        "<40 mg/dL",
        "csf protein"
      ]
    ]
  ],
  [
    "Моча",
    [
      [
        "Кальций мочи",
        "100–300 мг/сут",
        "urine calcium"
      ],
      [
        "Осмоляльность мочи",
        "50–1200 мОсм/кг",
        "urine osmolality"
      ],
      [
        "Оксалат мочи",
        "8–40 μg/mL",
        "urine oxalate"
      ],
      [
        "Белок мочи",
        "<150 мг/сут",
        "urine protein"
      ]
    ]
  ],
  [
    "Дополнительно",
    [
      [
        "ИМТ · BMI · таблица USMLE",
        "19–25 кг/м²; справочный интервал этой таблицы",
        "body mass index индекс массы тела"
      ]
    ]
  ]
];
  const dialog = document.createElement('dialog');
  dialog.className = 'lab-dialog';
  dialog.setAttribute('aria-labelledby', 'lab-title');
  dialog.innerHTML = `<header class="lab-header"><div><span class="lab-eyebrow">СПРАВОЧНИК · STEP 1</span><h2 id="lab-title">Нормы анализов</h2></div><button type="button" class="btn outline" data-lab-close aria-label="Закрыть памятку">Закрыть</button></header><div class="lab-filters"><label for="lab-search">Найти показатель</label><input id="lab-search" type="search" placeholder="Например, калий, Hb или TSH" autocomplete="off"><div class="lab-tabs" role="group" aria-label="Раздел анализов"></div><p class="lab-count" role="status" aria-live="polite"></p></div><div class="lab-body"><div class="lab-results"></div><p class="lab-note">Полная подборка показателей USMLE Laboratory Values (редакция апреля 2026). М — мужчины, Ж — женщины. Референсы для взрослых. Если в условии указан свой диапазон, используйте его. Для детей и при беременности нормы могут отличаться. Референсы зависят от метода; справочный диапазон не всегда совпадает с диагностическим порогом или целью лечения. Газы — артериальная кровь при дыхании комнатным воздухом.</p><p class="lab-note">В зачёте и экзамене таймер продолжает идти.</p><a class="lab-source" href="https://www.usmle.org/sites/default/files/2021-10/Step_1_Sample_Items.pdf#page=8" target="_blank" rel="noopener noreferrer">Источник: USMLE Laboratory Values, стр. 7–9 ↗</a></div>`;
  document.body.append(dialog);
  const search = dialog.querySelector('input'), results = dialog.querySelector('.lab-results');
  let category = 'Все', origin;
  const normalize = text => text.toLowerCase().replaceAll('ё', 'е').trim();
  const tabs = dialog.querySelector('.lab-tabs');
  for (const name of ['Все', ...groups.map(g => g[0])]) {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = name;
    button.onclick = () => { category = name; render(); };
    tabs.append(button);
  }
  function render() {
    const query = normalize(search.value); let count = 0;
    results.replaceChildren();
    for (const button of tabs.children) button.setAttribute('aria-pressed', String(button.textContent === category));
    for (const [name, rows] of groups) {
      if (category !== 'Все' && name !== category) continue;
      const matches = rows.filter(row => normalize(row.join(' ')).includes(query));
      if (!matches.length) continue;
      const section = document.createElement('section'), heading = document.createElement('h3'), list = document.createElement('dl');
      heading.textContent = name; section.append(heading, list);
      for (const [label, value] of matches) {
        const row = document.createElement('div'), term = document.createElement('dt'), definition = document.createElement('dd');
        term.textContent = label; definition.textContent = value;
        row.append(term, definition); list.append(row); count++;
      }
      results.append(section);
    }
    dialog.querySelector('.lab-count').textContent = count ? `Показателей: ${count}` : 'Ничего не найдено. Попробуйте другое название или раздел «Все».';
  }
  search.addEventListener('input', render);
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-lab-open]'); if (!button) return;
    origin = button; render(); dialog.showModal();
    dialog.querySelector('[data-lab-close]').focus();
  });
  dialog.querySelector('[data-lab-close]').onclick = () => dialog.close();
  dialog.addEventListener('close', () => { if (origin?.isConnected) origin.focus({preventScroll:true}); });
  // Keep question shortcuts from changing an answer while the reference is open.
  document.addEventListener('keydown', event => { if (dialog.open) event.stopImmediatePropagation(); }, true);
})();
