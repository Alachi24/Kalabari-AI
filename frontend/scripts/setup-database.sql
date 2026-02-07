-- Create profiles table to extend auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  PRIMARY KEY (id)
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create translation_history table
CREATE TABLE IF NOT EXISTS public.translation_history (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  source_language VARCHAR(10) NOT NULL,
  target_language VARCHAR(10) NOT NULL,
  model_used VARCHAR(100) DEFAULT 'Helsinki-NLP/Opus-MT',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS on translation_history table
ALTER TABLE public.translation_history ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own translations
CREATE POLICY "Users can view own translations" ON public.translation_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own translations
CREATE POLICY "Users can insert own translations" ON public.translation_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to delete their own translations
CREATE POLICY "Users can delete own translations" ON public.translation_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create saved_translations table for bookmarked translations
CREATE TABLE IF NOT EXISTS public.saved_translations (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  translation_id UUID NOT NULL REFERENCES public.translation_history(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(user_id, translation_id)
);

-- Enable RLS on saved_translations table
ALTER TABLE public.saved_translations ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own saved translations
CREATE POLICY "Users can view own saved translations" ON public.saved_translations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own saved translations
CREATE POLICY "Users can insert own saved translations" ON public.saved_translations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to delete their own saved translations
CREATE POLICY "Users can delete own saved translations" ON public.saved_translations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_translation_history_user_id ON public.translation_history(user_id);
CREATE INDEX idx_translation_history_created_at ON public.translation_history(created_at DESC);
CREATE INDEX idx_saved_translations_user_id ON public.saved_translations(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_translation_history_updated_at
  BEFORE UPDATE ON public.translation_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
