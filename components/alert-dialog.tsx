'use client';

import { useState } from 'react';

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

export function AlertDialog({ isOpen, title, description, onClose }: AlertDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-violet-200 animate-slide-up">
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 active:scale-95"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
