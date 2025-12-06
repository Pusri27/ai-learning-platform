-- CHAT MESSAGES
create table if not exists chat_messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default now()
);

-- RLS
alter table chat_messages enable row level security;

create policy "Users can view own chat messages." on chat_messages
  for select using (auth.uid() = user_id);

create policy "Users can insert own chat messages." on chat_messages
  for insert with check (auth.uid() = user_id);
