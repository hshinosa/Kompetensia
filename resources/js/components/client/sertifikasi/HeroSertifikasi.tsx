import React from 'react';

interface SertifikasiData {
  readonly id: number;
  readonly nama_sertifikasi: string;
  readonly jenis_sertifikasi: string;
  readonly deskripsi: string;
  readonly thumbnail?: string;
}

interface Props {
  readonly sertifikasi?: SertifikasiData;
  readonly onOpen?: () => void;
}

export default function HeroSertifikasi({ sertifikasi, onOpen }: Props) {
  const defaultTitle = 'Digital Marketing';
  const defaultDescription = 'Bangun kompetensi di dunia pemasaran digital yang selalu berkembang dengan tools dan strategi terkini.';
  const defaultImage = '/images/hero-sertif.png';

  const title = sertifikasi?.nama_sertifikasi || defaultTitle;
  const description = sertifikasi?.deskripsi || defaultDescription;
  const backgroundImage = sertifikasi?.thumbnail ? `url('${sertifikasi.thumbnail}')` : `url('${defaultImage}')`;

  return (
    <header className="relative w-full h-[380px] lg:h-[420px] bg-cover bg-center rounded-b-md" style={{ backgroundImage }}>
      <div className="absolute inset-0 bg-black opacity-30" />
      <div className="relative z-10 container mx-auto px-4 lg:px-0 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl lg:text-4xl font-extrabold mb-3">{title}</h1>
          <p className="text-sm lg:text-base text-white/90">{description}</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => onOpen?.()} className="px-4 py-2 rounded-md bg-purple-700 text-white font-semibold">Daftar Sertifikasi</button>
            <button className="px-4 py-2 rounded-md border border-orange-400 text-black font-sm bg-white/100">Temukan Skillmu</button>
          </div>
        </div>
      </div>
    </header>
  );
}
