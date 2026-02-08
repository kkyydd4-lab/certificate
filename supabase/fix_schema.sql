-- [Repair Script] Exam Schema with Policy Reset
-- This script safely drops old policies to avoid "already exists" errors (42710)

-- A. DROP EXISTING POLICIES (Clean Slate)
drop policy if exists "Instructors can manage questions" on public.questions;
drop policy if exists "Anyone can view active exams" on public.exams;
drop policy if exists "Instructors can manage exams" on public.exams;
drop policy if exists "Public view for active exams" on public.exam_questions;
drop policy if exists "Instructors manage exam questions" on public.exam_questions;
drop policy if exists "Users manage own submissions" on public.exam_submissions;
drop policy if exists "Instructors view all submissions" on public.exam_submissions;

-- B. CREATE TABLES (If Not Exist)
-- 1. Question Bank
create table if not exists public.questions (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  type text check (type in ('multiple_choice', 'essay', 'true_false')) default 'multiple_choice',
  options jsonb,
  correct_answer text,
  explanation text,
  category text,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')) default 'medium',
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Exams
create table if not exists public.exams (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  time_limit integer, -- in minutes
  passing_score integer default 60,
  is_active boolean default false,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Exam Questions (Many-to-Many)
create table if not exists public.exam_questions (
  exam_id uuid references public.exams(id) on delete cascade,
  question_id uuid references public.questions(id) on delete cascade,
  "order" integer default 0,
  points integer default 10,
  primary key (exam_id, question_id)
);

-- 4. Exam Submissions
create table if not exists public.exam_submissions (
  id uuid default gen_random_uuid() primary key,
  exam_id uuid references public.exams(id),
  user_id uuid references public.profiles(id),
  score integer,
  status text check (status in ('in_progress', 'submitted', 'graded')) default 'in_progress',
  answers jsonb,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  submitted_at timestamp with time zone,
  unique(exam_id, user_id)
);

-- C. RE-APPLY RLS & POLICIES
alter table public.questions enable row level security;
alter table public.exams enable row level security;
alter table public.exam_questions enable row level security;
alter table public.exam_submissions enable row level security;

-- Questions Policies
create policy "Instructors can manage questions" on public.questions
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor')));

-- Exams Policies
create policy "Anyone can view active exams" on public.exams
  for select using (is_active = true);

create policy "Instructors can manage exams" on public.exams
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor')));

-- Exam Questions Policies
create policy "Public view for active exams" on public.exam_questions
  for select using (exists (select 1 from public.exams where id = exam_questions.exam_id and is_active = true));

create policy "Instructors manage exam questions" on public.exam_questions
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor')));

-- Submissions Policies
create policy "Users manage own submissions" on public.exam_submissions
  using (auth.uid() = user_id);

create policy "Instructors view all submissions" on public.exam_submissions
  for select using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor')));
