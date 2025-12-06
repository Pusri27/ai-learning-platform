-- Add XP to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp integer DEFAULT 0;

-- Create Achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,
    description text NOT NULL,
    icon text NOT NULL, -- Emoji or icon name
    condition_type text NOT NULL, -- 'lesson_count', 'quiz_score', 'total_xp'
    condition_value integer NOT NULL,
    xp_reward integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create User Achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
    unlocked_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, achievement_id)
);

-- RLS Policies
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Achievements are viewable by everyone." ON achievements FOR SELECT USING (true);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User achievements are viewable by everyone." ON user_achievements FOR SELECT USING (true);
CREATE POLICY "Users can insert own achievements." ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Seed Initial Achievements
INSERT INTO achievements (title, description, icon, condition_type, condition_value, xp_reward) VALUES
('First Step', 'Complete your first lesson', '🚀', 'lesson_count', 1, 50),
('Dedicated Learner', 'Complete 5 lessons', '📚', 'lesson_count', 5, 100),
('Quiz Master', 'Score 100% on a quiz', '💯', 'quiz_score', 5, 200), -- Assuming 5 questions per quiz
('High Achiever', 'Reach 500 XP', '🏆', 'total_xp', 500, 300)
ON CONFLICT DO NOTHING;
