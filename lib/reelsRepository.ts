import type { User } from "@supabase/supabase-js";
import { ensureOwnProfile, getSupabaseBrowserClient } from "./supabase";

export type StoredReel = {
  id: string;
  user_id: string;
  caption: string;
  image_url: string | null;
  media_path: string | null;
  media_type: "video" | "image" | null;
  post_type: "post" | "reel";
  created_at: string;
  view_count: number;
  share_count: number;
  profile: { username: string; display_name: string; avatar_url: string | null };
  likes_count: number;
  comments_count: number;
};

async function ensureUserProfile(supabase: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>, user: User) {
  const { data, error } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();
  if (error) throw error;
  if (data) return;
  const metadata = user.user_metadata || {};
  const username = typeof metadata.username === "string" && metadata.username.trim().length >= 3
    ? metadata.username
    : "user_" + user.id.replace(/-/g, "").slice(0, 12);
  const displayName = typeof metadata.display_name === "string" && metadata.display_name.trim()
    ? metadata.display_name
    : username;
  await ensureOwnProfile(user.id, username, displayName);
}

export async function getCurrentNexoraUser(): Promise<User | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

export async function signInNexora(email: string, password: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("A conexão segura com o Supabase não está configurada.");
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
  if (data.user) await ensureUserProfile(supabase, data.user);
  return data.user;
}

export async function signUpNexora(email: string, password: string, username: string, displayName: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("A conexão segura com o Supabase não está configurada.");
  if (password.length < 8) throw new Error("Use uma senha com pelo menos 8 caracteres.");
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: { data: { username: username.trim().toLowerCase(), display_name: displayName.trim() } },
  });
  if (error) throw error;
  if (data.user && data.session) {
    await ensureOwnProfile(data.user.id, username, displayName);
  }
  return { user: data.user, needsEmailConfirmation: Boolean(data.user && !data.session) };
}

export async function signOutNexora() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function publishReelToSupabase(input: {
  file: File;
  caption: string;
  username: string;
  displayName: string;
}): Promise<StoredReel> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("A conexão com o Supabase não está configurada.");
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error("Entre na sua conta para publicar um Reel.");
  const user = authData.user;

  if (!input.file.type.startsWith("video/")) throw new Error("Reels aceitam apenas arquivos de vídeo.");
  if (input.file.size > 100 * 1024 * 1024) throw new Error("O vídeo precisa ter no máximo 100 MB.");

  await ensureOwnProfile(user.id, input.username, input.displayName);
  const ext = input.file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "mp4";
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage.from("nexora-reels").upload(path, input.file, {
    upsert: false,
    contentType: input.file.type,
    cacheControl: "3600",
  });
  if (uploadError) throw uploadError;

  const { data: publicData } = supabase.storage.from("nexora-reels").getPublicUrl(path);
  const { data, error } = await supabase.from("posts").insert({
    user_id: user.id,
    caption: input.caption.trim().slice(0, 2200),
    image_url: publicData.publicUrl,
    media_path: path,
    media_type: "video",
    post_type: "reel",
  }).select("id,user_id,caption,image_url,media_path,media_type,post_type,created_at,view_count,share_count").single();

  if (error) {
    await supabase.storage.from("nexora-reels").remove([path]);
    throw error;
  }

  return {
    ...data,
    profile: {
      username: input.username.trim().toLowerCase(),
      display_name: input.displayName.trim() || input.username.trim(),
      avatar_url: null,
    },
    likes_count: 0,
    comments_count: 0,
  } as StoredReel;
}

export async function fetchStoredReels(): Promise<StoredReel[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("posts")
    .select("id,user_id,caption,image_url,media_path,media_type,post_type,created_at,view_count,share_count,profiles!posts_user_id_fkey(username,display_name,avatar_url),likes(count),comments(count)")
    .eq("post_type", "reel")
    .eq("media_type", "video")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;

  return (data || []).map((row: any) => {
    // Reconstroi a URL pública pelo caminho do Storage se image_url estiver ausente.
    const storageUrl = row.media_path
      ? supabase.storage.from("nexora-reels").getPublicUrl(row.media_path).data.publicUrl
      : null;
    return {
      id: row.id,
      user_id: row.user_id,
      caption: row.caption || "",
      image_url: storageUrl || row.image_url || null,
    media_path: row.media_path || null,
    media_type: row.media_type,
    post_type: row.post_type,
    created_at: row.created_at,
    view_count: Number(row.view_count || 0),
    share_count: Number(row.share_count || 0),
    profile: Array.isArray(row.profiles) ? row.profiles[0] : row.profiles || { username: "criador", display_name: "Criador Nexora", avatar_url: null },
    likes_count: Number(row.likes?.[0]?.count || 0),
      comments_count: Number(row.comments?.[0]?.count || 0),
    };
  });
}

export async function toggleStoredLike(postId: string, liked: boolean) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase não está configurado.");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Entre na sua conta para curtir.");
  await ensureUserProfile(supabase, user);
  if (liked) {
    const { error } = await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", user.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("likes").upsert({ post_id: postId, user_id: user.id }, { onConflict: "post_id,user_id", ignoreDuplicates: true });
    if (error) throw error;
  }
}

export async function toggleStoredRelation(table: "post_saves" | "post_reposts", postId: string, active: boolean) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase não está configurado.");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Entre na sua conta para usar este recurso.");
  await ensureUserProfile(supabase, user);
  if (active) {
    const { error } = await supabase.from(table).delete().eq("post_id", postId).eq("user_id", user.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from(table).upsert({ post_id: postId, user_id: user.id }, { onConflict: "post_id,user_id", ignoreDuplicates: true });
    if (error) throw error;
  }
}

export async function addStoredComment(postId: string, body: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase não está configurado.");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Entre na sua conta para comentar.");
  await ensureUserProfile(supabase, user);
  const { error } = await supabase.from("comments").insert({ post_id: postId, user_id: user.id, body: body.trim().slice(0, 1000) });
  if (error) throw error;
}

export async function fetchStoredComments(postId: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("comments")
    .select("id,body,created_at,user_id,profiles!comments_user_id_fkey(username,display_name,avatar_url)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .limit(200);
  if (error) throw error;
  return (data || []).map((row: any) => ({
    id: row.id,
    body: row.body,
    created_at: row.created_at,
    user_id: row.user_id,
    profile: Array.isArray(row.profiles) ? row.profiles[0] : row.profiles,
  }));
}

export async function recordStoredView(postId: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return false;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  await ensureUserProfile(supabase, user);
  const { data, error } = await supabase.from("post_views").upsert({ post_id: postId, user_id: user.id }, { onConflict: "post_id,user_id", ignoreDuplicates: true }).select("post_id");
  if (error) throw error;
  return Boolean(data?.length);
}

export async function recordStoredShare(postId: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase não está configurado.");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Entre na sua conta para registrar o compartilhamento.");
  await ensureUserProfile(supabase, user);
  const { error } = await supabase.from("post_shares").insert({ post_id: postId, user_id: user.id });
  if (error) throw error;
}

export async function getStoredUserRelations(postIds: string[]) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase || postIds.length === 0) return { liked: [] as string[], saved: [] as string[], reposted: [] as string[] };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { liked: [], saved: [], reposted: [] };
  const [likes, saves, reposts] = await Promise.all([
    supabase.from("likes").select("post_id").eq("user_id", user.id).in("post_id", postIds),
    supabase.from("post_saves").select("post_id").eq("user_id", user.id).in("post_id", postIds),
    supabase.from("post_reposts").select("post_id").eq("user_id", user.id).in("post_id", postIds),
  ]);
  if (likes.error) throw likes.error;
  if (saves.error) throw saves.error;
  if (reposts.error) throw reposts.error;
  return {
    liked: (likes.data || []).map((row) => row.post_id),
    saved: (saves.data || []).map((row) => row.post_id),
    reposted: (reposts.data || []).map((row) => row.post_id),
  };
}
