import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Toast = () => {
  const { toast } = useAuth();
  if (!toast.visible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#2a2a2a]/95 text-[#e5e2e1] px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 backdrop-blur max-w-[90vw] border border-white/10">
      <span className="material-symbols-outlined text-[#e50914] text-[20px]">verified</span>
      <span className="text-sm font-medium tracking-wide text-center">{toast.message}</span>
    </div>
  );
};
