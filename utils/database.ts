import { supabase } from './supabase';
import { Event, NewsItem, Resource } from '../types';

// ==================== EVENTS ====================

export async function fetchEvents() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;

    return data?.map(event => ({
      id: event.id,
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description || '',
      category: event.category as Event['category'],
      attendees: event.attendees || 0,
      isRegistered: false, // You can add a user_events table to track this
    })) || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function createEvent(event: Omit<Event, 'id' | 'isRegistered'>) {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert({
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description,
        category: event.category,
        attendees: event.attendees,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

export async function updateEvent(id: string, updates: Partial<Event>) {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

export async function deleteEvent(id: string) {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

// ==================== ANNOUNCEMENTS ====================

export async function fetchAnnouncements() {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(announcement => ({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      author: announcement.author,
      date: new Date(announcement.created_at).toLocaleDateString(),
      category: announcement.category as NewsItem['category'],
      likes: announcement.likes || 0,
      isLiked: false, // You can add a user_likes table to track this
    })) || [];
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
}

export async function createAnnouncement(announcement: Omit<NewsItem, 'id' | 'date' | 'isLiked'>) {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .insert({
        title: announcement.title,
        content: announcement.content,
        author: announcement.author,
        category: announcement.category,
        likes: announcement.likes,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
}

// ==================== RESOURCES ====================

export async function fetchResources() {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(resource => ({
      id: resource.id,
      title: resource.title,
      description: resource.description || '',
      category: resource.category as Resource['category'],
      fileType: resource.file_type as Resource['fileType'],
      size: resource.size || '',
      uploadDate: new Date(resource.created_at).toLocaleDateString(),
      downloads: resource.downloads || 0,
      url: resource.url,
    })) || [];
  } catch (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
}

export async function createResource(resource: Omit<Resource, 'id' | 'uploadDate'>) {
  try {
    const { data, error } = await supabase
      .from('resources')
      .insert({
        title: resource.title,
        description: resource.description,
        category: resource.category,
        file_type: resource.fileType,
        size: resource.size,
        url: resource.url || '',
        downloads: resource.downloads,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
}

export async function incrementResourceDownloads(id: string) {
  try {
    const { error } = await supabase.rpc('increment_downloads', { resource_id: id });
    if (error) throw error;
  } catch (error) {
    console.error('Error incrementing downloads:', error);
  }
}

// ==================== REAL-TIME SUBSCRIPTIONS ====================

export function subscribeToEvents(callback: (event: any) => void) {
  const subscription = supabase
    .channel('events')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'events' },
      callback
    )
    .subscribe();

  return () => subscription.unsubscribe();
}

export function subscribeToAnnouncements(callback: (announcement: any) => void) {
  const subscription = supabase
    .channel('announcements')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'announcements' },
      callback
    )
    .subscribe();

  return () => subscription.unsubscribe();
}