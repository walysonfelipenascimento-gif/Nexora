# Nexora — Criar Reels

Dedicated Reels creation flow at `/creator-studio/reels`, isolated from the shared POST editor and Story studio.

## Five-screen flow
1. **Create:** camera capture picker and multi-file gallery import.
2. **Edit:** vertical 9:16 preview, clip selection, duplicate, remove and reorder.
3. **Timeline:** visual clip strip, playhead, video trim-in/trim-out, still-image duration and split-at-playhead.
4. **Tools:** text overlay, lower caption track, image overlay, filters, speed, source/music volume and cut/fade-to-black transition.
5. **Publish:** cover selection, caption, audience/comment/Story-share settings and local video export.

## Local functionality
- Media remains on the device; object URLs are released when the editor unmounts.
- The draft is persisted in IndexedDB, including selected media files, soundtrack and overlay image, and can be restored on this device.
- Export renders a 720×1280 vertical video through Canvas + MediaRecorder and Web Audio. It mixes source-video audio with an optional soundtrack, applies the selected filter, speed, text, lower captions, image overlay and transition. The browser's supported encoder determines MP4 or WebM output.
- Export requires browser support for Canvas capture, MediaRecorder and Web Audio. Unsupported environments show an explicit error rather than silently downloading the original media.
- Camera capture uses the native browser/device capture picker where supported; the browser may offer its own camera/gallery selection UI.

## Deliberate integration boundary
- The export creates a local file only. It does not upload or publish to a Nexora account, send notifications, share to Stories, or distribute to followers.
- Audience, comments and Story-sharing choices are saved with the local draft as publication settings; they are not applied to a live account until the publishing backend is connected.
- No Supabase schema, credentials, existing Story code, or production deployment is changed in this branch.
- Automatic speech-to-text captions, multi-layer audio tracks, animated transitions, and frame-accurate multi-track compositing are not included in this first local editor iteration.
