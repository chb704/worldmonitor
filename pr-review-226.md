## PR Review: Community Guidelines (CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md)

Overall this is a solid, well-structured set of community docs. The CONTRIBUTING.md in particular is thorough and does a great job explaining the Sebuf workflow, variant system, and data source contribution path. A few issues to address before merging:

---

### Factual Inaccuracies

1. **Locale count is wrong** — `CONTRIBUTING.md` says "14 languages" in the `src/locales/` description, but the directory contains **16** locale JSON files (ar, de, en, es, fr, it, ja, nl, pl, pt, ru, sv, th, tr, vi, zh).

2. **Domain service count** — The text says "17 domains" in two places (Architecture table and SECURITY.md), but `proto/worldmonitor/` contains **18** domain directories (aviation, climate, conflict, core, cyber, displacement, economic, infrastructure, intelligence, maritime, market, military, news, prediction, research, seismology, unrest, wildfire). The `server/` directory has 17 because `core` doesn't have a separate server handler, so clarify which count you mean or just say "18 proto domains" / "17 domain services."

3. **Component count** — The directory structure table says "~50 panels" for `src/components/`, but the directory contains **52** files. Minor, but the tilde makes it fine as-is — just flagging in case you want precision.

4. **`npm run build` comment** — The Development Setup section has `npm run build  # full` as a comment, but the actual build script runs `tsc && vite build` without explicitly setting `VITE_VARIANT=full`. It defaults to full, so functionally correct, but worth noting that unlike `build:tech` and `build:finance`, the base `build` command doesn't explicitly set the variant env var.

---

### Integration with Existing Docs

5. **README link points to wrong target** — `README.md` (line 1263) currently links to `./docs/DOCUMENTATION.md#contributing` for contribution guidelines. Once this PR merges, that link should be updated to point to the new `CONTRIBUTING.md` at the repo root instead, so contributors land on the comprehensive guide rather than the shorter section in DOCUMENTATION.md. Consider including that update in this PR.

6. **Duplicate content with `docs/DOCUMENTATION.md`** — The existing `docs/DOCUMENTATION.md` already has a "## Contributing" section (line 3865) with its own Getting Started, Code Style, and PR submission guidance. After this PR, there will be two contributing guides that could drift apart. Consider either:
   - Replacing the DOCUMENTATION.md contributing section with a link to the new `CONTRIBUTING.md`, or
   - Adding a note that CONTRIBUTING.md is the canonical source

7. **`docs/DOCUMENTATION.md` says `npm install`; `CONTRIBUTING.md` says `make install`** — The existing contributing section uses `npm install` for step 3, while the new CONTRIBUTING.md correctly uses `make install` (which installs buf, plugins, npm deps, and Playwright). This inconsistency will confuse new contributors. Another reason to consolidate.

---

### Security Reporting Contradiction

8. **CODE_OF_CONDUCT.md vs SECURITY.md conflict** — The Code of Conduct's enforcement section directs reports to **GitHub Issues** (public). Meanwhile, SECURITY.md explicitly says **"do NOT report security vulnerabilities through public GitHub issues"** and points to GitHub's private vulnerability reporting. These are different reporting channels for different purposes (conduct vs. security), but a contributor who discovers a security-relevant conduct violation could be confused. Consider clarifying in CODE_OF_CONDUCT.md that *security vulnerabilities* should follow SECURITY.md's process, and the CoC enforcement channel is for *behavioral* issues only.

---

### Minor Suggestions

9. **SECURITY.md "Supported Versions" table** — The table only lists `main` as supported. Since the project publishes tagged releases (currently v2.5.4) and has desktop builds via Tauri, consider listing the latest release version as the supported version, or clarify that security fixes are only applied to `main` HEAD and users should always pull the latest.

10. **RSS feed section is thin** — The "Adding RSS Feeds" section lists criteria but doesn't mention *where* to add them. The feed configs live in `src/config/` — pointing contributors to the specific file(s) would be helpful.

11. **Missing license mention** — None of the three files mention the project's license. CONTRIBUTING.md typically includes a note that contributions are made under the project's license (e.g., "By submitting a PR, you agree that your contribution will be licensed under [LICENSE]").

---

### What Looks Good

- Architecture overview table is excellent — concise and accurate
- Variant system explanation is clear and useful
- Sebuf workflow section is the best onboarding guide for the RPC framework I've seen in this project
- AI-assisted development policy is refreshingly practical
- Data source requirements checklist is well-thought-out
- SECURITY.md scope section clearly delineates in/out of scope

Nice work overall — the main items to fix are the factual numbers (#1, #2), the README link update (#5), and the reporting channel clarification (#8). The rest are improvements that could be addressed in a follow-up.
