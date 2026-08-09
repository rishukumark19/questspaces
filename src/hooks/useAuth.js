import { useState, useEffect } from 'react';
import { getSession, onAuthStateChange } from '../lib/auth.js';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then(s => { setSession(s); setLoading(false); });
    const sub = onAuthStateChange(s => { setSession(s); setLoading(false); });
    return () => sub.unsubscribe();
  }, []);

  return { session, loading, isAuthenticated: !!session };
}
