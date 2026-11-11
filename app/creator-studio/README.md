# Nexora Creator Studio — isolated implementation

## Confirmed product decisions

This module is developed on an isolated preview branch. The five user-provided reference images define the visual and interaction direction.

1. Story capture and preview with browser camera permission, photo capture, gallery import, preview filters, audience selection and local file saving.
2. POST and REELS share one editing core; format selection changes the composition preset.
3. Creator analytics currently use explicitly illustrative sample data, not account analytics.
4. Editorial calendar supports real dates, local draft creation, media selection, date/time, format, removal, month navigation, and browser-local persistence.
5. Comments support local likes, replies and new comments; these are not connected to account data.
6. LIVE remains visible as a future creation mode; its dedicated interface and streaming flow are deferred until separately specified.
7. AI Creator and AI content generation are excluded from this Creator Studio scope and navigation.

## Story — implemented browser capabilities

- Request camera permission through `getUserMedia`, prefer the rear camera where available, display the live camera preview and stop camera tracks when leaving/unmounting.
- Capture a still photo from the camera preview with the selected filter baked into the saved image.
- Record video with the browser MediaRecorder API, including microphone audio when permission is available; fall back to silent video if microphone access is unavailable.
- Import an image or video from the device gallery and preview it.
- Apply the selected browser filter to gallery media and bake it into locally exported images and videos; source audio is retained when the browser exposes capture tracks.
- Add editable caption text to the preview.
- Choose an intended audience for the draft and save the processed media file locally.
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

- The Story audience selector is a draft preference only and is not enforced by a publishing service.
- Story Boomerang and multi-frame Layout modes are not implemented; the UI reports this instead of simulating them.
- The editor maintains a local editing sequence only; it does not encode a final combined media file.
- Filter and text changes in the shared editor are preview effects, not baked into exported media.
- The audio file is previewed separately and is not mixed/synchronized into video output.
- Download in the shared editor exports the original selected source file, not the edited composition.
- Video splitting currently creates logical timeline segments; it does not physically encode a new video file.
- Comment likes and replies are local demonstration state and are not synchronized to a user account.
- Insights remain illustrative sample metrics and must not be interpreted as real audience performance.
- Camera capture stores the original recording first; the local export pass applies the selected filter and burns text/sticker overlays into the exported copy.
- Object URLs are local to the browser session.

## Technical boundaries

- Keep all work isolated under `app/creator-studio/`.
- Do not delete or overwrite existing feed, Stories, Reels, profile, messaging, or Store flows.
- Do not connect or modify Supabase schema, credentials, or data in this phase.
- No production deploy until build checks, route review, responsive checks, and explicit integration approval are complete.

## Route

`/creator-studio` — isolated preview route. The branch also wires the creation hub to this route; it becomes available in the live app only after the draft is reviewed and integrated.


## Story — multi-screen creation flow

The Story experience is a dedicated, full-screen flow with separate camera, media preview/editor, tool panels, and share-review screens.

- Camera screen follows the supplied camera reference: top controls, vertical quick tools, capture/gallery controls, and POST / STORY / REEL / LIVE mode strip.
- Preview screen keeps the selected photo/video while the user edits it.
- Text tool supports editable caption text; sticker tool supports selectable overlays; effect tool applies the available filters.
- Text and sticker overlays are included in locally exported image/video output.
- Music tool imports a local audio file, previews it, and mixes it into exported video; a still image with music is exported as a short video.
- Share-review screen allows choosing the intended audience and returning to editing or saving the media locally.
- The final screen offers both local media export and local Feed publishing. Publishing stores the media in the shared Nexora IndexedDB media store and writes a 24-hour entry to `nexora-local-stories-v1`, which the existing home Story rail restores. Cross-account distribution, enforced audience privacy, and server upload remain reserved for the final Supabase integration.
- The infinity tool records a short looping clip (repeated forward, not a true reverse Boomerang); Layout creates a 2–4 photo collage; torch control is enabled only on devices that expose the camera torch. LIVE streaming is not implemented.
- The local Story publish action is intentionally compatible with the existing home feed storage and does not activate Supabase or claim cross-account publication.
