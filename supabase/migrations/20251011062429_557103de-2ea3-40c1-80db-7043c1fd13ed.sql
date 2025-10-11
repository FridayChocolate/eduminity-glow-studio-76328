-- Create enum for question status
CREATE TYPE public.question_status AS ENUM ('open', 'answered', 'closed');

-- Create enum for verification status
CREATE TYPE public.verification_status AS ENUM ('pending', 'verified', 'rejected');

-- Create enum for transaction type
CREATE TYPE public.transaction_type AS ENUM ('earn', 'spend', 'withdraw', 'commission');

-- Q&A System Tables
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade_level TEXT,
  coin_reward NUMERIC DEFAULT 0,
  status question_status DEFAULT 'open',
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_best_answer BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.answer_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id UUID REFERENCES public.answers(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(answer_id, user_id)
);

-- Study Materials System
CREATE TABLE public.material_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.material_categories(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  grade_level TEXT,
  price NUMERIC DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  file_url TEXT,
  preview_url TEXT,
  video_url TEXT,
  views INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.material_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID REFERENCES public.study_materials(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(material_id, user_id)
);

-- Badges and Achievements
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  requirement_type TEXT,
  requirement_value INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Wallet and Transactions
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance NUMERIC DEFAULT 0,
  total_earned NUMERIC DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  total_withdrawn NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  type transaction_type NOT NULL,
  description TEXT,
  reference_id UUID,
  commission_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Community and Discussion
CREATE TABLE public.discussion_boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES public.discussion_boards(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Blog System
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  featured_image TEXT,
  published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Profile Verification
CREATE TABLE public.profile_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  institution_name TEXT NOT NULL,
  verification_document TEXT,
  status verification_status DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answer_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Questions
CREATE POLICY "Anyone can view public questions" ON public.questions
  FOR SELECT USING (is_private = false OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can create questions" ON public.questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own questions" ON public.questions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own questions" ON public.questions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Answers
CREATE POLICY "Anyone can view answers to public questions" ON public.answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.questions 
      WHERE id = answers.question_id 
      AND (is_private = false OR user_id = auth.uid())
    )
  );

CREATE POLICY "Authenticated users can create answers" ON public.answers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own answers" ON public.answers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own answers" ON public.answers
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Answer Ratings
CREATE POLICY "Anyone can view ratings" ON public.answer_ratings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can rate answers" ON public.answer_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" ON public.answer_ratings
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for Material Categories
CREATE POLICY "Anyone can view categories" ON public.material_categories
  FOR SELECT USING (true);

-- RLS Policies for Study Materials
CREATE POLICY "Anyone can view study materials" ON public.study_materials
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create materials" ON public.study_materials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own materials" ON public.study_materials
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own materials" ON public.study_materials
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Material Reviews
CREATE POLICY "Anyone can view reviews" ON public.material_reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON public.material_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.material_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.material_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Badges
CREATE POLICY "Anyone can view badges" ON public.badges
  FOR SELECT USING (true);

-- RLS Policies for User Badges
CREATE POLICY "Anyone can view user badges" ON public.user_badges
  FOR SELECT USING (true);

-- RLS Policies for Wallets
CREATE POLICY "Users can view their own wallet" ON public.wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet" ON public.wallets
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for Transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for Discussion Boards
CREATE POLICY "Anyone can view discussion boards" ON public.discussion_boards
  FOR SELECT USING (true);

-- RLS Policies for Discussions
CREATE POLICY "Anyone can view discussions" ON public.discussions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create discussions" ON public.discussions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own discussions" ON public.discussions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own discussions" ON public.discussions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Discussion Replies
CREATE POLICY "Anyone can view replies" ON public.discussion_replies
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create replies" ON public.discussion_replies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own replies" ON public.discussion_replies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own replies" ON public.discussion_replies
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Blog Posts
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
  FOR SELECT USING (published = true OR auth.uid() = author_id);

CREATE POLICY "Authenticated users can create blog posts" ON public.blog_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own posts" ON public.blog_posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own posts" ON public.blog_posts
  FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for Profile Verifications
CREATE POLICY "Users can view their own verification" ON public.profile_verifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create verification request" ON public.profile_verifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own verification" ON public.profile_verifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_questions_user_id ON public.questions(user_id);
CREATE INDEX idx_questions_status ON public.questions(status);
CREATE INDEX idx_answers_question_id ON public.answers(question_id);
CREATE INDEX idx_answers_user_id ON public.answers(user_id);
CREATE INDEX idx_study_materials_user_id ON public.study_materials(user_id);
CREATE INDEX idx_study_materials_category_id ON public.study_materials(category_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_discussions_board_id ON public.discussions(board_id);

-- Insert default material categories
INSERT INTO public.material_categories (name, description, icon, color) VALUES
  ('Quick Summaries', 'Condensed notes for quick revision', '📝', '#FF6B6B'),
  ('Topic Notes', 'Detailed notes on specific topics', '📚', '#4ECDC4'),
  ('Study Guides', 'Comprehensive study materials', '📖', '#95E1D3'),
  ('Video Explanations', 'Video tutorials and explanations', '🎥', '#F38181'),
  ('Practice Problems', 'Practice questions and solutions', '✏️', '#AA96DA'),
  ('Exam Prep', 'Materials for exam preparation', '🎯', '#FCBAD3');

-- Insert default badges
INSERT INTO public.badges (name, description, icon, requirement_type, requirement_value) VALUES
  ('Top 10 Seller', 'Sold more than 10 study materials', '🏆', 'sales', 10),
  ('Trusted Contributor', 'Received 50+ positive reviews', '⭐', 'reviews', 50),
  ('Helpful Tutor', 'Answered 25+ questions', '🎓', 'answers', 25),
  ('Rising Star', 'Earned 1000+ coins', '💫', 'coins', 1000),
  ('Community Leader', 'Started 10+ discussions', '👑', 'discussions', 10),
  ('Verified Educator', 'Verified educational institution', '✓', 'verified', 1);

-- Insert default discussion boards
INSERT INTO public.discussion_boards (subject, description, icon) VALUES
  ('Mathematics', 'Discuss math problems and solutions', '➗'),
  ('Science', 'Physics, Chemistry, Biology discussions', '🔬'),
  ('Literature', 'Bengali and English literature', '📚'),
  ('History', 'Bangladesh history and world history', '🏛️'),
  ('ICT', 'Computer science and technology', '💻'),
  ('Study Tips', 'Share study strategies and tips', '💡');

-- Function to create wallet for new users
CREATE OR REPLACE FUNCTION public.create_user_wallet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.wallets (user_id, balance)
  VALUES (NEW.id, 0);
  RETURN NEW;
END;
$$;

-- Trigger to create wallet when profile is created
CREATE TRIGGER on_profile_created_create_wallet
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_wallet();