export type ReelsMedia = {
  id: string;
  file: File;
  url: string;
  kind: "video" | "image";
  start: number;
  end: number;
  duration: number;
};

export type ReelsRenderOptions = {
  clips: ReelsMedia[];
  soundtrack?: File | null;
  overlayImage?: File | null;
  text: string;
  subtitle: string;
  filter: string;
  originalVolume: number;
  soundtrackVolume: number;
  speed: number;
  transition: "cut" | "fade";
  onProgress?: (progress: number) => void;
};

function drawCover(context: CanvasRenderingContext2D, source: CanvasImageSource, width: number, height: number) {
  const dimensions = source instanceof HTMLVideoElement
    ? { width: source.videoWidth, height: source.videoHeight }
    : source instanceof HTMLImageElement
      ? { width: source.naturalWidth, height: source.naturalHeight }
      : { width: width, height: height };
  if (!dimensions.width || !dimensions.height) return;
  const scale = Math.max(width / dimensions.width, height / dimensions.height);
  const sw = width / scale;
  const sh = height / scale;
  const sx = (dimensions.width - sw) / 2;
  const sy = (dimensions.height - sh) / 2;
  context.drawImage(source, sx, sy, sw, sh, 0, 0, width, height);
}

function drawText(context: CanvasRenderingContext2D, text: string, width: number, height: number, y: number, size: number) {
  if (!text.trim()) return;
  const lines = text.split("\n").slice(0, 4);
  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `800 ${size}px Arial, sans-serif`;
  context.lineJoin = "round";
  context.strokeStyle = "rgba(0,0,0,.78)";
  context.lineWidth = Math.max(5, size * .16);
  context.fillStyle = "#fff";
  lines.forEach((line, index) => {
    const yy = y + (index - (lines.length - 1) / 2) * size * 1.2;
    context.strokeText(line.slice(0, 90), width / 2, yy, width * .86);
    context.fillText(line.slice(0, 90), width / 2, yy, width * .86);
  });
  context.restore();
}

export async function renderReels(options: ReelsRenderOptions): Promise<{ blob: Blob; extension: "mp4" | "webm" }> {
  if (!options.clips.length) throw new Error("Adicione ao menos uma mídia antes de exportar.");
  if (!("MediaRecorder" in window) || !HTMLCanvasElement.prototype.captureStream) {
    throw new Error("Este navegador não oferece exportação de vídeo. Atualize o navegador ou use outro compatível.");
  }

  const width = 720;
  const height = 1280;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Não foi possível preparar a renderização.");
  const canvasStream = canvas.captureStream(30);
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) throw new Error("Este navegador não oferece suporte à mixagem de áudio necessária para exportar o Reels.");
  const audioContext = new AudioContextClass();
  const destination = audioContext.createMediaStreamDestination();
  if (destination) destination.stream.getAudioTracks().forEach((track) => canvasStream.addTrack(track));

  const video = document.createElement("video");
  video.playsInline = true;
  video.preload = "auto";
  video.muted = false;
  video.volume = Math.max(0, Math.min(1, options.originalVolume));
  video.playbackRate = Math.max(.25, Math.min(2, options.speed));
  video.style.position = "fixed";
  video.style.left = "-10000px";
  document.body.appendChild(video);

  let videoSource: MediaElementAudioSourceNode | null = null;
  let videoGain: GainNode | null = null;
  let music: HTMLAudioElement | null = null;
  let musicSource: MediaElementAudioSourceNode | null = null;
  let musicGain: GainNode | null = null;
  let overlayUrl = "";
  let overlayImage: HTMLImageElement | null = null;
  let recorder: MediaRecorder | null = null;
  let animation = 0;
  let completed = 0;
  const durations = options.clips.map((clip) => clip.kind === "image" ? Math.max(1, clip.duration || 3) : Math.max(.25, (clip.end || clip.duration) - clip.start) / options.speed);
  const totalDuration = durations.reduce((sum, value) => sum + value, 0);
  const mimeType = ["video/mp4;codecs=avc1.42E01E,mp4a.40.2", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].find((type) => MediaRecorder.isTypeSupported(type));
  const chunks: Blob[] = [];

  const drawFrame = (source: CanvasImageSource, opacity = 1) => {
    context.save();
    context.globalAlpha = opacity;
    context.filter = options.filter || "none";
    drawCover(context, source, width, height);
    context.restore();
    if (overlayImage) {
      context.save();
      context.globalAlpha = .96;
      const w = width * .24;
      const h = w * (overlayImage.naturalHeight / overlayImage.naturalWidth);
      context.drawImage(overlayImage, width - w - 28, 36, w, Math.min(h, height * .3));
      context.restore();
    }
    drawText(context, options.text, width, height, height * .48, 58);
    drawText(context, options.subtitle, width, height, height * .86, 31);
  };

  try {
    if (audioContext) await audioContext.resume();
    if (destination && audioContext) {
      videoSource = audioContext.createMediaElementSource(video);
      videoGain = audioContext.createGain();
      videoGain.gain.value = Math.max(0, Math.min(1, options.originalVolume));
      videoSource.connect(videoGain).connect(destination);
      if (options.soundtrack) {
        music = document.createElement("audio");
        music.src = URL.createObjectURL(options.soundtrack);
        music.loop = true;
        music.preload = "auto";
        musicSource = audioContext.createMediaElementSource(music);
        musicGain = audioContext.createGain();
        musicGain.gain.value = Math.max(0, Math.min(1, options.soundtrackVolume));
        musicSource.connect(musicGain).connect(destination);
      }
    }
    if (options.overlayImage) {
      overlayUrl = URL.createObjectURL(options.overlayImage);
      overlayImage = new Image();
      overlayImage.src = overlayUrl;
      await overlayImage.decode();
    }

    const streamRecorder = new MediaRecorder(canvasStream, mimeType ? { mimeType } : undefined);
    recorder = streamRecorder;
    streamRecorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
    const stopped = new Promise<Blob>((resolve, reject) => {
      streamRecorder.onerror = () => reject(new Error("O navegador encontrou um erro durante a exportação."));
      streamRecorder.onstop = () => {
        const result = new Blob(chunks, { type: streamRecorder.mimeType || mimeType || "video/webm" });
        if (result.size) resolve(result);
        else reject(new Error("A exportação terminou sem gerar um arquivo."));
      };
    });
    streamRecorder.start(250);
    if (music) {
      try { await music.play(); } catch { /* The user gesture normally unlocks audio; continue with video if blocked. */ }
    }

    for (let index = 0; index < options.clips.length; index += 1) {
      const clip = options.clips[index];
      const durationMs = durations[index] * 1000;
      const startAt = performance.now();
      if (clip.kind === "image") {
        const image = new Image();
        image.src = clip.url;
        await image.decode();
        await new Promise<void>((resolve) => {
          const frame = (now: number) => {
            const elapsed = now - startAt;
            const fade = options.transition === "fade" ? Math.min(1, elapsed / 300, (durationMs - elapsed) / 300) : 1;
            drawFrame(image, Math.max(0, fade));
            options.onProgress?.(Math.min(99, Math.round((completed + Math.min(elapsed, durationMs)) / totalDuration * 100)));
            if (elapsed >= durationMs) resolve();
            else animation = requestAnimationFrame(frame);
          };
          animation = requestAnimationFrame(frame);
        });
      } else {
        video.pause();
        video.src = clip.url;
        video.currentTime = clip.start;
        await new Promise<void>((resolve, reject) => {
          const ready = () => { video.removeEventListener("loadeddata", ready); resolve(); };
          video.addEventListener("loadeddata", ready, { once: true });
          video.addEventListener("error", () => reject(new Error("Um dos vídeos não pôde ser decodificado.")), { once: true });
          video.load();
        });
        video.playbackRate = Math.max(.25, Math.min(2, options.speed));
        video.volume = Math.max(0, Math.min(1, options.originalVolume));
        await video.play();
        await new Promise<void>((resolve) => {
          const frame = (now: number) => {
            const elapsed = now - startAt;
            const clipEnd = clip.end || video.duration;
            const fade = options.transition === "fade" ? Math.min(1, elapsed / 300, (durationMs - elapsed) / 300) : 1;
            drawFrame(video, Math.max(0, fade));
            options.onProgress?.(Math.min(99, Math.round((completed + Math.min(elapsed, durationMs)) / totalDuration * 100)));
            if (video.currentTime >= clipEnd || elapsed >= durationMs || video.ended) {
              video.pause();
              resolve();
            } else {
              animation = requestAnimationFrame(frame);
            }
          };
          animation = requestAnimationFrame(frame);
        });
      }
      completed += durationMs;
    }

    if (music) music.pause();
    streamRecorder.stop();
    const blob = await stopped;
    options.onProgress?.(100);
    return { blob, extension: blob.type.includes("mp4") ? "mp4" : "webm" };
  } catch (error) {
    if (recorder?.state === "recording") recorder.stop();
    throw error;
  } finally {
    if (animation) cancelAnimationFrame(animation);
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.remove();
    music?.pause();
    if (music?.src) URL.revokeObjectURL(music.src);
    if (overlayUrl) URL.revokeObjectURL(overlayUrl);
    canvasStream.getTracks().forEach((track) => track.stop());
    if (audioContext && audioContext.state !== "closed") await audioContext.close();
  }
}
