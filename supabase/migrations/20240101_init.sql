-- Create table
create table bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table bookmarks enable row level security;

-- Policies
create policy "Users can view their own bookmarks"
  on bookmarks for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own bookmarks"
  on bookmarks for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own bookmarks"
  on bookmarks for delete
  using ( auth.uid() = user_id );

-- Enable Realtime
-- NOTE: You must also enable Realtime in the Supabase Dashboard for the 'bookmarks' table
-- Database -> Replication -> Source -> select 'bookmarks'
alter publication supabase_realtime add table bookmarks;
