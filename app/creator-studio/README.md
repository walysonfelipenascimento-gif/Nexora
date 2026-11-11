# Nexora Creator Studio — isolated implementation

## Scope locked to the supplied references

This module is being developed in parallel on `feat/nexora-creator-studio-isolated`. It does not replace, delete, or import into existing feed, Stories, Reels, profile, messaging, Store, or Supabase flows.

The implementation scope is restricted to the supplied reference set:

1. Story camera + media preview + audience publishing controls.
2. Reels multitrack editor with preview, timeline, text/sticker/audio/voice/video tracks, and clip actions.
3. Creator analytics dashboard with retention, real-time view, engagement, traffic, and audience panels.
4. Editorial calendar plus create/schedule composition.
5. Clip-level editing controls including volume, speed, color, transitions, and layers.
6. AI video creation workspace with prompt, featured/recent/saved areas, and preview concepts.
7. Comments sheet over the content with replies/likes and composer.

Live Studio is intentionally not implemented in this pass because no Live-specific screen was present in the seven supplied references. It can be specified later from a reference, without guessing its UX.

## Safety and integration rules

- Do not delete or overwrite existing routes/components during this phase.
- Keep all new UI under `app/creator-studio/`.
- Do not connect or modify Supabase schema, credentials, or data.
- Metrics shown in the prototype are illustrative interface values and are explicitly labeled as preview/demo data.
- Media generation, media persistence, actual publication, scheduling, and streaming are not represented as production integrations.
- Do not alter Stories profile ordering/drag behavior or existing navigation until the new route is reviewed.
- No production deploy until build checks, route review, responsive checks, and an explicit integration decision are complete.

## Current route

`/creator-studio`

The route is isolated and has no entry point added to the live app yet.
