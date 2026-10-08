/* Decorative topic covers. Topic IDs and question order remain unchanged. */
(() => {
  const art = {
    'biochemistry':['#e9e5fa','#7860a5','<path d="M35 22c0 30 50 26 50 56M85 22c0 30-50 26-50 56M40 30h40M48 42h24M48 58h24M40 70h40"/>'],
    'biostatistics-epidemiology':['#e1effb','#477dac','<path d="M28 25v52h67M40 65V52m17 13V41m17 24V30M35 43l20-12 18 3 18-15"/><circle cx="35" cy="43" r="3"/><circle cx="55" cy="31" r="3"/><circle cx="73" cy="34" r="3"/>'],
    'cardiovascular-system':['#f8e5e8','#bd6375','<path d="M60 79S26 60 26 39c0-20 25-24 34-8 9-16 34-12 34 8 0 21-34 40-34 40Z"/><path d="M30 51h15l7-14 11 28 8-14h19"/>'],
    'dermatology':['#faebde','#b87b50','<path d="M24 42c12-15 22 10 36 0s23-14 36 0v35H24Z M24 59h72M24 69h72M42 22v22m18-20v12m18-14v21"/><circle cx="38" cy="51" r="2"/><circle cx="58" cy="52" r="2"/><circle cx="80" cy="51" r="2"/>'],
    'endocrinology':['#eee6f7','#9069a5','<path d="M54 23v21c-8-18-26-11-22 7s8 27 18 23c6-3 6-13 10-13s4 10 10 13c10 4 14-5 18-23s-14-25-22-7V23M55 33h10M55 39h10"/>'],
    'git-toxicology-nutrition':['#f5e9df','#a57857','<path d="M59 20v25c0 8-15 0-22 8-15 17 5 37 24 25 6-4 11-9 19-9 18 0 17-31 3-37-9-4-14 10-16 11V20M38 72c8 0 11-10 18-10"/>'],
    'gynecology-obstetrics':['#f6e5ef','#ac648f','<path d="M47 41c-9-24-29-16-26-1 2 12 17 11 15 0-1-4-5-5-8-3M73 41c9-24 29-16 26-1-2 12-17 11-15 0 1-4 5-5 8-3M46 39c7 5 21 5 28 0 8 17-9 26-9 33v9H55v-9c0-7-17-16-9-33Z"/>'],
    'hematology':['#fae4e5','#b95f6b','<path d="M60 18c-8 14-24 31-24 44a24 24 0 0 0 48 0c0-13-16-30-24-44Z M47 63c0 9 6 13 13 13"/>'],
    'infection':['#e4efdf','#769158','<circle cx="60" cy="50" r="23"/><path d="M60 18v9m0 46v9M28 50h9m46 0h9M37 27l7 7m32 32 7 7M37 73l7-7m32-32 7-7"/><circle cx="52" cy="45" r="4"/><circle cx="68" cy="55" r="5"/><path d="m50 59 4 2"/>'],
    'nephrology':['#f1e5ed','#a46b91','<path d="M44 26c-27-8-32 47-11 50 15 2 20-12 11-20-7-6 12-22 0-30ZM76 26c27-8 32 47 11 50-15 2-20-12-11-20 7-6-12-22 0-30ZM47 49c13 0 9 25 9 32m17-32c-13 0-9 25-9 32"/>'],
    'neurology':['#e8e8fa','#7c75b0','<path d="M59 27c-9-15-24-8-25 4-13 0-17 17-8 24-7 14 5 27 17 22 7 10 16 3 16-4ZM61 27c9-15 24-8 25 4 13 0 17 17 8 24 7 14-5 27-17 22-7 10-16 3-16-4ZM35 32c9 0 10 9 6 13m-15 9c12-8 19-1 19 7m14-18c-12-4-14-10-12-17m38 6c-9 0-10 9-6 13m15 9c-12-8-19-1-19 7"/>'],
    'pediatric-2':['#f8ebdb','#b28a4b','<circle cx="60" cy="48" r="26"/><path d="M50 23c0-13 21-10 15 0M42 45h4m28 0h4M51 59q9 9 18 0M31 45c-13-3-13 18 2 16m56-16c13-3 13 18-2 16"/>'],
    'pediatrics-1':['#e0f0ed','#5a978c','<circle cx="60" cy="43" r="22"/><circle cx="39" cy="23" r="10"/><circle cx="81" cy="23" r="10"/><path d="M42 61c-20 26 56 26 36 0M51 40h1m16 0h1M56 49h8l-4 5Z"/>'],
    'psychiatry':['#e8e8f2','#7d7b9d','<path d="M39 81V65c-22-26-2-52 23-46 24 5 23 28 23 28l9 13H83v11H68v10"/><path d="M50 48c-17-9 1-24 10-10 9-14 27 1 10 10l-10 9Z"/>'],
    'pulmonology':['#e1eff4','#548da3','<path d="M56 21v24L44 33c-9-7-22 26-19 39 4 15 25 1 29-7V46m10-25v24l12-12c9-7 22 26 19 39-4 15-25 1-29-7V46M60 35v15M44 43v20m-9-8 9-6m32-6v20m9-8-9-6"/>'],
    'rheumatology':['#eeeade','#99885a','<path d="m46 28 29 29c12-2 21 9 14 16-4 4-9 2-11 0 2 5-2 11-7 10-9-1-12-9-9-15L33 39c-11 2-20-9-13-16 4-4 9-2 11 0-2-5 2-11 7-10 9 1 12 9 8 15Z"/>'],
    'general-pharmacology':['#e3eff1','#5b9299','<path d="m34 59 30-30c18-18 40 4 22 22L56 81C38 99 16 77 34 59ZM49 44l22 22M68 35l12 12"/>'],
    'immunology':['#e3eee4','#65916e','<path d="M60 18c-10 9-22 9-29 9v24c0 18 18 27 29 33 11-6 29-15 29-33V27c-7 0-19 0-29-9Z M47 50l9 9 19-22"/>'],
    'microbiology':['#e6efdf','#819456','<path d="m45 23 21 21 13-13-21-21ZM48 28l-9 9 13 13 9-9M71 42c21 8 18 32-4 32H43M60 74v10M38 84h47M30 63h32"/><circle cx="71" cy="46" r="6"/>'],
    'ophthalmology':['#e1eaf6','#6389b7','<path d="M20 50s16-24 40-24 40 24 40 24-16 24-40 24-40-24-40-24Z"/><circle cx="60" cy="50" r="16"/><circle cx="60" cy="50" r="6"/>']
  };
  window.TopicCards={visual(id){
    const key=id.replace(/^topic-(?:2024-)?/,''),[bg,ink,paths]=art[key]||art.biochemistry;
    return `<span class="topic-cover" style="--cover-bg:${bg};--cover-ink:${ink}" aria-hidden="true"><svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round">${paths}</svg></span>`;
  }};
})();
