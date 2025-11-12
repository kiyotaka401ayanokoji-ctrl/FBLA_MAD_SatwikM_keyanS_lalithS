-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== PROFILES TABLE ====================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  chapter TEXT NOT NULL,
  position TEXT NOT NULL,
  phone TEXT NOT NULL,
  bio TEXT,
  member_since DATE NOT NULL DEFAULT CURRENT_DATE,
  events_attended INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== EVENTS TABLE ====================
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('meeting', 'competition', 'workshop', 'social')),
  attendees INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== ANNOUNCEMENTS TABLE ====================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT CHECK (category IN ('announcement', 'achievement', 'reminder', 'update')),
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== RESOURCES TABLE ====================
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('guide', 'template', 'presentation', 'document')),
  file_type TEXT CHECK (file_type IN ('pdf', 'doc', 'ppt', 'xlsx')),
  size TEXT,
  url TEXT NOT NULL,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== ENABLE ROW LEVEL SECURITY ====================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- ==================== PROFILES POLICIES ====================
-- Anyone can view profiles
CREATE POLICY "Users can view all profiles" ON profiles 
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ==================== EVENTS POLICIES ====================
-- Anyone can view events
CREATE POLICY "Anyone can view events" ON events 
  FOR SELECT USING (true);

-- Authenticated users can create events
CREATE POLICY "Authenticated users can create events" ON events 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update events
CREATE POLICY "Authenticated users can update events" ON events 
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Authenticated users can delete events
CREATE POLICY "Authenticated users can delete events" ON events 
  FOR DELETE USING (auth.role() = 'authenticated');

-- ==================== ANNOUNCEMENTS POLICIES ====================
-- Anyone can view announcements
CREATE POLICY "Anyone can view announcements" ON announcements 
  FOR SELECT USING (true);

-- Authenticated users can create announcements
CREATE POLICY "Authenticated users can create announcements" ON announcements 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update announcements
CREATE POLICY "Authenticated users can update announcements" ON announcements 
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ==================== RESOURCES POLICIES ====================
-- Anyone can view resources
CREATE POLICY "Anyone can view resources" ON resources 
  FOR SELECT USING (true);

-- Authenticated users can create resources
CREATE POLICY "Authenticated users can create resources" ON resources 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update resources
CREATE POLICY "Authenticated users can update resources" ON resources 
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ==================== FUNCTIONS ====================
-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, chapter, position, phone, bio)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'chapter', ''),
    COALESCE(NEW.raw_user_meta_data->>'position', 'Member'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'bio', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to increment resource downloads
CREATE OR REPLACE FUNCTION increment_downloads(resource_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE resources 
  SET downloads = downloads + 1 
  WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql;

-- ==================== SAMPLE DATA ====================
-- Insert some sample events
INSERT INTO events (title, date, time, location, description, category, attendees) VALUES
  ('FBLA Chapter Meeting', '2024-02-15', '3:00 PM', 'Room 101', 'Monthly chapter meeting to discuss upcoming events', 'meeting', 25),
  ('State Leadership Conference', '2024-03-20', '9:00 AM', 'Seattle Convention Center', 'Annual state competition and leadership conference', 'competition', 150),
  ('Business Plan Workshop', '2024-02-28', '4:00 PM', 'Library', 'Learn how to create a winning business plan', 'workshop', 30),
  ('FBLA Social Event', '2024-03-05', '6:00 PM', 'Local Restaurant', 'End of quarter celebration', 'social', 40)
ON CONFLICT DO NOTHING;

-- Insert some sample announcements
INSERT INTO announcements (title, content, author, category, likes) VALUES
  ('Welcome to FBLA Connect!', 'We are excited to launch our new app to keep everyone connected and informed about chapter activities.', 'Chapter President', 'announcement', 15),
  ('State Competition Results', 'Congratulations to our members who placed at the state competition! We had 5 first place winners!', 'Advisor', 'achievement', 42),
  ('Dues Reminder', 'Reminder: Chapter dues are due by the end of the month. Please see the treasurer.', 'Treasurer', 'reminder', 8),
  ('New Meeting Schedule', 'Starting next month, chapter meetings will be held every other Wednesday at 3:00 PM.', 'Vice President', 'update', 12)
ON CONFLICT DO NOTHING;

-- Insert some sample resources
INSERT INTO resources (title, description, category, file_type, size, url, downloads) VALUES
  ('FBLA Competitive Events Guide', 'Complete guide to all FBLA competitive events', 'guide', 'pdf', '2.5 MB', 'https://example.com/events-guide.pdf', 45),
  ('Business Plan Template', 'Template for creating a business plan presentation', 'template', 'ppt', '1.2 MB', 'https://example.com/business-plan.ppt', 32),
  ('Parliamentary Procedure Cheat Sheet', 'Quick reference for parliamentary procedure', 'guide', 'pdf', '500 KB', 'https://example.com/parliamentary.pdf', 28),
  ('Fundraising Ideas Document', 'Collection of successful fundraising ideas', 'document', 'doc', '800 KB', 'https://example.com/fundraising.doc', 19)
ON CONFLICT DO NOTHING;