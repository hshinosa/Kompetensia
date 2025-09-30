import React from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToDashboard?: () => void;
}

export default function SuccessModal({ isOpen, onClose, onGoToDashboard }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Pendaftaran Berhasil!
        </h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Anda telah berhasil mendaftar untuk program PKL. Pendaftaran Anda akan segera ditinjau oleh admin. 
          Kami akan mengirimkan pemberitahuan melalui email mengenai status pendaftaran Anda.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Tutup
          </button>
          
          {onGoToDashboard && (
            <button
              onClick={onGoToDashboard}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Lihat Status Pendaftaran
            </button>
          )}
        </div>
      </div>
    </div>
  );
}