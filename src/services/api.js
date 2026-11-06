import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nmqnqzhcqnwqskewxtkb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_vWVi0XlKxVqDq9Ks0tqILg_EC9jpzYl';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${supabaseUrl}/functions/v1/sync-sii`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Credenciales incorrectas o error en la sincronización.');
    }

    const data = await response.json();
    return data; // Solo retorna la respuesta al estado de React, sin guardar en Storage
  },
};

export const studentService = {
  getProfile: async (numeroControl) => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('numero_control', numeroControl)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  getGrades: async (numeroControl) => {
    const { data, error } = await supabase
      .from('current_grades')
      .select('*')
      .eq('student_control', numeroControl);

    if (error) throw error;
    return data;
  },

  getKardex: async (numeroControl) => {
    const { data, error } = await supabase
      .from('kardex')
      .select('*')
      .eq('student_control', numeroControl)
      .order('semestre', { ascending: true });

    if (error) throw error;
    return data;
  },

  getSchedule: async (numeroControl) => {
    const { data, error } = await supabase
      .from('schedule')
      .select('*')
      .eq('student_control', numeroControl);

    if (error) throw error;
    return data;
  },
};

export const extraService = {
  getEvents: async () => {
    const { data, error } = await supabase
      .from('academic_events')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  getBackground: async (numeroControl) => {
    const { data } = await supabase
      .from('user_settings')
      .select('background_url')
      .eq('numero_control', numeroControl)
      .maybeSingle();

    return data?.background_url || '';
  },

  saveBackground: async (numeroControl, background_url) => {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({ 
        numero_control: numeroControl, 
        background_url,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return data;
  },
};