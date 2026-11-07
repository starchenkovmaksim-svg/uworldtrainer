(() => {
  const groups = [
    ['Кровь', [
      ['Гемоглобин · Hb', 'М: 135–175; Ж: 120–160 г/л', 'hemoglobin'],
      ['Гематокрит · Hct', 'М: 41–53%; Ж: 36–46%', 'hematocrit'],
      ['Лейкоциты · WBC', '4,5–11 × 10⁹/л', 'leukocytes'],
      ['Тромбоциты · PLT', '150–400 × 10⁹/л', 'platelets'],
      ['MCV', '80–100 фл', 'объем эритроцитов'],
      ['Ретикулоциты', '0,5–1,5%', 'reticulocytes'],
      ['Протромбиновое время · PT', '11–15 с', 'coagulation'],
      ['АЧТВ · aPTT', '25–40 с', 'ptt coagulation']
    ]],
    ['Биохимия', [
      ['Натрий · Na⁺', '136–146 ммоль/л', 'sodium'],
      ['Калий · K⁺', '3,5–5,0 ммоль/л', 'potassium'],
      ['Хлор · Cl⁻', '95–105 ммоль/л', 'chloride'],
      ['Бикарбонат · HCO₃⁻', '22–28 ммоль/л', 'hco3 bicarbonate'],
      ['Кальций общий · Ca', '8,4–10,2 mg/dL', 'calcium'],
      ['Креатинин', '0,6–1,2 mg/dL', 'creatinine'],
      ['Азот мочевины · BUN', '7–18 mg/dL', 'urea nitrogen'],
      ['Глюкоза натощак', '70–100 mg/dL', 'glucose fasting'],
      ['Осмоляльность сыворотки', '275–295 мОсм/кг', 'osmolality'],
      ['АЛТ · ALT', '10–40 Ед/л', 'alanine'],
      ['АСТ · AST', '12–38 Ед/л', 'aspartate'],
      ['Щелочная фосфатаза · ALP', '25–100 Ед/л', 'alkaline phosphatase'],
      ['Билирубин общий', '0,1–1,0 mg/dL', 'bilirubin total'],
      ['Билирубин прямой', '0–0,3 mg/dL', 'bilirubin direct'],
      ['Альбумин', '35–55 г/л', 'albumin']
    ]],
    ['Гормоны', [
      ['ТТГ · TSH', '0,4–4,0 мМЕ/л', 'thyroid'],
      ['Свободный T4', '0,9–1,7 ng/dL', 'free ft4 thyroxine'],
      ['Паратгормон · PTH', '10–60 pg/mL', 'parathyroid'],
      ['Кортизол · 08:00', '5–23 μg/dL', 'cortisol']
    ]],
    ['Газы крови', [
      ['pH', '7,35–7,45', 'кислотность'],
      ['PaCO₂', '33–45 мм рт. ст.', 'paco2 pco2 углекислый'],
      ['PaO₂', '75–105 мм рт. ст.', 'pao2 po2 кислород']
    ]]
  ];
  const dialog = document.createElement('dialog');
  dialog.className = 'lab-dialog';
  dialog.setAttribute('aria-labelledby', 'lab-title');
  dialog.innerHTML = `<header class="lab-header"><div><span class="lab-eyebrow">СПРАВОЧНИК · STEP 1</span><h2 id="lab-title">Нормы анализов</h2></div><button type="button" class="btn outline" data-lab-close aria-label="Закрыть памятку">Закрыть</button></header><div class="lab-filters"><label for="lab-search">Найти показатель</label><input id="lab-search" type="search" placeholder="Например, калий, Hb или TSH" autocomplete="off"><div class="lab-tabs" role="group" aria-label="Раздел анализов"></div><p class="lab-count" role="status" aria-live="polite"></p></div><div class="lab-body"><div class="lab-results"></div><p class="lab-note">Референсы для взрослых. Если в условии указан свой диапазон, используйте его. Для детей и при беременности нормы могут отличаться. Газы — артериальная кровь при дыхании комнатным воздухом.</p><p class="lab-note">В зачёте и экзамене таймер продолжает идти.</p><a class="lab-source" href="https://www.usmle.org/sites/default/files/2021-10/Step_1_Sample_Items.pdf#page=8" target="_blank" rel="noopener noreferrer">Источник: USMLE Laboratory Values, стр. 7–9 ↗</a></div>`;
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
