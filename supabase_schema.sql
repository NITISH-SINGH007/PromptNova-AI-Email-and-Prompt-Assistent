-- Create the prompts table
create table public.prompts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  context text not null,
  task text not null,
  instruction text not null,
  data text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.prompts enable row level security;

-- Create policies
create policy "Users can view their own prompts"
  on public.prompts for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own prompts"
  on public.prompts for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own prompts"
  on public.prompts for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own prompts"
  on public.prompts for delete
  using ( auth.uid() = user_id );
