-- 1. Extend Courses Table
alter table public.courses 
add column if not exists thumbnail_url text,
add column if not exists instructor_id uuid references public.profiles(id);

-- 2. Modules Table (Sections)
create table public.modules (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.modules enable row level security;

create policy "Public modules are viewable by everyone." on public.modules
  for select using (true);
  
create policy "Instructors can manage modules." on public.modules
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role in ('admin', 'instructor')
    )
  );

-- 3. Lessons Table
create table public.lessons (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  type text check (type in ('video', 'text', 'quiz')) default 'video',
  content text, -- Video URL or Markdown text
  duration integer default 0, -- Seconds
  "order" integer default 0,
  is_free boolean default false, -- Preview available?
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lessons enable row level security;

create policy "Public lessons are viewable by everyone." on public.lessons
  for select using (true);

create policy "Instructors can manage lessons." on public.lessons
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role in ('admin', 'instructor')
    )
  );

-- 4. Lesson Progress Table
create table public.lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  completed boolean default false,
  last_watched_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

create policy "Users can manage own progress." on public.lesson_progress
  for all using (auth.uid() = user_id);
