-- Phase 7: Gardener Reliability Survey

-- 1. Flag on profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS survey_complete BOOLEAN DEFAULT FALSE;

-- 2. Gardener Surveys storage table
CREATE TABLE IF NOT EXISTS gardener_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gardener_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    -- Page 1: Philosophy & Motivation
    hotoku_pledge BOOLEAN NOT NULL DEFAULT FALSE,
    motivations TEXT[], -- multi-select array
    personal_statement TEXT,
    -- Page 2: Grow Intent & Experience
    crops_to_grow TEXT[],
    deck_experience TEXT,
    gardening_years TEXT,
    serious_gardening_years TEXT,
    -- Page 3: Techniques & Soil Knowledge
    techniques TEXT[],
    composting_practices TEXT[],
    -- Page 4: Tools, Equipment & Community
    tools_owned TEXT[],
    willing_chicken_care BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE gardener_surveys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gardener can insert own survey" ON gardener_surveys FOR INSERT WITH CHECK (auth.uid() = gardener_id);
CREATE POLICY "Gardener can read own survey" ON gardener_surveys FOR SELECT USING (auth.uid() = gardener_id);
CREATE POLICY "Owners can read applicant surveys" ON gardener_surveys FOR SELECT USING (true);
