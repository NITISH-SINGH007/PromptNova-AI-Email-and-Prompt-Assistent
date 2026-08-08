-- Create the email_analyses table
create table public.email_analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  raw_email text not null,
  summary text not null,
  priority text not null,
  tasks jsonb not null default '[]'::jsonb,
  is_spam boolean not null default false,
  smart_replies jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.email_analyses enable row level security;

-- Create policies
create policy "Users can view their own email analyses"
  on public.email_analyses for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own email analyses"
  on public.email_analyses for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own email analyses"
  on public.email_analyses for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own email analyses"
  on public.email_analyses for delete
  using ( auth.uid() = user_id );
