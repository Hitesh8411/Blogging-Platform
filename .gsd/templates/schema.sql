-- Supabase Database Schema

-- Users Table (Extends from auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'Viewer' CHECK (role IN ('Admin', 'Author', 'Viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Posts Table
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT,
  summary TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comments Table
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) Policies

-- Profiles: Anyone can read profiles. Users can only edit their own profile.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Posts: Everyone can read. Authors can only edit/delete their own. Admins can edit/delete all.
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts are viewable by everyone." ON public.posts FOR SELECT USING (true);
CREATE POLICY "Authors can create posts." ON public.posts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'Author' OR role = 'Admin'))
);
CREATE POLICY "Authors can update own posts." ON public.posts FOR UPDATE USING (
  auth.uid() = author_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin')
);
CREATE POLICY "Authors can delete own posts." ON public.posts FOR DELETE USING (
  auth.uid() = author_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin')
);

-- Comments: Everyone can read. Authenticated users can create. Owners/Admins can delete.
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are viewable by everyone." ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment." ON public.comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Comment owners can delete." ON public.comments FOR DELETE USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin')
);
