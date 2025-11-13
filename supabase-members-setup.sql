-- Create members table
CREATE TABLE IF NOT EXISTS fbla_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  bio TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS fbla_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create member_events junction table
CREATE TABLE IF NOT EXISTS fbla_member_events (
  member_id UUID REFERENCES fbla_members(id) ON DELETE CASCADE,
  event_id UUID REFERENCES fbla_events(id) ON DELETE CASCADE,
  PRIMARY KEY (member_id, event_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_members_name ON fbla_members(name);
CREATE INDEX IF NOT EXISTS idx_events_name ON fbla_events(name);
CREATE INDEX IF NOT EXISTS idx_member_events_member ON fbla_member_events(member_id);
CREATE INDEX IF NOT EXISTS idx_member_events_event ON fbla_member_events(event_id);

-- Enable Row Level Security
ALTER TABLE fbla_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE fbla_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE fbla_member_events ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access to members" ON fbla_members FOR SELECT USING (true);
CREATE POLICY "Allow public read access to events" ON fbla_events FOR SELECT USING (true);
CREATE POLICY "Allow public read access to member_events" ON fbla_member_events FOR SELECT USING (true);