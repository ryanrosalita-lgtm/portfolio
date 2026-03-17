-- ============================================
-- FRESH EDUCATIONS TABLE SCHEMA
-- Run this in Supabase SQL Editor to reset
-- ============================================

-- DROP EXISTING TABLE AND POLICIES
DROP TABLE IF EXISTS educations CASCADE;

-- ============================================
-- CREATE FRESH EDUCATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS educations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  institution TEXT NOT NULL,                    -- Name of school/university
  degree TEXT NOT NULL,                         -- Degree name (e.g., Bachelor, Diploma)
  specialization TEXT,                          -- Optional field of study
  startYear TEXT NOT NULL,                      -- Year started (e.g., "2021")
  endYear TEXT NOT NULL,                        -- Year completed (e.g., "2024")
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE educations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Policy 1: Allow anyone to READ educations (public portfolio)
CREATE POLICY "Allow read for all" ON educations
  FOR SELECT USING (true);

-- Policy 2: Allow INSERT via service role or authenticated users
CREATE POLICY "Allow insert via service role" ON educations
  FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Policy 3: Allow UPDATE via service role or authenticated users
CREATE POLICY "Allow update via service role" ON educations
  FOR UPDATE USING (auth.role() = 'service_role' OR auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Policy 4: Allow DELETE via service role or authenticated users
CREATE POLICY "Allow delete via service role" ON educations
  FOR DELETE USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ============================================
-- INSERT SAMPLE DATA (OPTIONAL)
-- ============================================
INSERT INTO educations (institution, degree, specialization, startYear, endYear)
VALUES 
  ('COR JESU COLLEGE INC.', 'Bachelor of Science in Information Tech', 'Web Developer & Design', '2023', '2027');

-- ============================================
-- DONE! Table is ready to use.
-- ============================================
