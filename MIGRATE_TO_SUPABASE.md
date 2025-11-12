# 🔄 Migrating from AsyncStorage to Supabase

## What Needs to Change

You need to update these files to use Supabase instead of AsyncStorage:

### 1. App.tsx
```typescript
// Change this:
import { AuthProvider } from './contexts/AuthContext';

// To this:
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';

// And change this:
<AuthProvider>
  <AppContent />
</AuthProvider>

// To this:
<SupabaseAuthProvider>
  <AppContent />
</SupabaseAuthProvider>
```

### 2. All screens that use auth
```typescript
// Change this:
import { useAuth } from '../contexts/AuthContext';
const { user, signIn, signOut } = useAuth();

// To this:
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
const { user, signIn, signOut } = useSupabaseAuth();
```

### 3. ProfileScreen.tsx
Add the `updateProfile` function:
```typescript
const { user, updateProfile } = useSupabaseAuth();

// When saving profile:
await updateProfile({
  name: editedProfile.name,
  chapter: editedProfile.chapter,
  position: editedProfile.position,
  phone: editedProfile.phone,
  bio: editedProfile.bio,
});
```

## Files to Update

- ✅ `App.tsx` - Change provider
- ✅ `screens/SignInScreen.tsx` - Change hook
- ✅ `screens/SignUpScreen.tsx` - Change hook
- ✅ `screens/ProfileScreen.tsx` - Change hook + add updateProfile
- ✅ `screens/DashboardScreen.tsx` - Change hook (if using auth)

## Testing

1. **Sign Up** - Create a new account
2. **Sign In** - Log in with your account
3. **Profile** - Update your profile
4. **Sign Out** - Log out
5. **Check Database** - Go to Supabase dashboard and see your data!

## Rollback Plan

If something goes wrong, you can always switch back:
1. Change `SupabaseAuthProvider` back to `AuthProvider` in App.tsx
2. Change `useSupabaseAuth` back to `useAuth` in all files
3. Your old AsyncStorage data will still be there!

## Benefits of Supabase

✅ **Real database** - Data persists across devices
✅ **Real auth** - Secure authentication
✅ **Scalable** - Handles thousands of users
✅ **Real-time** - Live data updates
✅ **Secure** - Row-level security
✅ **Free tier** - 500MB database, 50MB file storage