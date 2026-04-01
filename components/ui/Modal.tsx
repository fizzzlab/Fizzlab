'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={cn('modal-content', maxWidth, 'w-full')}>
        {(title || description) && (
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4">
              {title && (
                <h2 className="text-lg font-semibold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-700/40 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            {description && (
              <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
