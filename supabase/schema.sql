-- 1. Profiles Table (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text,
  full_name text,
  phone text,
  role text check (role in ('admin', 'instructor', 'student')) default 'student',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Courses Table
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  video_url text, -- Vimeo/YouTube Private Link
  price integer default 0,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.courses enable row level security;

create policy "Anyone can view published courses." on public.courses
  for select using (is_published = true);

-- 3. Enrollments Table (Connecting Students to Courses)
create table public.enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  course_id uuid references public.courses(id) not null,
  progress integer default 0, -- Percentage (0-100)
  status text check (status in ('active', 'completed')) default 'active',
  purchased_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id)
);

alter table public.enrollments enable row level security;

create policy "Users can view own enrollments." on public.enrollments
  for select using (auth.uid() = user_id);

-- 4. Certifications Table
create table public.certifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  course_id uuid references public.courses(id) not null,
  cert_number text unique not null, -- e.g., KREA-2024-001
  issued_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.certifications enable row level security;

create policy "Users can view own certifications." on public.certifications
  for select using (auth.uid() = user_id);
