/* Question-level patches keep unrelated answers from other devices intact. */
window.ProgressModel = {
  flatten(states, blocks) {
    const entries = {};
    for (const b of blocks) {
      const s = states[b.n];
      entries[b.progressLastKey || `${b.n}:last`] = s?.last || 0;
      b.questions.forEach((q, i) => {
        entries[q.progressKey || `${b.n}:${i}`] = {
          answer: s?.answers?.[i] ?? null,
          submitted: s?.submitted?.[i] === true,
          marked: s?.marked?.[i] === true,
          grade: s?.grades?.[i] ?? null
        };
      });
    }
    return entries;
  },
  expand(entries, blocks) {
    const result = {};
    for (const b of blocks) {
      const s = {answers: [], submitted: [], marked: [], grades: [], last: 0};
      let last = entries[b.progressLastKey || `${b.n}:last`];
      if (!Number.isInteger(last) && b.legacyLast) {
        last = 0;
        for (const legacy of b.legacyLast) {
          if (Number.isInteger(entries[legacy.key]) && entries[legacy.key] > 0) last = legacy.offset + entries[legacy.key];
        }
      }
      if (Number.isInteger(last)) s.last = Math.max(0, Math.min(last, b.questions.length - 1));
      b.questions.forEach((q, i) => {
        const v = entries[q.progressKey || `${b.n}:${i}`] || {};
        const answer = q.choices.includes(v.answer) ? v.answer : null;
        const submitted = !!answer && v.submitted === true;
        s.answers.push(answer);
        s.submitted.push(submitted);
        s.marked.push(v.marked === true);
        s.grades.push(submitted ? (q.correct ? answer === q.correct :
          typeof v.grade === 'boolean' ? v.grade : null) : null);
      });
      result[b.n] = s;
    }
    return result;
  },
  diff(previous, next) {
    return Object.fromEntries(Object.entries(next).filter(([key, value]) =>
      JSON.stringify(value) !== JSON.stringify(previous[key])));
  }
};
