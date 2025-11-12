# 🔥 Supabase Setup Guide

## 🎯 What You Get

✅ **Real PostgreSQL Database** - Production-ready database
✅ **Authentication** - Email/password, OAuth (Google, GitHub, etc.)
✅ **Real-time Subscriptions** - Live data updates
✅ **Row-Level Security** - Secure your data
✅ **File Storage** - Upload images, documents, etc.
✅ **Auto-generated APIs** - REST and GraphQL

## 📝 Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Fill in:
   - **Name**: `fbla-connect` (or whatever you want)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
6. Click "Create new project"
7. Wait 2-3 minutes for setup

## 🔑 Step 2: Get Your API Keys

1. In your Supabase project, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (the long string under "Project API keys")

## 🔧 Step 3: Add Environment Variables

Add these to your `.env.local` file:

```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**IMPORTANT**: Replace `your_project_url_here` and `your_anon_key_here` with your actual values!

## 🗄️ Step 4: Create Database Tables

In your Supabase project, go to **SQL Editor** and run this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
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

-- Create events table
CREATE TABLE events (
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

-- Create announcements table
CREATE TABLE announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT CHECK (category IN ('announcement', 'achievement', 'reminder', 'update')),
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resources table
CREATE TABLE resources (
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

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Events policies
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create events" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update events" ON events FOR UPDATE USING (auth.role() = 'authenticated');

-- Announcements policies
CREATE POLICY "Anyone can view announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create announcements" ON announcements FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Resources policies
CREATE POLICY "Anyone can view resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create resources" ON resources FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create function to automatically create profile on signup
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
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 🔄 Step 5: Update Your App

Replace the old `AuthProvider` with `SupabaseAuthProvider` in `App.tsx`:

```typescript
// OLD:
import { AuthProvider } from './contexts/AuthContext';

// NEW:
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';

// In your App component:
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SupabaseAuthProvider>  {/* Changed this! */}
          <AppContent />
        </SupabaseAuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
```

And update the hook usage:

```typescript
// OLD:
import { useAuth } from './contexts/AuthContext';

// NEW:
import { useSupabaseAuth } from './contexts/SupabaseAuthContext';

// In your components:
const { user, signIn, signOut } = useSupabaseAuth();  // Changed this!
```

## 🎉 You're Done!

Your app now has:
- ✅ Real authentication
- ✅ Real database
- ✅ Secure data access
- ✅ Production-ready backend

## 📚 Next Steps

### Fetch Events from Database:
```typescript
const { data: events } = await supabase
  .from('events')
  .select('*')
  .order('date', { ascending: true });
```

### Create New Event:
```typescript
const { data, error } = await supabase
  .from('events')
  .insert({
    title: 'FBLA Meeting',
    date: '2024-02-15',
    time: '3:00 PM',
    location: 'Room 101',
    description: 'Monthly chapter meeting',
    category: 'meeting',
  });
```

### Real-time Subscriptions:
```typescript
const subscription = supabase
  .channel('events')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'events' },
    (payload) => {
      console.log('Event changed!', payload);
    }
  )
  .subscribe();
```

## 🔒 Security Tips

1. **Never commit your `.env.local` file** - It's already in `.gitignore`
2. **Use Row Level Security** - Already set up in the SQL above
3. **Validate user input** - Always validate before inserting
4. **Use prepared statements** - Supabase does this automatically

## 🆘 Troubleshooting

**Can't connect?**
- Check your environment variables are correct
- Make sure you copied the full URL and key
- Restart your Expo dev server

**Auth not working?**
- Check email confirmation settings in Supabase dashboard
- Go to **Authentication** → **Settings** → **Email Auth**
- Disable "Confirm email" for testing

**Database errors?**
- Check your SQL ran successfully
- Look at the Supabase logs in the dashboard
- Make sure RLS policies are correct

## 💪 YOU GOT THIS BRO!

Your app is now powered by a real, production-ready database! 🔥