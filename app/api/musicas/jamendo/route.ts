import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const JAMENDO_ENDPOINT = "https://api.jamendo.com/v3.0/tracks/";

type JamendoTrack = {
  id: string;
  name: string;
  artist_name: string;
  album_name?: string;
  duration?: number;
  image?: string;
  audio?: string;
  audiodownload?: string;
  license_ccurl?: string;
  shareurl?: string;
  musicinfo?: { tags?: { genres?: string[]; instruments?: string[]; vartists?: string[] } };
};

export async function GET(request: NextRequest) {
  const clientId = process.env.JAMENDO_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      {
        error: "jamendo_not_configured",
        message: "A pesquisa musical ainda precisa do JAMENDO_CLIENT_ID nas variáveis de ambiente do Render.",
        tracks: [],
      },
      { status: 503 },
    );
  }

  const query = (request.nextUrl.searchParams.get("q") || "").trim().slice(0, 100);
  const genre = (request.nextUrl.searchParams.get("genre") || "").trim().slice(0, 60);
  const page = Math.max(1, Math.min(10, Number(request.nextUrl.searchParams.get("page") || "1") || 1));

  const params = new URLSearchParams({
    client_id: clientId,
    format: "json",
    limit: "20",
    offset: String((page - 1) * 20),
    order: "popularity_total",
    include: "musicinfo",
    audioformat: "mp31",
    imagesize: "300",
  });
  if (query) params.set("namesearch", query);
  if (genre) params.set("tags", genre);

  try {
    const response = await fetch(`${JAMENDO_ENDPOINT}?${params.toString()}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
      next: { revalidate: 300 },
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: "jamendo_upstream_error", message: "O Jamendo não respondeu à pesquisa.", tracks: [] },
        { status: 502 },
      );
    }

    const payload = await response.json();
    if (payload?.headers?.status !== "success" || !Array.isArray(payload?.results)) {
      return NextResponse.json(
        { error: "jamendo_invalid_response", message: "A resposta do catálogo musical não pôde ser validada.", tracks: [] },
        { status: 502 },
      );
    }

    const tracks = (payload.results as JamendoTrack[]).map((track) => ({
      provider: "Jamendo",
      providerId: track.id,
      title: track.name,
      artist: track.artist_name,
      album: track.album_name || null,
      durationSeconds: Number.isFinite(track.duration) ? track.duration : null,
      imageUrl: track.image || null,
      previewUrl: track.audio || null,
      licenseUrl: track.license_ccurl || null,
      sourceUrl: track.shareurl || `https://www.jamendo.com/track/${encodeURIComponent(track.id)}`,
      genres: track.musicinfo?.tags?.genres || [],
      rightsStatus: "requires_review",
      canUseInPosts: false,
      notice: "Faixa encontrada para análise. A licença e os direitos para posts, vídeos, Stories e Notas ainda precisam ser verificados antes de liberar o uso na Nexora.",
    }));

    return NextResponse.json(
      { provider: "Jamendo", page, total: payload.headers?.results_count ?? tracks.length, tracks },
      { headers: { "Cache-Control": "private, max-age=60" } },
    );
  } catch {
    return NextResponse.json(
      { error: "jamendo_unavailable", message: "Não foi possível consultar o catálogo musical agora.", tracks: [] },
      { status: 502 },
    );
  }
}
