-- 5. Question Bank
create table public.questions (
  id uuid default gen_random_uuid() primary key,
  content text not null, -- Question text (markdown supported)
  type text check (type in ('multiple_choice', 'essay', 'true_false')) default 'multiple_choice',
  options jsonb, -- Array of options for MCQs e.g. [{"id": "a", "text": "Option A"}, ...]
  correct_answer text, -- For auto-grading (e.g. "a" or "true")
  explanation text, -- Shown after submission
  category text, -- Tags or filtering
  difficulty text check (difficulty in ('easy', 'medium', 'hard')) default 'medium',
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.questions enable row level security;

-- Admin/Instructors can manage questions
create policy "Instructors can manage questions" on public.questions
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor')));

-- 6. Exams
create table public.exams (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  time_limit integer, -- in minutes
  passing_score integer default 60,
  is_active boolean default false,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.exams enable row level security;

create policy "Anyone can view active exams" on public.exams
  for select using (is_active = true);

create policy "Instructors can manage exams" on public.exams
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor')));

-- 7. Exam Questions (Many-to-Many)
create table public.exam_questions (
  exam_id uuid references public.exams(id) on delete cascade,
  question_id uuid references public.questions(id) on delete cascade,
  "order" integer default 0,
  points integer default 10,
  primary key (exam_id, question_id)
);

alter table public.exam_questions enable row level security;

create policy "Public view for active exams" on public.exam_questions
  for select using (exists (select 1 from public.exams where id = exam_questions.exam_id and is_active = true));

create policy "Instructors manage exam questions" on public.exam_questions
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor')));

-- 8. Exam Submissions
create table public.exam_submissions (
  id uuid default gen_random_uuid() primary key,
  exam_id uuid references public.exams(id),
  user_id uuid references public.profiles(id),
  score integer,
  status text check (status in ('in_progress', 'submitted', 'graded')) default 'in_progress',
  answers jsonb, -- Store user answers: {"question_id": "answer_value"}
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  submitted_at timestamp with time zone,
  unique(exam_id, user_id) -- One attempt per exam for now
);

alter table public.exam_submissions enable row level security;

create policy "Users manage own submissions" on public.exam_submissions
  using (auth.uid() = user_id);

create policy "Instructors view all submissions" on public.exam_submissions
  for select using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor')));
