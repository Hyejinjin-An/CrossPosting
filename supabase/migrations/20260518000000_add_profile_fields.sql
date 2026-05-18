-- Add gender and phone fields to profiles for user registration
alter table public.profiles
  add column if not exists gender text check (gender in ('male', 'female', 'other')),
  add column if not exists phone  text;
