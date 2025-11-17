import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  chapter: string;
  position: string;
  phone: string;
  bio: string;
  memberSince: string;
  eventsAttended: number;
  points: number;
}

interface SupabaseAuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: {
    name: string;
    email: string;
    password: string;
    chapter?: string;
    position?: string;
    phone?: string;
    bio?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error loading profile:', error);
      return;
    }

    if (data) {
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        chapter: data.chapter,
        position: data.position,
        phone: data.phone,
        bio: data.bio,
        memberSince: data.member_since,
        eventsAttended: data.events_attended,
        points: data.points,
      });
    }

    setIsLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    if (data.user) {
      await loadUserProfile(data.user.id);
    }
  };

  const signUp = async (userData: {
    name: string;
    email: string;
    password: string;
    chapter?: string;
    position?: string;
    phone?: string;
    bio?: string;
  }) => {
    console.log("🚀 Signing up user", userData);

    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name
        }
      }
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("User not created.");

    // Allow trigger time
    await new Promise(res => setTimeout(res, 400));

    await supabase
      .from('profiles')
      .update({
        name: userData.name,
        chapter: userData.chapter || "",
        position: userData.position || "",
        phone: userData.phone || "",
        bio: userData.bio || ""
      })
      .eq('id', data.user.id);

    await loadUserProfile(data.user.id);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    setUser({ ...user, ...updates });
  };

  return (
    <SupabaseAuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error("useSupabaseAuth must be used inside SupabaseAuthProvider");
  }
  return context;
}
