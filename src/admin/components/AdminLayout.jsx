import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from '../../lib/auth';
import { getAllLeads } from '../../lib/leads';
import { ToastProvider } from '../hooks/useToast';
import supabase from '../../lib/supabase';
import KeyboardShortcuts from './KeyboardShortcuts';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadLeads, setUnreadLeads] = useState(0);
  const [user, setUser] = useState({ name: 'Admin', email: 'admin@questspaces.com', initials: 'AD' });

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getAllLeads({ status: 'New' });
        setUnreadLeads(data?.length || 0);
      } catch (e) {
        console.error('Failed to fetch leads', e);
      }
    };
    
    const fetchUser = async () => {
      try {
        if (supabase) {
          const { data } = await supabase.auth.getUser();
          const name = data?.user?.user_metadata?.full_name || data?.user?.user_metadata?.name || 'Admin';
          const email = data?.user?.email || 'admin@questspaces.com';
          const initials = name.substring(0, 2).toUpperCase();
          setUser({ name, email, initials });
        }
      } catch (e) {
        console.error('Failed to fetch user', e);
      }
    };

    fetchLeads();
    fetchUser();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const navItems = [
    { name: 'Home', path: '/admin', icon: 'home' },
    { name: 'My Listings', path: '/admin/properties', icon: 'apartment' },
    { name: 'Client Inquiries', path: '/admin/leads', icon: 'person_raised_hand', badge: unreadLeads },
    { name: 'Insights', path: '/admin/insights', icon: 'article' },
    { name: 'Testimonials', path: '/admin/testimonials', icon: 'format_quote' },
  ];

  return (
    <ToastProvider>
      <div className="flex flex-col md:flex-row min-h-screen bg-surface-container-lowest font-body-md text-on-surface">
        
        {/* Mobile Header Bar */}
        <div className="md:hidden bg-primary text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gold text-[24px]">apartment</span>
            <span className="font-bold text-base tracking-wide">QUEST SPACES ADMIN</span>
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-white hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Drawer Backdrop */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`w-64 bg-primary text-white flex flex-col shadow-lg shrink-0 fixed md:sticky top-0 h-screen z-50 transition-transform duration-300 overflow-y-auto ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="p-6">
            <Link to="/admin" className="flex items-center gap-2 mb-8">
              <span className="material-symbols-outlined text-gold text-[28px]">apartment</span>
              <div>
                <div className="font-headline-md font-bold text-lg leading-tight tracking-wide">QUEST SPACES</div>
                <div className="text-[10px] text-white/70 uppercase tracking-[0.2em] font-bold">Admin Panel</div>
              </div>
            </Link>
            
            <nav className="space-y-2">
              {navItems.map(item => {
                const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-bold transition-colors ${
                      isActive ? 'bg-primary-container text-white shadow-sm' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span className="flex-1">{item.name}</span>
                    {item.badge > 0 && (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
              
              <div className="my-4 border-t border-white/10"></div>
              
              <button
                onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }))}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg font-label-bold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">keyboard</span>
                  <span>Shortcuts</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">Shift</kbd>
                  <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">?</kbd>
                </div>
              </button>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-label-bold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                <span className="flex-1">View Live Website</span>
              </a>
            </nav>
          </div>
          
          <div className="mt-auto p-6 border-t border-white/10 bg-black/10">
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center font-bold text-white border border-white/20 shadow-sm shrink-0">
                {user.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate">{user.name}</div>
                <div className="text-[10px] text-white/50 truncate font-medium">{user.email}</div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-label-bold text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden min-h-screen">
          <Outlet />
        </main>
        
        <KeyboardShortcuts />
      </div>
    </ToastProvider>
  );
}
