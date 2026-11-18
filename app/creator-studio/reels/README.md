# Nexora — Criar Reels

Dedicated Reels creation route: `/creator-studio/reels`.

## Visual structure
- Entry: record/import media and start a vertical 9:16 project.
- Edit: preview, select, duplicate, remove and reorder local media.
- Tools: text overlay, filter selection, playback speed, source volume and audio-file selection.
- Publish: choose a cover, write a caption, choose intended audience, and toggle comments / Story sharing.

## Current implementation boundary
- Media is selected from the current device and held in browser memory with object URLs.
- Camera capture uses the browser's native video-capture file picker where supported.
- Filter, text, speed and volume affect the local preview.
- The audio picker records the selected soundtrack name only; soundtrack mixing is not yet implemented in this dedicated route.
- Automatic captions, physical video cutting/splitting, transitions, overlays, and final encoded export are not yet implemented in this route.
- Saving a draft stores metadata in localStorage on this device; it does not upload media.
- The final action prepares a local draft only. It does not publish to a Nexora account or distribute to followers.

## Safety boundaries
- This route is isolated from Story and POST editing.
- No Supabase schema, credentials, or data are changed.
- No production deployment is part of this branch.
