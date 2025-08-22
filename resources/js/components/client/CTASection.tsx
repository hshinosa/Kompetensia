import React from 'react';

export default function CTASection() {
  return (
    <section className="px-40 py-12">
      <div className="relative">
        <div className="rounded-3xl bg-gradient-to-r from-[#EEB18B] to-[#8E28E9] flex flex-col md:flex-row items-center p-10 shadow-lg relative">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Melangkah & Wujudkan Karir Impianmu Bersama</h2>
            <p className="text-gray-700 mb-8">Tingkatkan keahlianmu dan jadilah spesialis dibidang karirmu</p>
            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-lg bg-purple-700 text-white font-semibold text-lg shadow-md hover:bg-purple-800">Temukan Bidangmu</button>
              <button className="px-6 py-3 rounded-lg bg-white text-gray-900 font-semibold text-lg border border-gray-300 hover:bg-gray-100">Sertifikasi Keahlianmu</button>
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <img src="/images/hero2.png" alt="Karir" className="rounded-2xl object-cover w-[320px] h-[180px] md:w-[360px] md:h-[220px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
