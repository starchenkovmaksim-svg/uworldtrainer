/* Keep the previous guest save intact; map answers by their original question. */
window.QuestionRepairs = {
  migrate(states, blocks) {
    const next = {};
    for (const b of blocks) {
      const old = states[b.n];
      if (!old) continue;
      const s = {answers: [], submitted: [], marked: [], grades: [], last: 0};
      b.questions.forEach((q, i) => {
        const from = Object.hasOwn(q, 'legacyIndex') ? q.legacyIndex : i;
        for (const field of ['answers', 'submitted', 'marked', 'grades']) {
          s[field][i] = from === null ? (field === 'submitted' || field === 'marked' ? false : null) : old[field]?.[from];
        }
        if (from === old.last) s.last = i;
      });
      next[b.n] = s;
    }
    return next;
  },
  regrade(s, questions) {
    questions.forEach((q, i) => {
      if (q.unavailable || !q.choices.includes(s.answers[i])) {
        s.answers[i] = null; s.submitted[i] = false; s.grades[i] = null;
      } else if (s.submitted[i] && q.correct) {
        s.grades[i] = s.answers[i] === q.correct;
      }
    });
    return s;
  }
};
