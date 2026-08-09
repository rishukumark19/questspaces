import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from '../../lib/auth';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
    { name: 'Properties', path: '/admin/properties', icon: 'real_estate_agent' },
    { name: 'Leads & Inquiries', path: '/admin/leads', icon: 'inbox' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-container-lowest font-body-md text-on-surface">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-primary text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <Link to="/" className="flex items-center gap-2">
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
          <Link to="/" className="flex items-center gap-2 mb-8">
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
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-label-bold text-white/70 hover:bg-white/10 hover:text-white transition-colors text-left"
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
    </div>
  );
}
