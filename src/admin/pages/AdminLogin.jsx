import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signIn } from '../../lib/auth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low font-body-md">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-outline-variant/30">
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-gold text-4xl mb-2">apartment</span>
          <h1 className="font-headline-md text-2xl font-bold text-primary">QuestSpaces Admin</h1>
          <p className="text-on-surface-variant text-sm mt-1">Sign in to manage properties</p>
        </div>

        {error && (
          <div className="bg-error/10 text-error p-3 rounded-lg text-sm font-semibold mb-6 flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-label-bold text-primary mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-2.5 outline-none transition-colors"
              placeholder="admin@questspaces.com"
            />
          </div>
          <div>
            <label className="block text-sm font-label-bold text-primary mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-2.5 pr-10 outline-none transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-primary transition-colors focus:outline-none bg-transparent border-none cursor-pointer flex items-center justify-center p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-label-bold uppercase tracking-wider hover:bg-primary-container transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-12"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
