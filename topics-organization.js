// Keep original question keys so existing devices and cloud entries stay compatible.
(() => {
  for (const b of BLOCKS) b.title = b.title.replace(/ · UW 2024$/, '');
  const old = BLOCKS.find(b => b.n === 'topic-rheumatology');
  const sports = BLOCKS.find(b => b.n === 'topic-2024-rheumatology-orthopedics-sports');
  const offset = old.questions.length;
  const originalQuestions = old.questions;
  old.title = sports.title;
  old.progressLastKey = 'topic-rheumatology-combined:last';
  old.legacyLast = [{key: old.n + ':last', offset: 0}, {key: sports.n + ':last', offset}];
  old.questions = [...originalQuestions, ...sports.questions.map((q,i) => ({...q, progressKey: sports.n + ':' + i}))];
  BLOCKS.splice(BLOCKS.indexOf(sports), 1);
  window.migrateTopicStates = states => {
    const first = states[old.n], second = states[sports.n];
    if (first?.answers?.length === old.questions.length) return states;
    if (!first && !second) return states;
    const merged = {last: second?.last ? offset + second.last : first?.last || 0};
    for (const key of ['answers','submitted','marked','grades']) {
      const empty = ['submitted','marked'].includes(key) ? false : null;
      merged[key] = [...Array.from({length: offset}, (_,i) => first?.[key]?.[i] ?? empty),
        ...Array.from({length: sports.questions.length}, (_,i) => second?.[key]?.[i] ?? empty)];
    }
    return {...states, [old.n]: merged};
  };
})();
