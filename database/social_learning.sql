-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Study Groups Table
CREATE TABLE IF NOT EXISTS study_groups (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Group Members Table
CREATE TABLE IF NOT EXISTS group_members (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id uuid REFERENCES study_groups(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    joined_at timestamp with time zone DEFAULT now(),
    UNIQUE(group_id, user_id)
);

-- Group Messages Table
CREATE TABLE IF NOT EXISTS group_messages (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id uuid REFERENCES study_groups(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- RLS Policies

-- Comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are viewable by everyone." ON comments FOR SELECT USING (true);
CREATE POLICY "Users can insert their own comments." ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Study Groups
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Study groups are viewable by everyone." ON study_groups FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create groups." ON study_groups FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Group Members
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Group members are viewable by everyone." ON group_members FOR SELECT USING (true);
CREATE POLICY "Users can join groups." ON group_members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Group Messages
ALTER TABLE group_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Group messages are viewable by group members." ON group_messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM group_members WHERE group_id = group_messages.group_id AND user_id = auth.uid()
    )
);
CREATE POLICY "Group members can send messages." ON group_messages FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM group_members WHERE group_id = group_messages.group_id AND user_id = auth.uid()
    )
);

-- Seed Initial Groups
INSERT INTO study_groups (name, description) VALUES
('Python Beginners', 'A place for those starting their Python journey.'),
('AI Ethics Discussion', 'Debating the moral implications of Artificial Intelligence.'),
('Web Dev Support', 'Help each other with React, Next.js, and CSS.')
ON CONFLICT DO NOTHING;
