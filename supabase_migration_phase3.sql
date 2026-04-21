-- Phase 3 Demographic Upgrades

-- 1. Add "Silent Partner" vs "Collaborative" tag to the plots table
ALTER TABLE plots ADD COLUMN IF NOT EXISTS interaction_preference TEXT DEFAULT 'collaborative' CHECK (interaction_preference IN ('collaborative', 'silent'));

-- 2. Create the Visual Harvest Logs Table
CREATE TABLE IF NOT EXISTS harvest_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plot_id UUID REFERENCES plots(id) ON DELETE CASCADE,
    gardener_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    weight_lbs DECIMAL(6,2) DEFAULT 0.00,
    notes TEXT,
    photo_url TEXT
);

-- RLS Policies for Harvest Logs
ALTER TABLE harvest_logs ENABLE ROW LEVEL SECURITY;

-- Anyone can view public harvest logs (e.g. for trust verification before applying)
CREATE POLICY "Harvest logs viewable by everyone" ON harvest_logs
    FOR SELECT USING (true);

-- Only logged in gardeners can insert logs on their own behalf
CREATE POLICY "Gardeners can insert harvest logs" ON harvest_logs 
    FOR INSERT WITH CHECK (auth.uid() = gardener_id);
