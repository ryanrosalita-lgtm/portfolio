-- ============================================
-- CORE SKILLS & SOFT SKILLS TABLES
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. CREATE CORE SKILLS TABLE
CREATE TABLE IF NOT EXISTS core_skills (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  skill TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CREATE SOFT SKILLS TABLE
CREATE TABLE IF NOT EXISTS soft_skills (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  skill TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE core_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE soft_skills ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ROW LEVEL SECURITY POLICIES - CORE SKILLS
-- ============================================

-- Allow anyone to READ
DROP POLICY IF EXISTS "Allow read for all" ON core_skills;
CREATE POLICY "Allow read for all" ON core_skills
  FOR SELECT USING (true);

-- Allow authenticated users to INSERT
DROP POLICY IF EXISTS "Allow insert via authenticated" ON core_skills;
CREATE POLICY "Allow insert via authenticated" ON core_skills
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Allow authenticated users to UPDATE
DROP POLICY IF EXISTS "Allow update via authenticated" ON core_skills;
CREATE POLICY "Allow update via authenticated" ON core_skills
  FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Allow authenticated users to DELETE
DROP POLICY IF EXISTS "Allow delete via authenticated" ON core_skills;
CREATE POLICY "Allow delete via authenticated" ON core_skills
  FOR DELETE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ============================================
-- ROW LEVEL SECURITY POLICIES - SOFT SKILLS
-- ============================================

-- Allow anyone to READ
DROP POLICY IF EXISTS "Allow read for all" ON soft_skills;
CREATE POLICY "Allow read for all" ON soft_skills
  FOR SELECT USING (true);

-- Allow authenticated users to INSERT
DROP POLICY IF EXISTS "Allow insert via authenticated" ON soft_skills;
CREATE POLICY "Allow insert via authenticated" ON soft_skills
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Allow authenticated users to UPDATE
DROP POLICY IF EXISTS "Allow update via authenticated" ON soft_skills;
CREATE POLICY "Allow update via authenticated" ON soft_skills
  FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Allow authenticated users to DELETE
DROP POLICY IF EXISTS "Allow delete via authenticated" ON soft_skills;
CREATE POLICY "Allow delete via authenticated" ON soft_skills
  FOR DELETE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================
INSERT INTO core_skills (skill) VALUES
  ('Packaging & Merchandise Design'),
  ('Campaign Design'),
  ('Brand Identity Design'),
  ('UI/UX Design'),
  ('Motion Graphics'),
  ('Print Design');

INSERT INTO soft_skills (skill) VALUES
  ('Responsible'),
  ('Well-organized'),
  ('Creative thinking'),
  ('Team collaboration'),
  ('Problem-solving'),
  ('Time management');

-- ============================================
-- DONE! Tables are ready to use
-- ============================================
