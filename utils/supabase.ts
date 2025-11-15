import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database helper functions
export const db = {
  // Get all events
  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Register for an event
  async registerForEvent(eventId: string, userId: string) {
    const { data, error } = await supabase
      .from('event_registrations')
      .insert({ event_id: eventId, user_id: userId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Check if user is registered for event
  async isRegisteredForEvent(eventId: string, userId: string) {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    return !!data;
  },

  // Get all announcements
  async getAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get all resources
  async getResources() {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get leaderboard (top users by points)
  async getLeaderboard(limit = 10) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('points', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  // Add points to user
  async addPoints(userId: string, points: number, reason: string) {
    // Add to points history
    await supabase
      .from('points_history')
      .insert({ user_id: userId, points, reason });

    // Update user total points
    const { data: profile } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();

    if (profile) {
      await supabase
        .from('profiles')
        .update({ points: (profile.points || 0) + points })
        .eq('id', userId);
    }
  },
};
