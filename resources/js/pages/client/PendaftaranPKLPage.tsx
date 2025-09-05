import React, { useState } from 'react';
import PendaftaranNavbar from '@/components/client/pendaftaran-pkl/PendaftaranNavbar';
import Footer from '@/components/client/Footer';
import StepIndicator from '@/components/client/pendaftaran-pkl/StepIndicator';
import DataDiriForm from '@/components/client/pendaftaran-pkl/DataDiriForm';
import BackgroundPendidikanForm from '@/components/client/pendaftaran-pkl/BackgroundPendidikanForm';
import SkillMinatForm from '@/components/client/pendaftaran-pkl/SkillMinatForm';
import KebijakanFinalisasiForm from '@/components/client/pendaftaran-pkl/KebijakanFinalisasiForm';

interface PendaftaranPKLPageProps {
  readonly programId?: number;
}

export default function PendaftaranPKLPage({ programId }: PendaftaranPKLPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Data Diri
    namaLengkap: '',
    tempatLahir: '',
    tanggalLahir: '',
    email: '',
    nomorHandphone: '',
    alamat: '',
    instagram: '',
    tiktok: '',
    memilikiLaptop: '',
    memilikiKameraDSLR: '',
    transportasiOperasional: '',
    
    // Background Pendidikan
    asalSekolah: '',
    jurusan: '',
    kelas: '',
    awalPKL: '',
    akhirPKL: '',
    
    // Skill & Minat
    kemampuanDitingkatkan: '',
    skillKelebihan: '',
    bidangYangDisukai: '',
    pernahMembuatVideo: '',
    
    // Kebijakan & Finalisasi
    sudahMelihatProfil: '',
    tingkatMotivasi: 1,
    nilaiDiri: '',
    apakahMerokok: '',
    bersediaDitempatkan: '',
    bersediaMasuk2Kali: ''
  });

  const steps = [
    { number: 1, title: 'Data Diri', isActive: currentStep === 1, isCompleted: currentStep > 1 },
    { number: 2, title: 'Background Pendidikan', isActive: currentStep === 2, isCompleted: currentStep > 2 },
    { number: 3, title: 'Skill & Minat', isActive: currentStep === 3, isCompleted: currentStep > 3 },
    { number: 4, title: 'Kebijakan & Finalisasi', isActive: currentStep === 4, isCompleted: currentStep > 4 }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormDataChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderCurrentForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <DataDiriForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <BackgroundPendidikanForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <SkillMinatForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <KebijakanFinalisasiForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onBack={handleBack}
            programId={programId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PendaftaranNavbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Pendaftaran PKL</h1>
          </div>

          {/* Step Indicator */}
          <StepIndicator steps={steps} />

          {/* Form Content */}
          <div className="mt-8">
            {renderCurrentForm()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
