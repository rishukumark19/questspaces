import React, { useState, useEffect } from 'react';

export default function ConfirmDialog({ isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel', theme = 'primary', icon = null, requireTypeToConfirm = null, isLoading = false, onConfirm, onClose }) {
  const [typedValue, setTypedValue] = useState('');

  useEffect(() => {
    if (isOpen) setTypedValue('');
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfirmed = requireTypeToConfirm ? typedValue === requireTypeToConfirm : true;

  const themeClasses = {
    primary: {
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      btn: 'bg-primary hover:bg-primary-container text-white',
    },
    amber: {
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      btn: 'bg-amber-500 hover:bg-amber-600 text-white',
    },
    red: {
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      btn: 'bg-red-600 hover:bg-red-700 text-white',
    }
  };

  const currentTheme = themeClasses[theme] || themeClasses.primary;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start gap-4 mb-4">
          {icon && (
            <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center ${currentTheme.iconBg} ${currentTheme.iconColor}`}>
              <span className="material-symbols-outlined text-[24px]">{icon}</span>
            </div>
          )}
          <div className="pt-1">
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{message}</p>
          </div>
        </div>

        {requireTypeToConfirm && (
          <div className="mt-4 mb-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Type <span className="font-mono bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded select-all">{requireTypeToConfirm}</span> to confirm
            </label>
            <input
              type="text"
              value={typedValue}
              onChange={(e) => setTypedValue(e.target.value)}
              placeholder={requireTypeToConfirm}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>
        )}
        
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading || !isConfirmed}
            className={`px-5 py-2 rounded-xl text-sm font-semibold shadow-sm flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${currentTheme.btn}`}
          >
            {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
