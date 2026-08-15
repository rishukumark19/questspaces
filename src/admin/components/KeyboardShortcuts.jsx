import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function KeyboardShortcuts() {
  const navigate = useNavigate();
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [lastKey, setLastKey] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      }

      // Escape to close cheat sheet
      if (e.key === 'Escape') {
        setShowCheatSheet(false);
        return;
      }

      // Toggle cheat sheet with ?
      if (e.key === '?') {
        setShowCheatSheet(prev => !prev);
        return;
      }

      // / to focus search
      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"][placeholder*="Search" i], input[type="search"]');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
        return;
      }

      const key = e.key.toLowerCase();

      // Global navigation (g then key)
      if (lastKey === 'g') {
        if (key === 'd') navigate('/admin');
        if (key === 'p') navigate('/admin/properties');
        if (key === 'l') navigate('/admin/leads');
        setLastKey(null);
        return;
      }

      if (key === 'g') {
        setLastKey('g');
        // Reset lastKey after 1 second if no follow-up key
        setTimeout(() => setLastKey(null), 1000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastKey, navigate]);

  if (!showCheatSheet) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowCheatSheet(false)}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative p-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <button 
          onClick={() => setShowCheatSheet(false)}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
        
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">keyboard</span>
          Keyboard Shortcuts
        </h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Navigation</h4>
            <div className="space-y-2">
              <ShortcutRow keys={['G', 'D']} label="Go to Dashboard" />
              <ShortcutRow keys={['G', 'P']} label="Go to Properties" />
              <ShortcutRow keys={['G', 'L']} label="Go to Leads" />
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Actions</h4>
            <div className="space-y-2">
              <ShortcutRow keys={['/']} label="Focus Search Bar" />
              <ShortcutRow keys={['Ctrl', 'S']} label="Save Property" />
              <ShortcutRow keys={['Esc']} label="Close Modals/Drawers" />
              <ShortcutRow keys={['?']} label="Show this Cheat Sheet" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShortcutRow({ keys, label }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-700">{label}</span>
      <div className="flex items-center gap-1">
        {keys.map((k, i) => (
          <React.Fragment key={i}>
            <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-mono font-bold text-slate-600 shadow-sm">
              {k}
            </kbd>
            {i < keys.length - 1 && <span className="text-slate-400 text-xs">+</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
