import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration - HARDCODED for reliability
const supabaseUrl = 'https://forddbtpuljnlagvogzu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvcmRkYnRwdWxqbmxhZ3ZvZ3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MTE1NTMsImV4cCI6MjA3ODQ4NzU1M30.VCO7QjH8nleEKN357nQfbToUALThkXzqn2EXZEHLmcs';

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types (you'll update these based on your schema)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          chapter: string;
          position: string;
          phone: string;
          bio: string;
          member_since: string;
          events_attended: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      events: {
        Row: {
          id: string;
          title: string;
          date: string;
          time: string;
          location: string;
          description: string;
          category: 'meeting' | 'competition' | 'workshop' | 'social';
          attendees: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          author: string;
          category: 'announcement' | 'achievement' | 'reminder' | 'update';
          likes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['announcements']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['announcements']['Insert']>;
      };
      resources: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: 'guide' | 'template' | 'presentation' | 'document';
          file_type: 'pdf' | 'doc' | 'ppt' | 'xlsx';
          size: string;
          url: string;
          downloads: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['resources']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['resources']['Insert']>;
      };
    };
  };
}