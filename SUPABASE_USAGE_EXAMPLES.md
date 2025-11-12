# 🔥 Supabase Usage Examples

## Authentication

### Sign Up
```typescript
import { useSupabaseAuth } from './contexts/SupabaseAuthContext';

function SignUpScreen() {
  const { signUp } = useSupabaseAuth();

  const handleSignUp = async () => {
    try {
      await signUp({
        email: 'user@example.com',
        password: 'password123',
        name: 'John Doe',
        chapter: 'NCHS',
        position: 'President',
        phone: '555-1234',
        bio: 'FBLA enthusiast!',
      });
      // User is now signed in!
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };
}
```

### Sign In
```typescript
const { signIn } = useSupabaseAuth();

const handleSignIn = async () => {
  try {
    await signIn('user@example.com', 'password123');
    // User is now signed in!
  } catch (error) {
    console.error('Sign in failed:', error);
  }
};
```

### Sign Out
```typescript
const { signOut } = useSupabaseAuth();

const handleSignOut = async () => {
  await signOut();
  // User is now signed out!
};
```

### Update Profile
```typescript
const { updateProfile } = useSupabaseAuth();

const handleUpdateProfile = async () => {
  try {
    await updateProfile({
      name: 'Jane Doe',
      bio: 'Updated bio!',
    });
    // Profile updated!
  } catch (error) {
    console.error('Update failed:', error);
  }
};
```

## Database Operations

### Fetch Events
```typescript
import { fetchEvents } from '../utils/database';

function CalendarScreen() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const data = await fetchEvents();
    setEvents(data);
  };
}
```

### Create Event
```typescript
import { createEvent } from '../utils/database';

const handleCreateEvent = async () => {
  try {
    await createEvent({
      title: 'FBLA Meeting',
      date: '2024-02-15',
      time: '3:00 PM',
      location: 'Room 101',
      description: 'Monthly chapter meeting',
      category: 'meeting',
      attendees: 0,
    });
    // Event created!
    await loadEvents(); // Refresh the list
  } catch (error) {
    console.error('Failed to create event:', error);
  }
};
```

### Update Event
```typescript
import { updateEvent } from '../utils/database';

const handleUpdateEvent = async (eventId: string) => {
  try {
    await updateEvent(eventId, {
      attendees: 25,
      location: 'Room 202',
    });
    // Event updated!
  } catch (error) {
    console.error('Failed to update event:', error);
  }
};
```

### Delete Event
```typescript
import { deleteEvent } from '../utils/database';

const handleDeleteEvent = async (eventId: string) => {
  try {
    await deleteEvent(eventId);
    // Event deleted!
    await loadEvents(); // Refresh the list
  } catch (error) {
    console.error('Failed to delete event:', error);
  }
};
```

## Real-time Subscriptions

### Listen for Event Changes
```typescript
import { subscribeToEvents } from '../utils/database';

function CalendarScreen() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Initial load
    loadEvents();

    // Subscribe to changes
    const unsubscribe = subscribeToEvents((payload) => {
      console.log('Event changed!', payload);
      // Reload events when something changes
      loadEvents();
    });

    // Cleanup
    return () => unsubscribe();
  }, []);
}
```

### Listen for Announcement Changes
```typescript
import { subscribeToAnnouncements } from '../utils/database';

function NewsFeedScreen() {
  useEffect(() => {
    const unsubscribe = subscribeToAnnouncements((payload) => {
      console.log('New announcement!', payload);
      // Show notification or reload data
    });

    return () => unsubscribe();
  }, []);
}
```

## Direct Supabase Queries

### Custom Query
```typescript
import { supabase } from '../utils/supabase';

// Get events for a specific date
const { data, error } = await supabase
  .from('events')
  .select('*')
  .eq('date', '2024-02-15')
  .order('time', { ascending: true });

// Get events by category
const { data, error } = await supabase
  .from('events')
  .select('*')
  .eq('category', 'competition')
  .limit(10);

// Search events
const { data, error } = await supabase
  .from('events')
  .select('*')
  .ilike('title', '%FBLA%');

// Count events
const { count, error } = await supabase
  .from('events')
  .select('*', { count: 'exact', head: true });
```

### Join Tables (if you add relationships)
```typescript
// Get events with attendee info
const { data, error } = await supabase
  .from('events')
  .select(`
    *,
    event_attendees (
      user_id,
      profiles (
        name,
        email
      )
    )
  `);
```

## File Storage (Bonus!)

### Upload File
```typescript
import { supabase } from '../utils/supabase';

const uploadFile = async (file: File) => {
  const { data, error } = await supabase.storage
    .from('resources')
    .upload(`public/${file.name}`, file);

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('resources')
    .getPublicUrl(data.path);

  return publicUrl;
};
```

### Download File
```typescript
const { data, error } = await supabase.storage
  .from('resources')
  .download('public/document.pdf');
```

## Error Handling

### Best Practices
```typescript
try {
  const { data, error } = await supabase
    .from('events')
    .select('*');

  if (error) throw error;

  // Use data
  setEvents(data);
} catch (error: any) {
  // Show user-friendly error
  Alert.alert('Error', error.message || 'Something went wrong');
  console.error('Database error:', error);
}
```

## Performance Tips

### 1. Use Select Specific Columns
```typescript
// ❌ Bad - fetches everything
const { data } = await supabase.from('events').select('*');

// ✅ Good - only fetch what you need
const { data } = await supabase
  .from('events')
  .select('id, title, date, time');
```

### 2. Use Pagination
```typescript
const { data } = await supabase
  .from('events')
  .select('*')
  .range(0, 9); // First 10 items

const { data } = await supabase
  .from('events')
  .select('*')
  .range(10, 19); // Next 10 items
```

### 3. Use Indexes
In your Supabase SQL editor:
```sql
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_category ON events(category);
```

## 🎉 You're Ready!

You now have everything you need to build a full-featured app with Supabase! 🔥