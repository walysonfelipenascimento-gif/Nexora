# Nexora Creator Studio — isolated implementation

## Confirmed product decisions

This module is developed in parallel on `feat/nexora-creator-studio-isolated`. The five user-provided reference images define the visual and interaction direction.

1. Story capture and preview with browser camera permission, photo capture, gallery import, preview filters, audience selection and local file saving.
2. POST and REELS share one editing core; format selection changes the composition preset.
3. Creator analytics currently use explicitly illustrative sample data, not account analytics.
4. Editorial calendar supports real dates, local draft creation, media selection, date/time, format, removal, month navigation, and browser-local persistence.
5. Comments support local likes, replies and new comments; these are not connected to account data.
6. LIVE remains visible as a future creation mode; its dedicated interface and streaming flow are deferred until separately specified.
7. AI Creator and AI content generation are excluded from this Creator Studio scope and navigation.

## Story — implemented browser capabilities

- Request camera permission through `getUserMedia`, prefer the rear camera where available, display the live camera preview and stop camera tracks when leaving/unmounting.
- Capture a still photo from the camera preview.
- Record video with the browser MediaRecorder API, including microphone audio when permission is available; fall back to silent video if microphone access is unavailable.
- Import an image or video from the device gallery and preview it.
- Apply browser preview filters and add editable caption text.
- Choose an intended audience for the draft and save the selected original media file locally.
- Explain permission failures and unsupported camera contexts without pretending the camera is active.

## Shared POST / REELS editor — current local capabilities

- Import multiple image and video files through the browser file picker.
- Preview selected images and play selected video files locally.
- Arrange imported clips in a sequence and select a clip for preview.
- Duplicate, remove, and move clips in the local sequence.
- Split a video segment logically at the current playback position.
- Apply CSS preview filters and add a text overlay to the preview.
- Adjust video preview volume and playback speed.
- Import and preview a separate audio file.
- Download the selected original source file.

## Calendar — implemented browser capabilities

- Navigate months and select exact calendar dates.
- Create local POST, REELS, or STORY drafts with a date, time, caption and optional media file.
- Preview selected media, remove it, and remove saved drafts.
- Persist draft metadata in browser localStorage across reloads on the same browser/device.

## Known limitations — do not describe as completed

- No server upload, cross-device sync, public posting, automated publishing, or account-level scheduling is connected.
- Calendar media files are not persisted with the draft; only their filenames and draft metadata persist locally.
- The Story audience selector is a draft preference only and is not enforced by a publishing service.
- Story Boomerang and multi-frame Layout modes are not implemented; the UI reports this instead of simulating them.
- The editor maintains a local editing sequence only; it does not encode a final combined media file.
- Filter and text changes in the shared editor are preview effects, not baked into exported media.
- The audio file is previewed separately and is not mixed/synchronized into video output.
- Download in the shared editor exports the original selected source file, not the edited composition.
- Video splitting currently creates logical timeline segments; it does not physically encode a new video file.
- Comment likes and replies are local demonstration state and are not synchronized to a user account.
- Insights remain illustrative sample metrics and must not be interpreted as real audience performance.
- Object URLs are local to the browser session.

## Technical boundaries

- Keep all work isolated under `app/creator-studio/`.
- Do not delete or overwrite existing feed, Stories, Reels, profile, messaging, or Store flows.
- Do not connect or modify Supabase schema, credentials, or data in this phase.
- No production deploy until build checks, route review, responsive checks, and explicit integration approval are complete.

## Route

`/creator-studio` — isolated preview; no entry point has been added to the live app.
