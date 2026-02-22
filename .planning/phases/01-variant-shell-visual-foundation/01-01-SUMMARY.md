---
phase: 01-variant-shell-visual-foundation
plan: 01
subsystem: infra
tags: [vite, variant-system, favicon, csp, google-fonts, nunito]

# Dependency graph
requires: []
provides:
  - Happy variant registered in config system (variant.ts, panels.ts, vite.config.ts)
  - VARIANT_META for happy variant driving build-time HTML injection
  - dev:happy and build:happy npm scripts
  - Favicon assets for happy variant in public/favico/happy/
  - Hostname-based variant detection in index.html inline script
  - Google Fonts (Nunito) preconnect and stylesheet in document head
  - Favicon path variant awareness in htmlVariantPlugin
affects: [01-02-PLAN, 01-03-PLAN, 02-curated-positive-feeds]

# Tech tracking
tech-stack:
  added: [google-fonts-nunito]
  patterns: [variant-hostname-detection, favicon-variant-subdirectory]

key-files:
  created:
    - src/config/variants/happy.ts
    - public/favico/happy/favicon.svg
    - public/favico/happy/favicon.ico
    - public/favico/happy/favicon-16x16.png
    - public/favico/happy/favicon-32x32.png
    - public/favico/happy/apple-touch-icon.png
    - public/favico/happy/android-chrome-192x192.png
    - public/favico/happy/android-chrome-512x512.png
    - public/favico/happy/og-image.png
  modified:
    - src/config/variant.ts
    - src/config/panels.ts
    - vite.config.ts
    - package.json
    - index.html

key-decisions:
  - "Favicon variant paths handled via regex replacement in htmlVariantPlugin rather than separate HTML templates"
  - "Google Fonts loaded unconditionally for all variants (minimal overhead, CSS scoping prevents visual impact on non-happy)"
  - "Hostname-based variant detection added for all variants (tech, finance, happy) in inline script"

patterns-established:
  - "Favicon subdirectory per variant: public/favico/{variant}/"
  - "htmlVariantPlugin rewrites favicon/og-image paths for non-full variants"
  - "data-variant attribute set on html element before first paint via inline script"

requirements-completed: [INFRA-01, INFRA-02, INFRA-03]

# Metrics
duration: 5min
completed: 2026-02-22
---

# Phase 1 Plan 1: Variant Registration Summary

**Happy variant registered with panels, map layers, VARIANT_META, favicon assets, hostname detection, and Google Fonts preconnect**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-22T13:52:28Z
- **Completed:** 2026-02-22T13:57:40Z
- **Tasks:** 3
- **Files modified:** 14

## Accomplishments
- Happy variant fully recognized across all config switch points (variant.ts, panels.ts, vite.config.ts)
- Build scripts dev:happy and build:happy work correctly with VITE_VARIANT=happy
- VARIANT_META drives correct title/description/OG tags for Happy Monitor
- index.html sets data-variant="happy" before first paint when on happy.worldmonitor.app
- All 8 favicon assets created with sage green/warm gold globe design
- OG image (1200x630) with branded Happy Monitor card

## Task Commits

Each task was committed atomically:

1. **Task 1: Register happy variant in config system and build tooling** - `b068b9b` (feat)
2. **Task 2: Update index.html for variant detection, CSP, and Google Fonts** - `36900dd` (feat)
3. **Task 3: Create happy variant favicon assets** - `3b6211f` (feat)

## Files Created/Modified
- `src/config/variant.ts` - Added 'happy' to allowed stored variant values
- `src/config/variants/happy.ts` - New file: happy variant panels, map layers, feeds placeholder, VariantConfig
- `src/config/panels.ts` - Added HAPPY_PANELS, HAPPY_MAP_LAYERS, HAPPY_MOBILE_MAP_LAYERS inline with ternary chain updates
- `vite.config.ts` - Added happy VARIANT_META entry and favicon path variant replacement in htmlVariantPlugin
- `package.json` - Added dev:happy and build:happy scripts
- `index.html` - CSP frame-src update, variant detection inline script, Google Fonts preconnect
- `public/favico/happy/favicon.svg` - SVG globe in sage green and warm gold
- `public/favico/happy/favicon.ico` - ICO format favicon
- `public/favico/happy/favicon-16x16.png` - 16x16 PNG favicon
- `public/favico/happy/favicon-32x32.png` - 32x32 PNG favicon
- `public/favico/happy/apple-touch-icon.png` - 180x180 Apple touch icon
- `public/favico/happy/android-chrome-192x192.png` - 192x192 Android icon
- `public/favico/happy/android-chrome-512x512.png` - 512x512 Android icon
- `public/favico/happy/og-image.png` - 1200x630 branded OG card

## Decisions Made
- Favicon variant paths handled via regex replacement in htmlVariantPlugin rather than separate HTML templates per variant. This keeps a single index.html as the source of truth.
- Google Fonts (Nunito) loaded unconditionally for all variants. The overhead is minimal and the CSS font-family rule only applies when data-variant="happy" is set.
- Extended the hostname detection to cover all existing variants (tech, finance) plus happy, making the inline script a comprehensive variant resolver.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unused `rss` helper in happy.ts**
- **Found during:** Task 1 (Register happy variant)
- **Issue:** TypeScript error TS6133: 'rss' declared but never read. The `rss` helper was included from the tech.ts pattern but the happy FEEDS object has only empty placeholder arrays.
- **Fix:** Removed the unused `const rss = ...` line
- **Files modified:** src/config/variants/happy.ts
- **Verification:** `npx tsc --noEmit` exits 0
- **Committed in:** b068b9b (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Trivial fix for unused variable. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required for this plan. Vercel subdomain setup (happy.worldmonitor.app) noted in plan frontmatter but is a deployment concern for later.

## Next Phase Readiness
- Happy variant is fully registered and ready for theme CSS (Plan 02)
- All panels defined (will show empty states until Phase 2 feeds/data)
- Favicon assets ready for production deployment
- Google Fonts preconnect in place for Nunito usage in Plan 02's CSS theme

## Self-Check: PASSED

All 10 created files verified present. All 3 task commits verified in git log.

---
*Phase: 01-variant-shell-visual-foundation*
*Plan: 01*
*Completed: 2026-02-22*
