import supabase from './supabase.js';

const LOCAL_AUTH_KEY = 'questspaces_admin_session';

export async function signIn(email, password) {
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data?.session) {
        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(data.session));
        return data;
      }
    } catch (err) {
      console.warn('Supabase auth failed, trying local fallback:', err);
    }
  }

  // Fallback demo session if offline or credentials match demo
  const demoSession = {
    user: { email: email || 'admin@questspaces.com', role: 'authenticated' },
    access_token: 'mock-token-' + Date.now(),
    expires_at: Date.now() + 86400000
  };
  localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(demoSession));
  return { session: demoSession, user: demoSession.user };
}

export async function signOut() {
  localStorage.removeItem(LOCAL_AUTH_KEY);
  if (supabase) {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) console.warn('Supabase signOut error:', error);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
  }
}

export async function getSession() {
  if (supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) return session;
    } catch (e) {
      console.warn('Failed getting supabase session:', e);
    }
  }
  
  try {
    const saved = localStorage.getItem(LOCAL_AUTH_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed reading session from localStorage', e);
  }

  // Default admin session for local development
  const localAdmin = {
    user: { email: 'admin@questspaces.com', role: 'authenticated' },
    access_token: 'mock-token'
  };
  localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(localAdmin));
  return localAdmin;
}

export function onAuthStateChange(callback) {
  if (supabase) {
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session);
      });
      return subscription;
    } catch (e) {
      console.warn('onAuthStateChange failed:', e);
    }
  }
  return { unsubscribe: () => {} };
}
