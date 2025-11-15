// /lib/userData.ts
import { supabase } from './supabase';

export async function createUserProfile(userId: string, username: string) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ id: userId, username }]);

  if (error) throw error;
  return data;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUsername(userId: string, username: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ username })
    .eq('id', userId);

  if (error) throw error;
  return data;
}
