export type NexoraCameraFacingMode = "user" | "environment";

type NexoraCameraOptions = {
  facingMode?: NexoraCameraFacingMode;
  audio?: boolean;
};

/**
 * Shared camera profile for every in-app Nexora capture surface.
 * Ideal constraints ask the browser for the best camera mode available;
 * they do not force unsupported resolutions on older devices.
 */
export async function getNexoraCameraStream({
  facingMode = "environment",
  audio = false,
}: NexoraCameraOptions = {}): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Este navegador não oferece acesso direto à câmera.");
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: { ideal: facingMode },
      width: { ideal: 3840 },
      height: { ideal: 2160 },
      frameRate: { ideal: 60 },
    },
    audio: audio
      ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      : false,
  });

  const track = stream.getVideoTracks()[0];
  if (track) {
    // Keep continuous autofocus/exposure when the device exposes those modes.
    try {
      const capabilities = track.getCapabilities() as MediaTrackCapabilities & {
        focusMode?: string[];
        exposureMode?: string[];
        whiteBalanceMode?: string[];
      };
      const advanced: MediaTrackConstraintSet[] = [];
      if (capabilities.focusMode?.includes("continuous")) {
        advanced.push({ focusMode: "continuous" } as MediaTrackConstraintSet);
      }
      if (capabilities.exposureMode?.includes("continuous")) {
        advanced.push({ exposureMode: "continuous" } as MediaTrackConstraintSet);
      }
      if (capabilities.whiteBalanceMode?.includes("continuous")) {
        advanced.push({ whiteBalanceMode: "continuous" } as MediaTrackConstraintSet);
      }
      if (advanced.length) await track.applyConstraints({ advanced });
    } catch {
      // Unsupported optional camera controls must never prevent camera access.
    }
  }

  return stream;
}

export function getNexoraRecorderOptions(
  stream: MediaStream,
  preferredMimeTypes: string[],
): MediaRecorderOptions {
  const mimeType = preferredMimeTypes.find((type) => MediaRecorder.isTypeSupported(type));
  const track = stream.getVideoTracks()[0];
  const settings = track?.getSettings();
  const pixels = (settings?.width ?? 1920) * (settings?.height ?? 1080);
  const videoBitsPerSecond = pixels >= 7_000_000 ? 32_000_000 : pixels >= 2_000_000 ? 16_000_000 : 8_000_000;

  return {
    ...(mimeType ? { mimeType } : {}),
    videoBitsPerSecond,
    audioBitsPerSecond: 192_000,
  };
}

export async function captureNexoraPhoto(
  video: HTMLVideoElement,
  stream: MediaStream,
): Promise<Blob> {
  const track = stream.getVideoTracks()[0];
  const ImageCaptureConstructor = typeof window !== "undefined"
    ? (window as Window & { ImageCapture?: new (track: MediaStreamTrack) => { takePhoto(): Promise<Blob> } }).ImageCapture
    : undefined;

  if (track && ImageCaptureConstructor) {
    try {
      const photo = await new ImageCaptureConstructor(track).takePhoto();
      if (photo.size) return photo;
    } catch {
      // Fall through to a full-resolution frame capture.
    }
  }

  if (!video.videoWidth || !video.videoHeight) {
    throw new Error("A câmera ainda está preparando a imagem.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Não foi possível preparar a captura.");

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error("Não foi possível gerar a foto.")),
      "image/jpeg",
      0.98,
    );
  });
}
