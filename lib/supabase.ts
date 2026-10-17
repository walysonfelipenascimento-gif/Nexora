import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

/**
 * Browser-only Supabase client. Uses only the publishable key; never put a
 * service-role/secret key in NEXT_PUBLIC_* variables.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return null;

  if (!browserClient) {
    browserClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: { eventsPerSecond: 10 },
      },
    });
  }

  return browserClient;
}

export async function ensureOwnProfile(
  userId: string,
  username: string,
  displayName: string,
) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("A conexão com o Supabase não está configurada.");

  const cleanUsername = username
    .toLowerCase()
    .replace(/[^a-z0-9_.]/g, "")
    .slice(0, 30);

  if (cleanUsername.length < 3) {
    throw new Error("O nome de usuário precisa ter pelo menos 3 caracteres.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        username: cleanUsername,
        display_name: displayName.trim().slice(0, 80) || "Pessoa Nexora",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function uploadNexoraMedia(file: File, userId: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("A conexão com o Supabase não está configurada.");

  const allowedTypes = new Set([
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "video/mp4", "video/webm", "audio/mpeg", "audio/mp4", "audio/webm",
  ]);

  if (!allowedTypes.has(file.type)) {
    throw new Error("Formato de arquivo não permitido.");
  }
  if (file.size > 50 * 1024 * 1024) {
    throw new Error("O arquivo deve ter no máximo 50 MB.");
  }

  const safeName = file.name
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .slice(-100);
  const path = `${userId}/${crypto.randomUUID()}-${safeName || "media"}`;

  const { error } = await supabase.storage
    .from("nexora-media")
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) throw error;

  const { data, error: urlError } = await supabase.storage
    .from("nexora-media")
    .createSignedUrl(path, 60 * 60 * 24 * 7);

  if (urlError) throw urlError;
  return { path, signedUrl: data.signedUrl };
}
