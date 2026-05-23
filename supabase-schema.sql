-- Run this in the Supabase SQL editor for your project

create table tasks (
  id          uuid        default gen_random_uuid() primary key,
  title       text        not null,
  due_date    date,
  recurring   text        check (recurring in ('daily', 'weekly')),
  completed   boolean     default false,
  completed_at timestamptz,
  created_at  timestamptz default now()
);

-- Allow public read/write (no auth — single shared app)
alter table tasks enable row level security;

create policy "Allow all"
  on tasks for all
  using (true)
  with check (true);
