import React from 'react';

// Developer note:
// - To change the left-nav width, adjust the `w-56` / `max-w-[220px]` classes below.
// - The sticky offset is controlled by `top-28`; modify it if your header height changes.
// - This component is placed in a grid where the sidebar column controls overall layout.
interface Props {
  readonly onOpen?: () => void;
}

export default function LeftNavSertifikasi({ onOpen }: Props) {
  return (
    // `w-65` keeps the nav compact; `max-w-[250px]` ensures it doesn't grow too large on small screens
    <nav className="sticky top-28 self-start w-65 max-w-[250px]">
      <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
        <ul className="space-y-3">
          <li>
            <a href="#detail" className="block px-3 py-2 rounded-md bg-white text-sm font-medium">Detail Sertifikasi</a>
          </li>
          <li>
            <a href="#materi" className="block px-3 py-2 rounded-md text-sm">Materi Sertifikasi</a>
          </li>
          <li>
            <a href="#batch" className="block px-3 py-2 rounded-md text-sm">Pilihan Batch</a>
          </li>
          <li>
            <a href="#assessor" className="block px-3 py-2 rounded-md text-sm">Detail Assessor</a>
          </li>
          <li>
            <a href="#review" className="block px-3 py-2 rounded-md text-sm">Review Sertifikasi</a>
          </li>
          <li>
            <a href="#recommend" className="block px-3 py-2 rounded-md text-sm">Rekomendasi Sertifikasi</a>
          </li>
        </ul>
        <div className="mt-4">
          <button onClick={() => onOpen?.()} className="w-full px-4 py-2 rounded-md bg-purple-700 text-white font-semibold">Daftar</button>
        </div>
      </div>
    </nav>
  );
}
