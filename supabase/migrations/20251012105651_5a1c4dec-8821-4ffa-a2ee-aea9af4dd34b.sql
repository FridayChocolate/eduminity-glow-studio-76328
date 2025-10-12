-- Create enum for subscription tiers
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'premium', 'pro');

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create ad_views table to track ad watching
CREATE TABLE public.ad_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coins_earned NUMERIC NOT NULL DEFAULT 5,
  ad_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create premium_features table
CREATE TABLE public.premium_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  tier subscription_tier NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_features ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON public.subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for ad_views
CREATE POLICY "Users can view their own ad views"
  ON public.ad_views FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ad views"
  ON public.ad_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for donations
CREATE POLICY "Anyone can view non-anonymous donations"
  ON public.donations FOR SELECT
  USING (is_anonymous = false OR auth.uid() = donor_user_id);

CREATE POLICY "Authenticated users can create donations"
  ON public.donations FOR INSERT
  WITH CHECK (auth.uid() = donor_user_id);

CREATE POLICY "Users can view their own donations"
  ON public.donations FOR SELECT
  USING (auth.uid() = donor_user_id);

-- RLS Policies for premium_features
CREATE POLICY "Anyone can view premium features"
  ON public.premium_features FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_tier ON public.subscriptions(tier);
CREATE INDEX idx_ad_views_user_id ON public.ad_views(user_id);
CREATE INDEX idx_ad_views_created_at ON public.ad_views(created_at);
CREATE INDEX idx_donations_donor_user_id ON public.donations(donor_user_id);
CREATE INDEX idx_donations_created_at ON public.donations(created_at);

-- Insert default premium features
INSERT INTO public.premium_features (name, description, tier) VALUES
  ('Ad-Free Experience', 'Browse without any advertisements', 'basic'),
  ('Unlimited Downloads', 'Download unlimited study materials', 'basic'),
  ('Priority Support', 'Get priority customer support', 'premium'),
  ('Exclusive Content', 'Access to premium-only study materials', 'premium'),
  ('Advanced Analytics', 'Track your learning progress with detailed analytics', 'pro'),
  ('Custom Branding', 'Customize your profile with premium themes', 'pro'),
  ('Verified Badge', 'Get a verified contributor badge', 'premium');

-- Function to create default subscription for new users
CREATE OR REPLACE FUNCTION public.create_user_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'free', 'active');
  RETURN NEW;
END;
$$;

-- Trigger to create subscription when profile is created
CREATE TRIGGER on_profile_created_create_subscription
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_subscription();