import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import PendaftaranNavbar from '@/components/client/pendaftaran-pkl/PendaftaranNavbar';
import Footer from '@/components/client/Footer';
import StepIndicator from '@/components/client/pendaftaran-pkl/StepIndicator';
import DataDiriForm from '@/components/client/pendaftaran-pkl/DataDiriForm';
import BackgroundPendidikanForm from '@/components/client/pendaftaran-pkl/BackgroundPendidikanForm';
import SkillMinatForm from '@/components/client/pendaftaran-pkl/SkillMinatForm';
import KebijakanFinalisasiForm from '@/components/client/pendaftaran-pkl/KebijakanFinalisasiForm';

interface User {
  id: number;
  nama: string;
  nama_lengkap?: string;
  email: string;
  telepon?: string;
  alamat?: string;
  tanggal_lahir?: string;
  tempat_lahir?: string;
  role: string;
}

interface PageProps extends Record<string, any> {
  auth?: {
    client?: User;
  };
}

interface PosisiPKL {
  id: number;
  nama_posisi: string;
  kategori: string;
  deskripsi: string;
  persyaratan: string[] | string;
  benefits: string[] | string;
  tipe: string;
  durasi_bulan: number;
  jumlah_pendaftar: number;
  status: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
}

interface ActiveRegistration {
  id: number;
  status: string;
  posisi_pkl_id: number;
  posisi_nama: string;
  tanggal_selesai?: string;
  tanggal_pendaftaran?: string;
  penilaian_status?: string | null;
}

interface PendaftaranPKLPageProps {
  readonly posisiPKL?: PosisiPKL;
  readonly allPosisiPKL?: Array<{
    id: number;
    nama_posisi: string;
    kategori: string;
    tipe: string;
    durasi_bulan: number;
    already_registered?: boolean;
  }>;
  readonly existingRegistrations?: number[];
  readonly activeRegistration?: ActiveRegistration;
  readonly error?: string;
}

export default function PendaftaranPKLPage({ posisiPKL, allPosisiPKL = [], existingRegistrations = [], activeRegistration }: PendaftaranPKLPageProps) {
  const { auth } = usePage<PageProps>().props;
  const user = auth?.client;
  
  const [currentStep, setCurrentStep] = useState(1);
  
  // Helper function to format date for input[type="date"]
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      // Check if date is valid and not too far in the past
      if (isNaN(date.getTime()) || date.getFullYear() < 1900) {
        return '';
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      return '';
    }
  };

  const [formData, setFormData] = useState({
    // Data Diri - Prefilled with user data
    namaLengkap: user?.nama_lengkap || user?.nama || '',
    tempatLahir: user?.tempat_lahir || '',
    tanggalLahir: formatDateForInput(user?.tanggal_lahir) || '',
    email: user?.email || '',
    nomorHandphone: user?.telepon || '',
    alamat: user?.alamat || '',
    instagram: '',
    tiktok: '',
    memilikiLaptop: '',
    memilikiKameraDSLR: '',
    transportasiOperasional: '',
    
    // Background Pendidikan
    institusiAsal: '', // Added missing field
    asalSekolah: '',
    jurusan: '',
    kelas: '',
    programStudi: '',
    semester: '',
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
    motivasi: '',
    nilaiDiri: '',
    apakahMerokok: '',
    bersediaDitempatkan: '',
    bersediaMasuk2Kali: '',
    
    // Berkas
    cv_file_path: '',
    cv_file_name: '',
    portfolio_file_path: '',
    portfolio_file_name: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Update form data when user data changes or becomes available
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        namaLengkap: user.nama_lengkap || user.nama || prevData.namaLengkap,
        tempatLahir: user.tempat_lahir || prevData.tempatLahir,
        tanggalLahir: formatDateForInput(user.tanggal_lahir) || prevData.tanggalLahir,
        email: user.email || prevData.email,
        nomorHandphone: user.telepon || prevData.nomorHandphone,
        alamat: user.alamat || prevData.alamat,
      }));
    }
  }, [user]);

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

    const handleSubmit = () => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Check if user is trying to register for a position they already registered for
    const selectedPosisiId = formData.bidangYangDisukai ? parseInt(formData.bidangYangDisukai) : null;
    if (selectedPosisiId && existingRegistrations.includes(selectedPosisiId)) {
      const selectedPosisi = allPosisiPKL.find(p => p.id === selectedPosisiId);
      const posisiName = selectedPosisi?.nama_posisi || 'posisi ini';
      
      setSubmitError(`Anda sudah memiliki pendaftaran aktif untuk ${posisiName}. Silakan pilih posisi PKL yang berbeda.`);
      setIsSubmitting(false);
      return;
    }

    const transformedData = {
      // Data Diri - Use bidang_yang_disukai as the main field, fallback to posisiPKL?.id
      posisi_pkl_id: formData.bidangYangDisukai ? parseInt(formData.bidangYangDisukai) : (posisiPKL?.id ? parseInt(posisiPKL.id.toString()) : 1),
      nama_lengkap: formData.namaLengkap,
      tempat_lahir: formData.tempatLahir,
      tanggal_lahir: formData.tanggalLahir,
      email_pendaftar: formData.email,
      nomor_handphone: formData.nomorHandphone,
      alamat: formData.alamat,
      instagram: formData.instagram,
      tiktok: formData.tiktok,
      memiliki_laptop: formData.memilikiLaptop,
      memiliki_kamera_dslr: formData.memilikiKameraDSLR,
      transportasi_operasional: formData.transportasiOperasional,
      
      // Background Pendidikan
      institusi_asal: formData.institusiAsal,
      asal_sekolah: formData.asalSekolah,
      jurusan: formData.jurusan,
      kelas: formData.kelas,
      program_studi: formData.programStudi,
      semester: formData.semester ? parseInt(formData.semester) : null,
      awal_pkl: formData.awalPKL,
      akhir_pkl: formData.akhirPKL,
      
      // Skill & Minat
      kemampuan_ditingkatkan: formData.kemampuanDitingkatkan,
      skill_kelebihan: formData.skillKelebihan,
      // Remove bidang_yang_disukai since we're using posisi_pkl_id consistently
      pernah_membuat_video: formData.pernahMembuatVideo,
      
      // Kebijakan & Finalisasi
      sudah_melihat_profil: formData.sudahMelihatProfil,
      tingkat_motivasi: formData.tingkatMotivasi,
      motivasi: formData.motivasi,
      nilai_diri: formData.nilaiDiri,
      apakah_merokok: formData.apakahMerokok,
      bersedia_ditempatkan: formData.bersediaDitempatkan,
      bersedia_masuk_2_kali: formData.bersediaMasuk2Kali,
      
      // Berkas
      cv_file_path: formData.cv_file_path,
      cv_file_name: formData.cv_file_name,
      portfolio_file_path: formData.portfolio_file_path,
      portfolio_file_name: formData.portfolio_file_name,
    };

    router.post('/client/pendaftaran-pkl', transformedData, {
      onSuccess: () => {
        setIsSubmitting(false);
        setShowSuccessModal(true);
      },
      onError: (errors) => {
        let errorMessage = 'Gagal membuat pendaftaran. Silakan coba lagi.';
        
        if (errors.error) {
          errorMessage = errors.error.replace('Terjadi kesalahan dalam memproses pendaftaran: ', '');
        } else if (typeof errors === 'string') {
          errorMessage = errors;
        } else if (errors.message) {
          errorMessage = errors.message;
        } else if (errors && typeof errors === 'object') {
          const validationErrors = Object.entries(errors)
            .filter(([key, value]) => Array.isArray(value))
            .map(([key, messages]) => `${key}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          
          if (validationErrors) {
            errorMessage = `Validation errors:\n${validationErrors}`;
          } else {
            errorMessage = `Error: ${JSON.stringify(errors)}`;
          }
        }
        
        setSubmitError(errorMessage);
        setIsSubmitting(false);
      }
    });
  };

  const renderCurrentForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <DataDiriForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onNext={handleNext}
            user={user}
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
            allPosisiPKL={allPosisiPKL}
            existingRegistrations={existingRegistrations}
          />
        );
      case 4:
        return (
          <KebijakanFinalisasiForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onBack={handleBack}
            posisiPKL={posisiPKL}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            errors={submitError ? { general: submitError } : {}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PendaftaranNavbar />

      <main className="flex-1 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Form Pendaftaran PKL</h1>
            <p className="text-sm sm:text-base text-gray-600">Lengkapi formulir di bawah untuk mendaftar program PKL</p>
          </div>

          {/* Active Registration Warning */}
          {activeRegistration && activeRegistration.penilaian_status !== 'Diterima' && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-6 mb-8 rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Anda Sudah Memiliki Pendaftaran PKL Aktif
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {activeRegistration.status === 'Pengajuan' && (
                      <>Pendaftaran Anda untuk posisi <strong>{activeRegistration.posisi_nama}</strong> sedang menunggu persetujuan admin. Anda tidak dapat mendaftar PKL baru hingga pendaftaran ini diproses.</>
                    )}
                    {activeRegistration.status === 'Disetujui' && (
                      <>Anda sedang menjalani PKL di posisi <strong>{activeRegistration.posisi_nama}</strong>{activeRegistration.tanggal_selesai ? ` hingga ${new Date(activeRegistration.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}. {activeRegistration.penilaian_status ? 'Anda hanya dapat mendaftar PKL baru setelah dinyatakan LULUS oleh asesor.' : 'Anda hanya dapat mendaftar PKL baru setelah dinyatakan LULUS oleh asesor atau PKL saat ini selesai.'}</>
                    )}
                    {activeRegistration.status === 'Menunggu' && (
                      <>Pendaftaran Anda untuk posisi <strong>{activeRegistration.posisi_nama}</strong> sedang dalam proses. Silakan tunggu hingga proses selesai.</>
                    )}
                  </p>
                  <p className="text-gray-600 text-xs mt-3">
                    <strong>Catatan:</strong> Form di bawah ini tidak akan dapat dikirim selama Anda masih memiliki pendaftaran aktif.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step Indicator */}
          <StepIndicator steps={steps} />

          {/* Form Content */}
          <div className="mt-6 sm:mt-8">
            {renderCurrentForm()}
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full text-center border-4 border-purple-600 shadow-2xl">
            <div className="mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Pendaftaran PKL Anda telah berhasil dikirim. Tim kami akan segera meninjau pendaftaran Anda dan memberikan konfirmasi melalui email.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.visit('/dashboard');
                }}
                className="flex-1 px-4 py-2.5 sm:py-2 bg-purple-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Lihat Dashboard
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.visit('/pkl');
                }}
                className="flex-1 px-4 py-2.5 sm:py-2 border border-gray-300 text-gray-700 text-sm sm:text-base font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Lihat Program PKL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
