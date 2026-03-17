-- ============================================
-- EDUCATIONS TABLE SCHEMA FOR SUPABASE
-- ============================================

-- CREATE EDUCATIONS TABLE
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

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE educations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Policy 1: Allow anyone to READ educations (public portfolio)
DROP POLICY IF EXISTS "Allow read for all" ON educations;
CREATE POLICY "Allow read for all" ON educations
  FOR SELECT USING (true);

-- Policy 2: Allow INSERT via service role or authenticated users (admin operations)
DROP POLICY IF EXISTS "Allow insert via service role" ON educations;
CREATE POLICY "Allow insert via service role" ON educations
  FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Policy 3: Allow UPDATE via service role or authenticated users (admin operations)
DROP POLICY IF EXISTS "Allow update via service role" ON educations;
CREATE POLICY "Allow update via service role" ON educations
  FOR UPDATE USING (auth.role() = 'service_role' OR auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Policy 4: Allow DELETE via service role or authenticated users (admin operations)
DROP POLICY IF EXISTS "Allow delete via service role" ON educations;
CREATE POLICY "Allow delete via service role" ON educations
  FOR DELETE USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ============================================
-- SAMPLE DATA
-- ============================================

INSERT INTO educations (institution, degree, specialization, startYear, endYear)
VALUES 
  ('Taylor''s University, Malaysia', 'Bachelor of Design (Honours) in Creative Media', 'Graphic Design Specialisation', '2021', '2024'),
  ('Nanyang Academy of Fine Arts, Singapore', 'Diploma in Graphic Communication', '', '2019', '2020'),
  ('Chinese High School, Malaysia', 'Secondary Education', 'Commerce', '2013', '2018')
ON CONFLICT DO NOTHING;

-- ============================================
-- TABLE STRUCTURE
-- ============================================
--
-- Column Details:
-- 
--   id              - Auto-incrementing ID (primary key)
--   institution     - School/University name (required)
--   degree          - Type of degree earned (required)
--   specialization  - Major/Field of study (optional)
--   startYear       - Year enrollment started (required)
--   endYear         - Year graduated/completed (required)
--   created_at      - Timestamp when record was created
--   updated_at      - Timestamp when record was last updated
--
-- ============================================
-- USAGE IN APPLICATION
-- ============================================
--
-- GET /api/portfolio
--   Returns: educations: [{ id, institution, degree, specialization, startYear, endYear }, ...]
--
-- POST /api/portfolio (with JWT auth)
--   Body: { type: 'education', item: { institution, degree, specialization, startYear, endYear } }
--   Creates new education entry
--
-- DELETE /api/portfolio?type=education&id={id} (with JWT auth)
--   Deletes education entry by ID
--
-- ============================================
