# Members Hub Setup Guide

## Overview
The Members Hub feature allows users to browse all FBLA members, search by name or event, and view member profiles with their competing events.

## Supabase Setup

### Step 1: Run the SQL Migration

Execute the SQL commands in `supabase-members-setup.sql` in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-members-setup.sql`
4. Click "Run" to execute the SQL

This will create three tables:
- `fbla_members` - Stores member information (name, initials, bio)
- `fbla_events` - Stores event names
- `fbla_member_events` - Junction table linking members to events

### Step 2: Seed the Database

The database will be automatically seeded when the app launches for the first time. The `initMembersDatabase()` function in `utils/membersDatabase.ts` will:

1. Check if members already exist
2. If not, insert all members with their bios
3. Insert all events
4. Create member-event relationships

### Step 3: Verify the Setup

After running the app, verify the data in Supabase:

1. Go to Table Editor in Supabase
2. Check `fbla_members` table - should have ~400+ members
3. Check `fbla_events` table - should have ~100+ events
4. Check `fbla_member_events` table - should have ~1000+ relationships

## Features

### Search Functionality
- **Search by Name**: Type a member's name to find them
- **Search by Event**: Type an event name to see all members competing in that event

### Member Cards
- Shows member initials as avatar
- Displays short bio
- Shows event count
- Tap to expand and see:
  - Full bio
  - Up to 2 events (with "+X more" if applicable)

### Design
- WhatsApp-inspired sharp, sleek design
- Smooth expand/collapse animations
- Dark mode support
- Glass morphism effects

## Navigation

The Members Hub is accessible from the Dashboard via the animated chat bubble button located below the AI Coach card.

## Troubleshooting

### Database Not Seeding
If the database doesn't seed automatically:
1. Check Supabase connection in `utils/supabase.ts`
2. Verify RLS policies are set correctly
3. Check console logs for errors

### Search Not Working
- Ensure Supabase tables have proper indexes
- Check that member-event relationships are created
- Verify search functions in `utils/membersDatabase.ts`

### Animation Issues
- Ensure `react-native-reanimated` is properly installed
- Check that Babel config includes reanimated plugin
- Restart Metro bundler if animations don't work

## Data Structure

### Member
```typescript
interface Member {
  id: string;
  name: string;
  initials: string;
  bio: string;
  events: Event[];
}
```

### Event
```typescript
interface Event {
  id: string;
  name: string;
}
```

## Future Enhancements
- Add member contact information
- Implement direct messaging
- Add profile pictures
- Filter by grade level or chapter
- Export member list