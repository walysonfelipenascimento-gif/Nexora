# Nexora Creator Studio — isolated implementation

## Confirmed product decisions

This module is developed in parallel on `feat/nexora-creator-studio-isolated`. The five user-provided reference images define the visual and interaction direction.

1. Story capture and preview flow with audience choices.
2. POST and REELS use one shared editing core; they are separate entry points into the same toolset, not separate editors.
3. Creator analytics: retention, real-time views, engagement, traffic, and audience.
4. Editorial calendar and post composition/scheduling.
5. Comments management.
6. LIVE remains visible as a future creation mode, but its dedicated interface and streaming flow are deferred until separately specified.
7. AI Creator and AI content generation are excluded from this Creator Studio scope.

## Technical boundaries

- Keep all work isolated under `app/creator-studio/`.
- Do not delete or overwrite existing feed, Stories, Reels, profile, messaging, or Store flows.
- Do not connect or modify Supabase schema, credentials, or data in this phase.
- Demo metrics must remain clearly identified as illustrative.
- File selection is a local prototype capability; real media processing, persistence, publishing, scheduling, and live streaming require later integrations.
- No production deploy until build checks, route review, responsive checks, and explicit integration approval are complete.

## Route

`/creator-studio` — isolated preview; no entry point has been added to the live app.
