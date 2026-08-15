import React from 'react';

export default function Toast({ toast, onClose }) {
  const { message, type } = toast;

  const typeConfig = {
    success: {
      icon: 'check_circle',
      bgColor: 'bg-emerald-600',
      iconColor: 'text-emerald-100',
    },
    error: {
      icon: 'error',
      bgColor: 'bg-red-600',
      iconColor: 'text-red-100',
    },
    info: {
      icon: 'info',
      bgColor: 'bg-blue-600',
      iconColor: 'text-blue-100',
    },
    warning: {
      icon: 'warning',
      bgColor: 'bg-amber-500',
      iconColor: 'text-amber-50',
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300 text-white overflow-hidden ${config.bgColor}`}>
      <span className={`material-symbols-outlined ${config.iconColor}`}>{config.icon}</span>
      <p className="font-semibold text-sm mr-4">{message}</p>
      <button 
        onClick={onClose} 
        className="ml-auto text-white/70 hover:text-white transition-colors flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/30" style={{ width: '100%', animation: 'toast-progress 3.5s linear forwards' }}></div>
    </div>
  );
}
