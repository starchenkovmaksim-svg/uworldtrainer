(() => {
  const groups = [
  [
    "Кровь",
    [
      [
        "Гемоглобин · Hb",
        "М: 13,5–17,5; Ж: 12–16 g/dL",
        "hemoglobin",
        "М: 135–175; Ж: 120–160 г/л"
      ],
      [
        "Гематокрит · Hct",
        "М: 41–53%; Ж: 36–46%",
        "hematocrit",
        "М: 41–53%; Ж: 36–46%"
      ],
      [
        "Лейкоциты · WBC",
        "4500–11000/мкл",
        "leukocytes",
        "4,5–11 × 10⁹/л"
      ],
      [
        "Тромбоциты · PLT",
        "150000–400000/мкл",
        "platelets",
        "150–400 × 10⁹/л"
      ],
      [
        "MCV",
        "80–100 фл",
        "объем эритроцитов",
        "80–100 фл"
      ],
      [
        "Ретикулоциты",
        "0,5–1,5%",
        "reticulocytes",
        "0,5–1,5%"
      ],
      [
        "Протромбиновое время · PT",
        "11–15 с",
        "coagulation",
        "11–15 с"
      ],
      [
        "АЧТВ · aPTT",
        "25–40 с",
        "ptt coagulation",
        "25–40 с"
      ],
      [
        "Эритроциты · RBC",
        "М: 4,3–5,9; Ж: 3,5–5,5 × 10¹²/л",
        "red blood cells",
        "М: 4,3–5,9; Ж: 3,5–5,5 × 10¹²/л"
      ],
      [
        "MCH",
        "25–35 пг/клетку",
        "гемоглобин эритроцит",
        "25–35 пг/клетку"
      ],
      [
        "MCHC",
        "31–36 г/дл",
        "концентрация гемоглобина",
        "31–36 г/дл"
      ],
      [
        "Нейтрофилы сегментоядерные",
        "54–62%",
        "neutrophils segmented",
        "54–62%"
      ],
      [
        "Нейтрофилы палочкоядерные",
        "3–5%",
        "neutrophils bands",
        "3–5%"
      ],
      [
        "Лимфоциты",
        "25–33%",
        "lymphocytes",
        "25–33%"
      ],
      [
        "Моноциты",
        "3–7%",
        "monocytes",
        "3–7%"
      ],
      [
        "Эозинофилы",
        "1–3%",
        "eosinophils",
        "1–3%"
      ],
      [
        "Базофилы",
        "0–0,75%",
        "basophils",
        "0–0,75%"
      ],
      [
        "D-димер",
        "≤250 ng/mL; зависит от метода и единиц лаборатории",
        "d-dimer",
        "≤250 мкг/л; зависит от метода и единиц лаборатории"
      ],
      [
        "СОЭ · Westergren",
        "М: 0–15; Ж: 0–20 мм/ч",
        "esr sedimentation",
        "М: 0–15; Ж: 0–20 мм/ч"
      ],
      [
        "CD4⁺ T-лимфоциты",
        "≥500 клеток/мкл",
        "cd4 lymphocyte",
        "≥500 клеток/мкл"
      ],
      [
        "HbA1c · таблица USMLE",
        "≤6%; это справочный диапазон таблицы, не диагностический порог диабета",
        "гликированный гемоглобин a1c",
        "≤42 ммоль/моль; справочный диапазон таблицы, не диагностический порог диабета"
      ],
      [
        "Объём плазмы",
        "М: 25–43; Ж: 28–45 мл/кг",
        "plasma volume",
        "М: 25–43; Ж: 28–45 мл/кг"
      ],
      [
        "Объём эритроцитов",
        "М: 20–36; Ж: 19–31 мл/кг",
        "red cell volume",
        "М: 20–36; Ж: 19–31 мл/кг"
      ]
    ]
  ],
  [
    "Биохимия",
    [
      [
        "Натрий · Na⁺",
        "136–146 mEq/L",
        "sodium",
        "136–146 ммоль/л"
      ],
      [
        "Калий · K⁺",
        "3,5–5,0 mEq/L",
        "potassium",
        "3,5–5,0 ммоль/л"
      ],
      [
        "Хлор · Cl⁻",
        "95–105 mEq/L",
        "chloride",
        "95–105 ммоль/л"
      ],
      [
        "Бикарбонат · HCO₃⁻",
        "22–28 mEq/L",
        "hco3 bicarbonate",
        "22–28 ммоль/л"
      ],
      [
        "Кальций общий · Ca",
        "8,4–10,2 mg/dL",
        "calcium",
        "2,1–2,6 ммоль/л"
      ],
      [
        "Креатинин",
        "0,6–1,2 mg/dL",
        "creatinine",
        "53–106 мкмоль/л"
      ],
      [
        "Азот мочевины · BUN",
        "7–18 mg/dL",
        "urea nitrogen",
        "Мочевина: 2,5–6,4 ммоль/л"
      ],
      [
        "Глюкоза натощак",
        "70–100 mg/dL",
        "glucose fasting",
        "3,8–5,6 ммоль/л"
      ],
      [
        "Осмоляльность сыворотки",
        "275–295 мОсм/кг",
        "osmolality",
        "275–295 мОсм/кг"
      ],
      [
        "АЛТ · ALT",
        "10–40 Ед/л",
        "alanine",
        "10–40 Ед/л"
      ],
      [
        "АСТ · AST",
        "12–38 Ед/л",
        "aspartate",
        "12–38 Ед/л"
      ],
      [
        "Щелочная фосфатаза · ALP",
        "25–100 Ед/л",
        "alkaline phosphatase",
        "25–100 Ед/л"
      ],
      [
        "Билирубин общий",
        "0,1–1,0 mg/dL",
        "bilirubin total",
        "2–17 мкмоль/л"
      ],
      [
        "Билирубин прямой",
        "0–0,3 mg/dL",
        "bilirubin direct",
        "0–5 мкмоль/л"
      ],
      [
        "Альбумин",
        "3,5–5,5 g/dL",
        "albumin",
        "35–55 г/л"
      ],
      [
        "Магний · Mg²⁺",
        "1,8–2,4 mg/dL (пересчёт из SI)",
        "magnesium",
        "0,75–1,0 ммоль/л"
      ],
      [
        "Фосфор неорганический",
        "3,0–4,5 mg/dL",
        "phosphorus phosphate",
        "1,0–1,5 ммоль/л"
      ],
      [
        "Глюкоза не натощак",
        "<140 mg/dL",
        "glucose random",
        "<7,77 ммоль/л"
      ],
      [
        "Общий белок",
        "6,0–7,8 g/dL",
        "total protein",
        "60–78 г/л"
      ],
      [
        "Глобулины",
        "2,3–3,5 g/dL",
        "globulins",
        "23–35 г/л"
      ],
      [
        "Амилаза",
        "25–125 Ед/л",
        "amylase",
        "25–125 Ед/л"
      ],
      [
        "Липаза",
        "13–60 Ед/л",
        "lipase",
        "13–60 Ед/л"
      ],
      [
        "Клиренс креатинина",
        "М: 97–137; Ж: 88–128 мл/мин",
        "creatinine clearance",
        "М: 97–137; Ж: 88–128 мл/мин"
      ],
      [
        "Креатинкиназа · CK",
        "М: 25–90; Ж: 10–70 Ед/л",
        "creatine kinase кфк",
        "М: 25–90; Ж: 10–70 Ед/л"
      ],
      [
        "ЛДГ · LDH",
        "45–200 Ед/л",
        "lactate dehydrogenase",
        "45–200 Ед/л"
      ],
      [
        "Тропонин I",
        "≤0,04 ng/mL; для высокочувствительного теста — референс лаборатории",
        "troponin",
        "≤0,04 мкг/л; для высокочувствительного теста — референс лаборатории"
      ],
      [
        "Мочевая кислота",
        "3,0–8,2 mg/dL",
        "uric acid",
        "0,18–0,48 ммоль/л"
      ]
    ]
  ],
  [
    "Гормоны",
    [
      [
        "ТТГ · TSH",
        "0,4–4,0 μIU/mL",
        "thyroid",
        "0,4–4,0 мМЕ/л"
      ],
      [
        "Свободный T4",
        "0,9–1,7 ng/dL",
        "free ft4 thyroxine",
        "12,0–21,9 пмоль/л"
      ],
      [
        "Паратгормон · PTH",
        "10–60 pg/mL",
        "parathyroid",
        "10–60 нг/л"
      ],
      [
        "Кортизол · 08:00",
        "5–23 μg/dL",
        "cortisol",
        "138–635 нмоль/л"
      ],
      [
        "ФСГ · FSH",
        "М: 4–25; Ж до менопаузы: 4–30; пик цикла: 10–90; после менопаузы: 40–250 мМЕ/мл",
        "follicle stimulating",
        "М: 4–25; Ж до менопаузы: 4–30; пик цикла: 10–90; после менопаузы: 40–250 МЕ/л"
      ],
      [
        "ЛГ · LH",
        "М: 6–23; Ж, фолликулярная фаза: 5–30; пик цикла: 75–150; после менопаузы: 30–200 мМЕ/мл",
        "luteinizing",
        "М: 6–23; Ж, фолликулярная фаза: 5–30; пик цикла: 75–150; после менопаузы: 30–200 МЕ/л"
      ],
      [
        "Гормон роста · GH",
        "Натощак: <5 ng/mL; стимуляция аргинином: >7 ng/mL",
        "growth hormone соматотропин",
        "Натощак: <5 мкг/л; стимуляция аргинином: >7 мкг/л"
      ],
      [
        "Пролактин",
        "М: <17; Ж: <25 ng/mL",
        "prolactin",
        "М: <17; Ж: <25 мкг/л"
      ],
      [
        "Кортизол · 16:00",
        "3–15 μg/dL",
        "cortisol",
        "82–413 нмоль/л"
      ],
      [
        "Кортизол · 20:00",
        "<50% значения в 08:00",
        "cortisol",
        "<50% значения в 08:00"
      ],
      [
        "T3 общий · RIA",
        "100–200 ng/dL",
        "triiodothyronine трийодтиронин",
        "1,5–3,1 нмоль/л"
      ],
      [
        "Захват T3 смолой",
        "25–35%",
        "t3 resin uptake",
        "25–35%"
      ],
      [
        "T4 общий",
        "5–12 μg/dL",
        "thyroxine тироксин",
        "64–155 нмоль/л"
      ],
      [
        "Захват ¹²³I щитовидной железой",
        "8–30% введённой дозы за 24 ч",
        "iodine uptake",
        "8–30% введённой дозы за 24 ч"
      ],
      [
        "17-гидроксикортикостероиды, моча",
        "М: 3–10; Ж: 2–8 мг/сут",
        "hydroxycorticosteroids",
        "М: 8,2–27,6; Ж: 5,5–22,0 мкмоль/сут"
      ],
      [
        "17-кетостероиды, моча",
        "М: 8–20; Ж: 6–15 мг/сут",
        "ketosteroids",
        "М: 28–70; Ж: 21–52 мкмоль/сут"
      ]
    ]
  ],
  [
    "Газы крови",
    [
      [
        "pH",
        "7,35–7,45",
        "кислотность",
        "7,35–7,45"
      ],
      [
        "PaCO₂",
        "33–45 мм рт. ст.",
        "paco2 pco2 углекислый",
        "4,4–5,9 кПа"
      ],
      [
        "PaO₂",
        "75–105 мм рт. ст.",
        "pao2 po2 кислород",
        "10,0–14,0 кПа"
      ]
    ]
  ],
  [
    "Железо",
    [
      [
        "Ферритин",
        "М: 20–250; Ж: 10–120 ng/mL",
        "ferritin",
        "М: 20–250; Ж: 10–120 мкг/л"
      ],
      [
        "Железо сыворотки",
        "М: 65–175; Ж: 50–170 μg/dL",
        "iron",
        "М: 11,6–31,3; Ж: 9,0–30,4 мкмоль/л"
      ],
      [
        "ОЖСС · TIBC",
        "250–400 μg/dL",
        "total iron binding capacity",
        "44,8–71,6 мкмоль/л"
      ],
      [
        "Трансферрин",
        "200–360 mg/dL",
        "transferrin",
        "2,0–3,6 г/л"
      ]
    ]
  ],
  [
    "Липиды",
    [
      [
        "Холестерин общий",
        "<200 mg/dL; высокий: >240 mg/dL",
        "cholesterol total",
        "<5,2 ммоль/л; высокий: >6,2 ммоль/л"
      ],
      [
        "ЛПВП · HDL",
        "40–60 mg/dL",
        "cholesterol",
        "1,0–1,6 ммоль/л"
      ],
      [
        "ЛПНП · LDL · таблица USMLE",
        "<160 mg/dL; не цель лечения",
        "cholesterol",
        "<4,2 ммоль/л; не цель лечения"
      ],
      [
        "Триглицериды",
        "<150 mg/dL; пограничные по таблице: 151–199 mg/dL",
        "triglycerides",
        "<1,70 ммоль/л; пограничные по таблице: 1,71–2,25 ммоль/л"
      ]
    ]
  ],
  [
    "Иммуноглобулины",
    [
      [
        "IgA",
        "76–390 mg/dL",
        "иммуноглобулин",
        "0,76–3,90 г/л"
      ],
      [
        "IgE",
        "0–380 МЕ/мл",
        "иммуноглобулин",
        "0–380 кМЕ/л"
      ],
      [
        "IgG",
        "650–1500 mg/dL",
        "иммуноглобулин",
        "6,5–15,0 г/л"
      ],
      [
        "IgM",
        "50–300 mg/dL",
        "иммуноглобулин",
        "0,5–3,0 г/л"
      ]
    ]
  ],
  [
    "Ликвор",
    [
      [
        "Клетки ликвора",
        "0–5 клеток/мкл",
        "csf cell count",
        "0–5 клеток/мкл"
      ],
      [
        "Хлор ликвора",
        "118–132 mEq/L",
        "csf chloride",
        "118–132 ммоль/л"
      ],
      [
        "Гамма-глобулин ликвора",
        "3–12% общего белка",
        "csf gamma globulin",
        "3–12% общего белка"
      ],
      [
        "Глюкоза ликвора",
        "40–70 mg/dL",
        "csf glucose",
        "2,2–3,9 ммоль/л"
      ],
      [
        "Давление ликвора",
        "70–180 мм вод. ст.",
        "csf pressure",
        "70–180 мм вод. ст."
      ],
      [
        "Белок ликвора",
        "<40 mg/dL",
        "csf protein",
        "<0,40 г/л"
      ]
    ]
  ],
  [
    "Моча",
    [
      [
        "Кальций мочи",
        "100–300 мг/сут",
        "urine calcium",
        "2,5–7,5 ммоль/сут"
      ],
      [
        "Осмоляльность мочи",
        "50–1200 мОсм/кг",
        "urine osmolality",
        "50–1200 мОсм/кг"
      ],
      [
        "Оксалат мочи",
        "8–40 μg/mL",
        "urine oxalate",
        "90–445 мкмоль/л"
      ],
      [
        "Белок мочи",
        "<150 мг/сут",
        "urine protein",
        "<0,15 г/сут"
      ]
    ]
  ],
  [
    "Дополнительно",
    [
      [
        "ИМТ · BMI · таблица USMLE",
        "19–25 кг/м²; справочный интервал этой таблицы",
        "body mass index индекс массы тела",
        "19–25 кг/м²; справочный интервал этой таблицы"
      ]
    ]
  ]
];
  const dialog = document.createElement('dialog');
  dialog.className = 'lab-dialog';
  dialog.setAttribute('aria-labelledby', 'lab-title');
  dialog.innerHTML = `<header class="lab-header"><div><span class="lab-eyebrow">СПРАВОЧНИК · STEP 1</span><h2 id="lab-title">Нормы анализов</h2></div><button type="button" class="btn outline" data-lab-close aria-label="Закрыть памятку">Закрыть</button></header><div class="lab-filters"><div class="lab-switches"><button type="button" data-lab-unit data-unit="US" class="btn outline lab-unit" aria-label="Единицы: US. Переключить на SI"><span class="lab-unit-indicator" aria-hidden="true"></span><span>US</span><span>SI</span></button><button type="button" data-lab-formulas class="btn outline" aria-pressed="false">Формулы</button></div><label for="lab-search">Найти показатель</label><input id="lab-search" type="search" placeholder="Например, калий, Hb или TSH" autocomplete="off"><div class="lab-tabs" role="group" aria-label="Раздел анализов"></div><p class="lab-count" role="status" aria-live="polite"></p></div><div class="lab-body"><div class="lab-results"></div><p class="lab-note">Полная подборка показателей USMLE Laboratory Values (редакция апреля 2026). М — мужчины, Ж — женщины. Референсы для взрослых. Если в условии указан свой диапазон, используйте его. Для детей и при беременности нормы могут отличаться. Референсы зависят от метода; справочный диапазон не всегда совпадает с диагностическим порогом или целью лечения. Газы — артериальная кровь при дыхании комнатным воздухом.</p><p class="lab-note">В зачёте и экзамене таймер продолжает идти.</p><a class="lab-source" href="https://www.usmle.org/sites/default/files/2021-10/Step_1_Sample_Items.pdf#page=8" target="_blank" rel="noopener noreferrer">Источник: USMLE Laboratory Values, стр. 7–9 ↗</a></div>`;
  document.body.append(dialog);
  const search = dialog.querySelector('input'), results = dialog.querySelector('.lab-results');
  let category = 'Все', origin, unit = 'US', formulas = false;
  const desktop = window.matchMedia('(min-width:1100px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motions = new Map();
  function motion(element,frames,duration=180,easing='cubic-bezier(.2,.7,.2,1)'){
    motions.get(element)?.cancel();motions.delete(element);
    if(reducedMotion.matches||!element.animate)return;
    const animation=element.animate(frames,{duration,easing});
    motions.set(element,animation);animation.onfinish=()=>{if(motions.get(element)===animation)motions.delete(element);};
  }
  reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){for(const animation of motions.values())animation.cancel();motions.clear();}});
  function revealResults(){motion(results,[{opacity:.35,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}]);}
  const practice = !document.getElementById('examContent');
  const normalize = text => text.toLowerCase().replaceAll('ё', 'е').trim();
  const tabs = dialog.querySelector('.lab-tabs');
  for (const name of ['Все', ...groups.map(g => g[0])]) {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = name;
    button.onclick = () => { category = name; formulas=false; dialog.querySelector('[data-lab-formulas]').setAttribute('aria-pressed','false'); render(); revealResults(); };
    tabs.append(button);
  }
  function render() {
    const query = normalize(search.value); let count = 0;
    if(formulas){renderFormulas();return;}
    results.replaceChildren();
    for (const button of tabs.children) button.setAttribute('aria-pressed', String(button.textContent === category));
    for (const [name, rows] of groups) {
      if (category !== 'Все' && name !== category) continue;
      const matches = rows.filter(row => normalize(row.join(' ')).includes(query));
      if (!matches.length) continue;
      const section = document.createElement('section'), heading = document.createElement('h3'), list = document.createElement('dl');
      heading.textContent = name; section.append(heading, list);
      for (const [label, us, aliases, si] of matches) {
        const row = document.createElement('div'), term = document.createElement('dt'), definition = document.createElement('dd');
        term.textContent = label; definition.textContent = unit === 'US' ? us : si;
        row.append(term, definition); list.append(row); count++;
      }
      results.append(section);
    }
    dialog.querySelector('.lab-count').textContent = count ? `Показателей: ${count}` : 'Ничего не найдено. Попробуйте другое название или раздел «Все».';
  }

  function showReference(){
    document.body.classList.toggle('lab-docked',desktop.matches);
    if(desktop.matches)dialog.show();else dialog.showModal();
    motion(dialog,[{opacity:0,transform:desktop.matches?'translateX(36px)':'translateY(24px)'},{opacity:1,transform:'translate(0,0)'}],480,'cubic-bezier(.4,0,.2,1)');
  }
  desktop.addEventListener('change',()=>{if(dialog.open){dialog.close();showReference();}});
  dialog.querySelector('[data-lab-unit]').onclick=()=>{
    unit=unit==='US'?'SI':'US';const control=dialog.querySelector('[data-lab-unit]');control.setAttribute('data-unit',unit);control.setAttribute('aria-label','Единицы: '+unit+'. Переключить на '+(unit==='US'?'SI':'US'));render();motion(results,[{opacity:.25},{opacity:1}],160);
  };
  dialog.querySelector('[data-lab-formulas]').onclick=()=>{
    formulas=!formulas;dialog.querySelector('[data-lab-formulas]').setAttribute('aria-pressed',String(formulas));render();revealResults();
  };
  function renderFormulas(){
    results.replaceChildren();
    for(const button of tabs.children)button.setAttribute('aria-pressed','false');
    dialog.querySelector('.lab-count').textContent=practice?'Учебные калькуляторы · поля при смене единиц очищаются':'Формулы · в экзаменах калькуляторы отключены';
    const specs=[
      {id:'gap',title:'Анионная разница',formula:'AG = Na − (Cl + HCO₃)',note:'Без калия. Референс зависит от лаборатории и альбумина; гипоальбуминемия снижает AG.',fields:[['na','Na','ммоль/л'],['cl','Cl','ммоль/л'],['hco','HCO₃','ммоль/л']]},
      {id:'winter',title:'Формула Уинтера',formula:'Ожидаемое PaCO₂ = 1,5 × HCO₃ + 8 ± 2 мм рт. ст.',note:'Только для оценки дыхательной компенсации при метаболическом ацидозе. Выше ожидаемого — возможен дополнительный респираторный ацидоз, ниже — алкалоз.',fields:[['hco','HCO₃','ммоль/л']]},
      {id:'osm',title:'Расчётная осмоляльность',formula:unit==='US'?'2 × Na + глюкоза / 18 + BUN / 2,8':'2 × Na + глюкоза + мочевина',note:'Na — измеренный. Результат приблизительный, мОсм/кг; формула не учитывает этанол и другие неучтённые осмолы. В SI вводите мочевину, не BUN.',fields:[['na','Na','ммоль/л'],['glucose','Глюкоза',unit==='US'?'mg/dL':'ммоль/л'],['urea',unit==='US'?'BUN':'Мочевина',unit==='US'?'mg/dL':'ммоль/л']]}
    ];
    for(const spec of specs){
      if(search.value && !normalize(spec.title+' '+spec.formula).includes(normalize(search.value)))continue;
      const section=document.createElement('section'),h=document.createElement('h3'),f=document.createElement('p'),note=document.createElement('p');
      h.textContent=spec.title;f.textContent=spec.formula;note.textContent=spec.note;note.className='lab-note';section.append(h,f,note);
      if(practice){
        const form=document.createElement('form'),out=document.createElement('output');form.className='lab-calc';const inputs={};
        for(const [key,label,units] of spec.fields){const wrap=document.createElement('label'),input=document.createElement('input');wrap.textContent=label+' ('+units+')';input.type='text';input.inputMode='decimal';input.autocomplete='off';input.setAttribute('aria-label',wrap.textContent);inputs[key]=input;wrap.append(input);form.append(wrap);}
        const button=document.createElement('button');button.type='submit';button.className='btn outline';button.textContent='Рассчитать';out.setAttribute('aria-live','polite');form.append(button,out);
        form.addEventListener('input',()=>{if(!out.textContent)return;motions.get(out)?.cancel();motions.delete(out);out.textContent='Данные изменены — пересчитать';out.setAttribute('data-state','stale');button.textContent='Пересчитать';});
        form.onsubmit=e=>{e.preventDefault();motions.get(out)?.cancel();motions.delete(out);out.setAttribute('data-state','error');const values={};for(const [key,input] of Object.entries(inputs)){const raw=input.value.trim().replace(',','.');if(!/^\d+(\.\d+)?$/.test(raw)||!Number.isFinite(Number(raw))||Number(raw)>100000){out.textContent='Введите числа от 0 до 100000 во все поля.';return;}values[key]=Number(raw);}out.textContent=window.LabCalculations.calculate(spec.id,values,unit);out.setAttribute('data-state','ready');button.textContent='Рассчитать';motion(out,[{opacity:.35,transform:'translateY(4px)',backgroundColor:'var(--line)'},{opacity:1,transform:'translateY(0)',backgroundColor:'transparent'}],320);};
        section.append(form);
      }
      const source=document.createElement('a');source.href='https://vimbook.vumc.org/nephrology/acid-base';source.target='_blank';source.rel='noopener noreferrer';source.className='lab-source';source.textContent='Источник: Vanderbilt · Acid-Base ↗';section.append(source);results.append(section);
    }
    if(!results.children.length)dialog.querySelector('.lab-count').textContent='Формулы не найдены. Очистите поиск.';
  }

  search.addEventListener('input', render);
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-lab-open]'); if (!button) return;
    origin = button; render(); if(!dialog.open)showReference();
    dialog.querySelector('[data-lab-close]').focus();
  });
  dialog.querySelector('[data-lab-close]').onclick = () => dialog.close();
  dialog.addEventListener('close', () => { if(dialog.open)return; for(const animation of motions.values())animation.cancel();motions.clear(); document.body.classList.remove('lab-docked'); if (origin?.isConnected) origin.focus({preventScroll:true}); });
  // Keep question shortcuts from changing an answer while the reference is open.
  document.addEventListener('keydown', event => { if (dialog.open && (!desktop.matches || dialog.contains(event.target))) event.stopImmediatePropagation();
    if(dialog.open && desktop.matches && event.key==='Escape' && !document.querySelector('dialog:modal')) dialog.close(); }, true);
})();
