import React, { useEffect, useState } from 'react';

interface Props {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export default function ChangeEmailModal({ isOpen, onClose }: Props) {
  const [isClosing, setIsClosing] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Handle animated close
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setNewEmail('');
      setConfirmEmail('');
    }, 200); // Match animation duration
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('New email:', newEmail);
    handleClose();
  };

  return (
    <div 
      className={`fixed inset-0 backdrop-blur-xs backdrop-brightness-90 flex items-center justify-center z-[9999] p-4 transition-all duration-200 ${
        isClosing ? 'animate-out fade-out' : 'animate-in fade-in'
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-email-title"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      }}
      tabIndex={-1}
    >
      <div className={`bg-white rounded-2xl max-w-md w-full shadow-2xl relative transition-all duration-200 ${
        isClosing ? 'animate-out zoom-out-95' : 'animate-in zoom-in-95'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-300">
          <div className="flex justify-between items-center">
            <h2 id="change-email-title" className="text-xl font-bold text-gray-900">Ubah Email</h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Tutup modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Email Baru */}
            <div>
              <label htmlFor="newEmail" className="block text-sm font-medium text-gray-900 mb-2">
                Email Baru
              </label>
              <input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 focus:outline-none transition-colors"
                placeholder="Masukkan email baru"
                required
              />
            </div>

            {/* Konfirmasi Email */}
            <div>
              <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-900 mb-2">
                Konfirmasi Email
              </label>
              <input
                id="confirmEmail"
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 focus:outline-none transition-colors"
                placeholder="Konfirmasi email baru"
                required
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="px-8 py-3 bg-purple-700 text-white font-semibold rounded-xl hover:bg-purple-800 transition-colors"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
