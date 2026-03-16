-- ============================================
-- SUPABASE COMPLETE SETUP SCRIPT
-- Run this in Supabase SQL Editor to fix all issues
-- ============================================

-- 1. CREATE PROFILE TABLE
CREATE TABLE IF NOT EXISTS profile (
  id BIGINT PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL DEFAULT 'Lynard',
  title TEXT NOT NULL DEFAULT 'Graphic Designer',
  bio TEXT NOT NULL DEFAULT 'Young Professional',
  email TEXT NOT NULL DEFAULT 'alfielynard23@gmail.com',
  phone TEXT NOT NULL DEFAULT '+639453553379',
  location TEXT NOT NULL DEFAULT 'Philippines, Digos City',
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CREATE PROJECTS TABLE (if not exists)
CREATE TABLE IF NOT EXISTS projects (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  image TEXT,
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CREATE ACHIEVEMENTS TABLE (if not exists)
CREATE TABLE IF NOT EXISTS achievements (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  issuer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CREATE SKILLS TABLE (if not exists)
CREATE TABLE IF NOT EXISTS skills (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INTEGER NOT NULL,
  logo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. INSERT DEFAULT PROFILE DATA
INSERT INTO profile (id, name, title, bio, email, phone, location, image)
VALUES (1, 'Lynard', 'Graphic Designer', 'Young Professional', 'alfielynard23@gmail.com', '+639453553379', 'Philippines, Digos City', NULL)
ON CONFLICT (id) DO UPDATE SET 
  updated_at = CURRENT_TIMESTAMP;

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- 7. CREATE RLS POLICIES FOR PROFILE TABLE
-- Allow anyone to read profile
DROP POLICY IF EXISTS "Allow read for all" ON profile;
CREATE POLICY "Allow read for all" ON profile
  FOR SELECT USING (true);

-- Allow updates via service role only (for admin)
DROP POLICY IF EXISTS "Allow update via service role" ON profile;
CREATE POLICY "Allow update via service role" ON profile
  FOR UPDATE USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 8. CREATE RLS POLICIES FOR PROJECTS TABLE
DROP POLICY IF EXISTS "Allow read for all" ON projects;
CREATE POLICY "Allow read for all" ON projects
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert via service role" ON projects;
CREATE POLICY "Allow insert via service role" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow update via service role" ON projects;
CREATE POLICY "Allow update via service role" ON projects
  FOR UPDATE USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow delete via service role" ON projects;
CREATE POLICY "Allow delete via service role" ON projects
  FOR DELETE USING (auth.role() = 'service_role');

-- 9. CREATE RLS POLICIES FOR ACHIEVEMENTS TABLE
DROP POLICY IF EXISTS "Allow read for all" ON achievements;
CREATE POLICY "Allow read for all" ON achievements
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert via service role" ON achievements;
CREATE POLICY "Allow insert via service role" ON achievements
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow update via service role" ON achievements;
CREATE POLICY "Allow update via service role" ON achievements
  FOR UPDATE USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow delete via service role" ON achievements;
CREATE POLICY "Allow delete via service role" ON achievements
  FOR DELETE USING (auth.role() = 'service_role');

-- 10. CREATE RLS POLICIES FOR SKILLS TABLE
DROP POLICY IF EXISTS "Allow read for all" ON skills;
CREATE POLICY "Allow read for all" ON skills
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert via service role" ON skills;
CREATE POLICY "Allow insert via service role" ON skills
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow update via service role" ON skills;
CREATE POLICY "Allow update via service role" ON skills
  FOR UPDATE USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow delete via service role" ON skills;
CREATE POLICY "Allow delete via service role" ON skills
  FOR DELETE USING (auth.role() = 'service_role');

-- 11. INSERT SAMPLE PROJECTS (optional)
INSERT INTO projects (title, description, category, date, image, skills)
VALUES 
  ('Sample Project 1', 'Branding and packaging design project', 'Branding', '2024-01-15', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop', ARRAY['Adobe Illustrator', 'Branding', 'Packaging Design'])
ON CONFLICT DO NOTHING;

-- 12. INSERT SAMPLE ACHIEVEMENTS (optional)
INSERT INTO achievements (title, description, date, type, issuer)
VALUES 
  ('Design Award', 'Won Design Excellence Award from Taylor''s University', '2023-06-20', 'Award', 'Taylor''s University')
ON CONFLICT DO NOTHING;

-- 13. INSERT SAMPLE SKILLS (optional)
INSERT INTO skills (name, category, level, logo)
VALUES 
  ('React', 'Programming', 85, 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@latest/icons/react.svg'),
  ('JavaScript', 'Programming', 90, 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@latest/icons/javascript.svg'),
  ('Java', 'Programming', 80, 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@latest/icons/openjdk.svg'),
  ('Python', 'Programming', 85, 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@latest/icons/python.svg'),
  ('PHP', 'Programming', 75, 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@latest/icons/php.svg'),
  ('SQL', 'Database', 88, 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@latest/icons/mysql.svg'),
  ('SQLite', 'Database', 82, 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@latest/icons/sqlite.svg'),
  ('PostgreSQL', 'Database', 85, 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@latest/icons/postgresql.svg'),
  ('Prisma', 'Database', 80, 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@latest/icons/prisma.svg'),
  ('Adobe Photoshop', 'Design', 90, 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@latest/icons/adobephotoshop.svg')
ON CONFLICT DO NOTHING;

-- ============================================
-- SETUP COMPLETE!
-- Your database is now fully configured.
-- ============================================
