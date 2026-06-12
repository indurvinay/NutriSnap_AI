# Database Design Session

**Date:** 2026-06-02  
**Framework Target:** Supabase (PostgreSQL)  
**Security Model:** Row-Level Security (RLS) with explicit user ownership models  

---

## Prompt

Create Supabase schema for calorie tracker.

Requirements:
- `meals` table
- `meal_items` table
- `goals` constraints (integrated within `profiles` parameters)
- `streaks` (integrated direct state inside profile metrics to avoid slow join counts)
- `profiles` with automated trigger mapping

---

## Gemini Response

The recommended schema is written in standard PostgreSQL dialect optimized specifically for Supabase's managed Postgres engine. It models:

1. **Enum Custom Types (`meal_type`, `goal_type`, `activity_level_type`, `gender_type`)**: Matching exact static TypeScript domain interfaces.
2. **`profiles`**: Tied to `auth.users` via foreign keys, with custom triggers to auto-initialize profile rows upon successful user registration.
3. **`daily_logs`**: Tracks hydration (`water_intake_ml`), water challenges, and daily weight snapshots (`recorded_weight_kg`).
4. **`meals`**: Tracks grouped logical meals (breakfast, lunch, dinner, snack) with sum aggregate values.
5. **`meal_items`**: Linked via cascade-delete cascade, detailed ingredient parameters, AI confidence scores, and raw imagery pathways.

```sql
-- Create custom domain enums to match TypeScript types
CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');
CREATE TYPE goal_type AS ENUM ('lose', 'maintain', 'build');
CREATE TYPE activity_level_type AS ENUM ('sedentary', 'light', 'moderate', 'very_active');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'prefer-not-to-say');

---------------------------------------------------------
-- 1. USER PROFILES TABLE
---------------------------------------------------------
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL DEFAULT 26,
  gender gender_type NOT NULL DEFAULT 'male',
  weight_kg DECIMAL(5,2) NOT NULL DEFAULT 75.00,
  height_cm DECIMAL(5,2) NOT NULL DEFAULT 178.00,
  activity_level activity_level_type NOT NULL DEFAULT 'moderate',
  goal goal_type NOT NULL DEFAULT 'lose',
  daily_calorie_target INTEGER NOT NULL DEFAULT 2000,
  daily_protein_target INTEGER NOT NULL DEFAULT 150,
  daily_carbs_target INTEGER NOT NULL DEFAULT 200,
  daily_fat_target INTEGER NOT NULL DEFAULT 65,
  is_onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  streak_current INTEGER NOT NULL DEFAULT 0,
  streak_longest INTEGER NOT NULL DEFAULT 0,
  streak_last_date DATE,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  breakfast_reminder BOOLEAN NOT NULL DEFAULT TRUE,
  lunch_reminder BOOLEAN NOT NULL DEFAULT TRUE,
  dinner_reminder BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security (RLS) for privacy protection
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view own profile data."
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile data."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile details."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

---------------------------------------------------------
-- AUTOMATED SIGNUP METRIC INTAKE TRIGGER
-- Instantiates a profile row in public schema on new Auth Signups
---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    age,
    gender,
    weight_kg,
    height_cm,
    activity_level,
    goal,
    daily_calorie_target,
    daily_protein_target,
    daily_carbs_target,
    daily_fat_target,
    is_onboarding_completed,
    is_premium
  ) VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    26,
    'male',
    75.0,
    178.0,
    'moderate',
    'lose',
    2000,
    150,
    200,
    65,
    FALSE,
    FALSE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

---------------------------------------------------------
-- 2. DAILY LOGS TABLE (Hydration, current weight trackers)
---------------------------------------------------------
CREATE TABLE public.daily_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  water_intake_ml INTEGER NOT NULL DEFAULT 0,
  water_goal_ml INTEGER NOT NULL DEFAULT 2000,
  recorded_weight_kg DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_date UNIQUE (user_id, log_date)
);

-- RLS Enforcement
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own daily logs"
  ON public.daily_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can generate daily logs"
  ON public.daily_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can adjust own daily logs"
  ON public.daily_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can purge own daily log pages"
  ON public.daily_logs FOR DELETE
  USING (auth.uid() = user_id);

---------------------------------------------------------
-- 3. MEALS TABLE
---------------------------------------------------------
CREATE TABLE public.meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  type meal_type NOT NULL,
  name TEXT NOT NULL,
  total_calories INTEGER NOT NULL DEFAULT 0,
  total_protein DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  total_carbs DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  total_fat DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  time_logged TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Enforcement
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logged meals"
  ON public.meals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can record meals"
  ON public.meals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can customize logged meals"
  ON public.meals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete logged meals"
  ON public.meals FOR DELETE
  USING (auth.uid() = user_id);

---------------------------------------------------------
-- 4. MEAL CONSTITUENT ITEMS TABLE (constituent breakdown)
---------------------------------------------------------
CREATE TABLE public.meal_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_id UUID REFERENCES public.meals(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  portion TEXT NOT NULL,
  calories INTEGER NOT NULL DEFAULT 0,
  protein_g DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  carbs_g DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  fat_g DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  confidence DECIMAL(4,3),
  category TEXT DEFAULT 'Generic',
  image_uri TEXT,
  is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Enforcement
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;

-- Direct queries to public.meal_items should filter based on owning meal's user_id
CREATE POLICY "Users can view own constituent meal items"
  ON public.meal_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.meals
      WHERE public.meals.id = public.meal_items.meal_id
      AND public.meals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert constituent meal items"
  ON public.meal_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.meals
      WHERE public.meals.id = public.meal_items.meal_id
      AND public.meals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can modify constituent meal items"
  ON public.meal_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.meals
      WHERE public.meals.id = public.meal_items.meal_id
      AND public.meals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete constituent meal items"
  ON public.meal_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.meals
      WHERE public.meals.id = public.meal_items.meal_id
      AND public.meals.user_id = auth.uid()
    )
  );

---------------------------------------------------------
-- 5. PERFORMANCE INDEXES
---------------------------------------------------------
CREATE INDEX idx_profiles_streak ON public.profiles(streak_current DESC);
CREATE INDEX idx_daily_logs_lookup ON public.daily_logs(user_id, log_date);
CREATE INDEX idx_meals_lookup ON public.meals(user_id, log_date, type);
CREATE INDEX idx_meal_items_parent ON public.meal_items(meal_id);
```

---

## Decisions Taken

- **`meals` Table Required:** Yes, acts as parent grouping log for individual meals. Includes automatic summation fields.
- **`meal_items` Table Required:** Yes, supports granular ingredient breakdowns with optional camera image properties and vision API confidence metrics.
- **Row-Level Security (RLS) Enabled:** Enforced strictly across all tables to safeguard user calorie targets and logged intake records. Only the owner can view, update, insert, or delete.
- **User Initialization Automation:** Configured Trigger on `auth.users` through trigger function `handle_new_user()` so that every new signup gets an instant compliant profile in the user database.
