-- [COMPLETE RESET SCRIPT] Exam Schema - 데이터 초기화 및 재설치
-- 기존에 꼬인 테이블/정책을 모두 삭제(DROP)하고, 깨끗하게 새로 만듭니다.
-- 주의: 기존 시험 데이터(exams, questions, submissions)가 모두 삭제됩니다.

-- 1. DROP EXISTING TABLES (CASCADE로 연관된 정책/FK 모두 삭제)
DROP TABLE IF EXISTS public.exam_submissions CASCADE;
DROP TABLE IF EXISTS public.exam_questions CASCADE;
DROP TABLE IF EXISTS public.exams CASCADE;
DROP TABLE IF EXISTS public.questions CASCADE;

-- 2. CREATE TABLES (새로 생성)

-- 2.1. 문제 은행 (Questions)
create table public.questions (
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

-- 2.2. 시험 (Exams)
create table public.exams (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  time_limit integer,
  passing_score integer default 60,
  is_active boolean default false,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2.3. 시험-문제 연결 (Exam Questions)
create table public.exam_questions (
  exam_id uuid references public.exams(id) on delete cascade,
  question_id uuid references public.questions(id) on delete cascade,
  "order" integer default 0,
  points integer default 10,
  primary key (exam_id, question_id)
);

-- 2.4. 시험 응시/제출 (Submissions)
create table public.exam_submissions (
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

-- 3. ENABLE RLS & CREATE POLICIES (보안 정책 재설정)

-- Questions RLS
alter table public.questions enable row level security;
create policy "Instructors can manage questions" on public.questions
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor')));

-- Exams RLS
alter table public.exams enable row level security;
create policy "Anyone can view active exams" on public.exams
  for select using (is_active = true);

create policy "Instructors can manage exams" on public.exams
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor')));

-- Exam Questions RLS
alter table public.exam_questions enable row level security;
create policy "Public view for active exams" on public.exam_questions
  for select using (exists (select 1 from public.exams where id = exam_questions.exam_id and is_active = true));

create policy "Instructors manage exam questions" on public.exam_questions
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor')));

-- Submissions RLS
alter table public.exam_submissions enable row level security;
create policy "Users manage own submissions" on public.exam_submissions
  using (auth.uid() = user_id);

create policy "Instructors view all submissions" on public.exam_submissions
  for select using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor')));
