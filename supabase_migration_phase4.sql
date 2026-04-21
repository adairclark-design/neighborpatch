-- Phase 4: Comms, Storage, Monetization

-- 1. SaaS Tier added to Profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;

-- 2. Messaging Infrastructure
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plot_id UUID REFERENCES plots(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can insert own messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- 3. Storage Bucket for Harvests
INSERT INTO storage.buckets (id, name, public) VALUES ('harvests', 'harvests', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Harvests View Policy" ON storage.objects FOR SELECT USING (bucket_id = 'harvests');
CREATE POLICY "Harvests Insert Policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'harvests' AND auth.role() = 'authenticated');
