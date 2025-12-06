-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (extends auth.users)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  name text,
  created_at timestamp with time zone default now()
);

-- COURSES
create table courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  level text, -- 'beginner', 'intermediate', 'advanced'
  thumbnail text,
  created_at timestamp with time zone default now()
);

-- LESSONS
create table lessons (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references courses(id) on delete cascade not null,
  title text not null,
  content text, -- markdown or HTML
  order_index integer not null,
  created_at timestamp with time zone default now()
);

-- USER PROGRESS
create table user_progress (
  user_id uuid references profiles(id) on delete cascade not null,
  course_id uuid references courses(id) on delete cascade not null,
  lesson_id uuid references lessons(id) on delete cascade not null,
  completed boolean default false,
  score integer,
  updated_at timestamp with time zone default now(),
  primary key (user_id, lesson_id)
);

-- QUIZ RESULTS
create table quiz_results (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  course_id uuid references courses(id) on delete cascade not null,
  lesson_id uuid references lessons(id) on delete cascade not null,
  score integer not null,
  answers jsonb,
  created_at timestamp with time zone default now()
);

-- RLS POLICIES (Simple version for demo)
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

alter table courses enable row level security;
create policy "Courses are viewable by everyone." on courses for select using (true);

alter table lessons enable row level security;
create policy "Lessons are viewable by everyone." on lessons for select using (true);

alter table user_progress enable row level security;
create policy "Users can view own progress." on user_progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress." on user_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress." on user_progress for update using (auth.uid() = user_id);

alter table quiz_results enable row level security;
create policy "Users can view own quiz results." on quiz_results for select using (auth.uid() = user_id);
create policy "Users can insert own quiz results." on quiz_results for insert with check (auth.uid() = user_id);

-- TRIGGER for new user profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
