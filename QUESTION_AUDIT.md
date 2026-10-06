# Question repair, 2026-10-06

The source inventory contains 829 block items and 4,188 topic items. This repair checks imported keys, option counts and page assignments against the supplied source screenshots and PDF text; it is not an independent clinical guideline review.

- Blocks 2–21 were regrouped by the visible item number and original question ID. Explanations from adjacent questions were removed from those groups.
- 823 block items now have source-supported automatic keys. Block 19 question 12 was corrected from C to E.
- All 56 previously unkeyed topic items now have keys. Fourteen topic option sets were completed, including scrolling graph/pedigree choices. Original result markers are removed from replacement question images; complete source screenshots remain in the explanations.
- The existing 13 topic datasets are unchanged. Their keys were cross-checked against source text. Existing topic IDs, merged-topic progress IDs and question order are retained.
- Block 12 question 36, block 14 question 31 and block 15 question 11 have no complete source prompt. They retain available explanations and are excluded from scoring.
- Block 11 question 1, block 16 question 1 and block 18 question 28 have no confirmed source key/explanation. They are explicitly marked and are not assigned guessed answers.

`repair-audit.json` records source IDs, page groups, keys and retained old indices. A key inferred from an explanation was accepted only when the source excluded every other listed option; residual cases were matched to a complete copy of the same source ID or checked directly in the source screenshot.

## Progress compatibility

The original `uworld_trainer_guest_v2` save is retained. The new guest save uses `uworld_trainer_guest_v3`. For source questions with an unambiguous prior question page, `legacyIndex` moves the guest answer and `progressKey` retains its cloud identity. Newly recovered prompts, pages previously showing only an explanation, and replacement versions with potentially different option order get a source-specific key. Their old records are not deleted or applied to a different question. Such repaired items may need to be answered again.

Grades are recalculated from repaired keys for both local and cloud answers. The account form is now a native dialog opened from the header account icon. Password recovery opens it automatically.

## Validation

Run the Node scripts in `tests/`. They cover data/media consistency, unique progress keys, old guest backup, question remapping, recalculated grades, unavailable prompts, topic merging, cloud retry/concurrent-device edits and account dialog/auth flows. Browser verification additionally checks desktop/mobile layout and public image delivery.
