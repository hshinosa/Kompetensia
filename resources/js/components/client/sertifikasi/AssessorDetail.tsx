import React from 'react';

interface AsesorData {
  readonly nama: string;
  readonly keahlian: string;
  readonly pengalaman: string;
  readonly kontak: string;
  readonly foto?: string;
}

interface Props {
  readonly asesor?: AsesorData;
}

const sampleAsesor = {
  nama: "Alyssa",
  keahlian: "Digital Marketing",
  pengalaman: "PT. Digital Solutions Indonesia",
  kontak: "alyssa@example.com",
  foto: undefined
};

export default function AssessorDetail({ asesor }: Props) {
  const displayAsesor = asesor || sampleAsesor;
  
  return (
    <div id="assessor">
      <h4 className="text-lg font-semibold mb-3 text-gray-900">Detail Assessor</h4>
      <div className="flex items-start gap-4">
        <img 
          src={displayAsesor.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayAsesor.nama)}&background=8B5CF6&color=fff`} 
          alt={displayAsesor.nama} 
          className="w-12 h-12 rounded-full object-cover" 
        />
        <div>
          <div className="font-semibold text-gray-900">{displayAsesor.nama}</div>
          <div className="text-sm text-gray-600">{displayAsesor.keahlian}</div>
          <p className="text-sm text-gray-700 mt-3">
            Instansi: {displayAsesor.pengalaman}
          </p>
        </div>
      </div>
     </div>
   );
 }
