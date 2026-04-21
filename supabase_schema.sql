-- Enable PostGIS extension for accurate geospatial storage and querying
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. PROFILES
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    role TEXT CHECK (role IN ('owner', 'gardener')),
    full_name TEXT,
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE -- Becomes true after Stripe Identity check
);

-- 2. PLOTS (The Supply)
CREATE TABLE plots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT,
    description TEXT,
    compensation_model TEXT CHECK (compensation_model IN ('crop_share', 'flat_fee')),
    utility_fee_monthly DECIMAL(10,2) DEFAULT 0.00,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'matched', 'inactive')),
    
    -- The real exact location hidden from public
    exact_location geography(POINT),
    
    -- The fuzzed location (offset by some randomized radius) for the public map
    fuzzed_location geography(POINT)
);

-- 3. APPLICATIONS (The Matching Process)
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plot_id UUID REFERENCES plots(id) ON DELETE CASCADE,
    gardener_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'contract_signed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(plot_id, gardener_id)
);

-- RLS POLICIES FOR 'PLOTS' TO HANDLE EXACT ADDRESS SECRECY
ALTER TABLE plots ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can see the plots, but cannot see the exact_location unless authorized.
-- For standard select, the API logic will automatically only pull fuzzed_location.
CREATE POLICY "Plots are viewable by everyone" ON plots 
  FOR SELECT USING (true);

-- 2. Owners can update their own plots
CREATE POLICY "Owners can update own plots" ON plots
  FOR UPDATE USING (auth.uid() = owner_id);

-- TODO: Create advanced matching RLS where Gardeners with 'approved' applications can select exact_location
