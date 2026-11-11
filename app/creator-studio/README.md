# Nexora Creator Studio — isolated implementation

## Confirmed product decisions

This module is developed in parallel on `feat/nexora-creator-studio-isolated`. The five user-provided reference images define the visual and interaction direction.

1. Story capture and preview flow with audience choices.
2. POST and REELS use one shared editing core and one editor interface; format selection changes the composition preset.
3. Creator analytics: retention, real-time views, engagement, traffic, and audience.
4. Editorial calendar and post composition/scheduling.
5. Comments management.
6. LIVE remains visible as a future creation mode; its dedicated interface and streaming flow are deferred until separately specified.
7. AI Creator and AI content generation are excluded from this Creator Studio scope and navigation.

## Shared editor — current local capabilities

- Import multiple image and video files through the browser file picker.
- Preview selected images and play selected video files locally.
- Arrange imported clips in a sequence and select a clip for preview.
- Duplicate, remove, and move clips in the local sequence.
- Split a video segment at the current playback position.
- Apply CSS preview filters (black and white, warm, cool, contrast).
- Add a text overlay to the preview.
- Adjust video preview volume and playback speed.
- Import and preview a separate audio file.
- Download the selected original source file.
- Like and unlike demo comments, compose a local reply, and append a local comment.

## Known limitations — do not describe as completed

- The editor currently maintains a local editing sequence only; it does not encode a final combined media file.
- Filter and text changes are preview effects, not baked into exported media.
- The audio file is previewed separately and is not yet mixed/synchronized into the video output.
- Download exports the original selected source file, not the edited composition.
- No persistent project saving, cloud media upload, publication, or server-side rendering is connected.
- Comment likes and replies are local demonstration state and are not synchronized to a user account.
- Object URLs are local to the browser session.
- Story camera capture, gallery import/real publication, calendar persistence/scheduling, and complete comment actions still need implementation.
- Insights remain illustrative demo metrics, clearly labeled as such.

## Technical boundaries

- Keep all work isolated under `app/creator-studio/`.
- Do not delete or overwrite existing feed, Stories, Reels, profile, messaging, or Store flows.
- Do not connect or modify Supabase schema, credentials, or data in this phase.
- No production deploy until build checks, route review, responsive checks, and explicit integration approval are complete.

## Route

`/creator-studio` — isolated preview; no entry point has been added to the live app.
