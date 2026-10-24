-- Nexi conversation storage foundation.
-- Applied to Supabase project obkqeiwfeblmwwbouzek on 2026-10-24.
-- This migration intentionally does not alter existing Nexora/CJS tables or data.
create table if not exists public.nexi_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Nova conversa' check (char_length(title) between 1 and 120),
  model_provider text not null default 'self-hosted' check (model_provider in ('self-hosted','external')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexi_conversations_user_updated_idx
  on public.nexi_conversations (user_id, updated_at desc);

create table if not exists public.nexi_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.nexi_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null check (char_length(content) between 1 and 12000),
  created_at timestamptz not null default now()
);

create index if not exists nexi_messages_conversation_created_idx
  on public.nexi_messages (conversation_id, created_at asc);

alter table public.nexi_conversations enable row level security;
alter table public.nexi_messages enable row level security;

drop policy if exists "Users can read own Nexi conversations" on public.nexi_conversations;
create policy "Users can read own Nexi conversations"
  on public.nexi_conversations for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create own Nexi conversations" on public.nexi_conversations;
create policy "Users can create own Nexi conversations"
  on public.nexi_conversations for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own Nexi conversations" on public.nexi_conversations;
create policy "Users can update own Nexi conversations"
  on public.nexi_conversations for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own Nexi conversations" on public.nexi_conversations;
create policy "Users can delete own Nexi conversations"
  on public.nexi_conversations for delete to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can read own Nexi messages" on public.nexi_messages;
create policy "Users can read own Nexi messages"
  on public.nexi_messages for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create own Nexi messages" on public.nexi_messages;
create policy "Users can create own Nexi messages"
  on public.nexi_messages for insert to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.nexi_conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete own Nexi messages" on public.nexi_messages;
create policy "Users can delete own Nexi messages"
  on public.nexi_messages for delete to authenticated
  using (auth.uid() = user_id);
