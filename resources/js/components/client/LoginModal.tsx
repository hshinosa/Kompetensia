import React from 'react';

export default function LoginModal({ onClose }: { onClose?: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl p-8 pt-6 w-[400px] max-w-full relative border-4 border-purple-700" style={{ boxShadow: '0 0 0 6px #6D28D9' }}>
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 bg-orange-200 rounded-lg p-2 hover:bg-orange-300"
          onClick={onClose}
          aria-label="Tutup Modal"
        >
          <span className="sr-only">Tutup</span>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#F3CBA5"/><path d="M8 8l8 8M16 8l-8 8" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <h2 className="text-4xl font-bold mb-6 mt-2">Masuk</h2>
        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-lg font-semibold mb-2">Alamat Email</label>
            <input
              id="email"
              type="email"
              placeholder="cth. giga23@yahoo.com"
              className="w-full px-4 py-3 rounded-lg border-2 border-purple-400 focus:border-purple-700 outline-none text-base mb-1"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-semibold mb-2">Password</label>
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="minimal 8 karakter"
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-400 focus:border-purple-700 outline-none text-base pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 17a5 5 0 100-10 5 5 0 000 10z" stroke="#2D2D2D" strokeWidth="2"/><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="#2D2D2D" strokeWidth="2"/></svg>
              </span>
            </div>
            <div className="flex justify-end mt-1">
              <a href="#" className="text-xs text-gray-700 underline">Lupa Kata Sandi</a>
            </div>
          </div>
          <button type="submit" className="w-full py-3 rounded-lg bg-purple-700 text-white font-semibold text-lg mt-2 mb-2">Masuk</button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">atau masuk dengan</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
        <button className="w-full py-3 rounded-lg border-2 border-orange-300 bg-white text-black font-semibold flex items-center justify-center gap-2 mb-2">
          <svg width="24" height="24" viewBox="0 0 24 24"><g><path fill="#EA4335" d="M12 10.8v2.4h6.7c-.3 1.4-1.7 4.1-6.7 4.1-4 0-7.3-3.3-7.3-7.3s3.3-7.3 7.3-7.3c2.3 0 3.8.9 4.7 1.7l-1.9 1.9c-.6-.5-1.6-1.2-2.8-1.2-2.4 0-4.3 2-4.3 4.4s1.9 4.4 4.3 4.4c2.8 0 3.7-1.1 4.1-1.7h-4.1z"/><path fill="#34A853" d="M21.6 12.2c0-.8-.1-1.6-.2-2.4H12v4.1h5.3c-.2 1.1-.9 2.1-1.9 2.7v2.2h3c1.7-1.6 2.7-4 2.7-6.7z"/><path fill="#FBBC05" d="M4.7 14.3c-.3-.8-.5-1.7-.5-2.7s.2-1.9.5-2.7V6.7H1.6C.6 8.5 0 10.6 0 12.6s.6 4.1 1.6 5.9l3.1-2.2z"/><path fill="#4285F4" d="M12 22c2.4 0 4.4-.8 5.9-2.2l-3-2.2c-.8.5-1.8.8-2.9.8-2.2 0-4.1-1.5-4.8-3.5H1.6v2.2C3.1 20.2 7.2 22 12 22z"/></g></svg>
          Masuk Dengan Google
        </button>
        <div className="text-center mt-2 text-base">
          Belum punya akun? <a href="#" className="font-semibold text-purple-700 underline">Daftar</a>
        </div>
      </div>
    </div>
  );
}
