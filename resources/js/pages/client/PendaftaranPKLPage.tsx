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
  readonly error?: string;
}

export default function PendaftaranPKLPage({ posisiPKL, allPosisiPKL = [], existingRegistrations = [] }: PendaftaranPKLPageProps) {
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
        console.warn('Invalid or suspicious date:', dateString);
        return '';
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.warn('Error formatting date:', dateString, error);
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
    // Enhanced logging especially for CV and portfolio fields
    const isBerkasField = field.includes('file');
    const logLevel = isBerkasField ? '=== BERKAS' : 'FORM';
    
    console.log(`${logLevel} DATA CHANGE ===`, {
      field: field,
      value: value,
      valueType: typeof value,
      isBerkasField: isBerkasField,
      isCVField: field.includes('cv'),
      isPortfolioField: field.includes('portfolio'),
      timestamp: new Date().toISOString()
    });
    
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [field]: value
      };
      
      // Log the current berkas state after update
      if (isBerkasField) {
        console.log('CURRENT BERKAS STATE AFTER UPDATE:', {
          cv_file_path: newFormData.cv_file_path,
          cv_file_name: newFormData.cv_file_name,
          portfolio_file_path: newFormData.portfolio_file_path,
          portfolio_file_name: newFormData.portfolio_file_name,
          updatedField: field,
          updatedValue: value
        });
      }
      
      return newFormData;
    });
  };

    const handleSubmit = () => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Check if user is trying to register for a position they already registered for
    const selectedPosisiId = formData.bidangYangDisukai ? parseInt(formData.bidangYangDisukai) : null;
    if (selectedPosisiId && existingRegistrations.includes(selectedPosisiId)) {
      const selectedPosisi = allPosisiPKL.find(p => p.id === selectedPosisiId);
      const posisiName = selectedPosisi?.nama_posisi || 'posisi ini';
      
      console.warn('User attempting to register for already registered position:', {
        selectedPosisiId,
        posisiName,
        existingRegistrations
      });
      
      setSubmitError(`Anda sudah memiliki pendaftaran aktif untuk ${posisiName}. Silakan pilih posisi PKL yang berbeda.`);
      setIsSubmitting(false);
      return;
    }

    // === COMPREHENSIVE SUBMISSION LOGGING ===
    console.log('=== PKL REGISTRATION SUBMISSION STARTED ===', {
      timestamp: new Date().toISOString(),
      currentStep: currentStep,
      totalSteps: steps.length,
      selectedPosisiId,
      existingRegistrations
    });

    // Debug: Log current form data before submission with focus on berkas
    console.log('=== FORM DATA BEFORE SUBMISSION ===', {
      totalFields: Object.keys(formData).length,
      berkasFields: {
        cv_file_path: formData.cv_file_path,
        cv_file_name: formData.cv_file_name,
        portfolio_file_path: formData.portfolio_file_path,
        portfolio_file_name: formData.portfolio_file_name
      },
      hasCVData: !!(formData.cv_file_path && formData.cv_file_name),
      hasPortfolioData: !!(formData.portfolio_file_path && formData.portfolio_file_name),
      completeFormData: formData
    });

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

    // Debug: Log transformed data being sent with focus on berkas
    console.log('=== TRANSFORMED DATA FOR SUBMISSION ===', {
      berkasDataBeingSent: {
        cv_file_path: transformedData.cv_file_path,
        cv_file_name: transformedData.cv_file_name,
        portfolio_file_path: transformedData.portfolio_file_path,
        portfolio_file_name: transformedData.portfolio_file_name
      },
      totalTransformedFields: Object.keys(transformedData).length,
      completeTransformedData: transformedData,
      submissionMethod: 'router.post',
      submissionUrl: '/client/pendaftaran-pkl'
    });

    router.post('/client/pendaftaran-pkl', transformedData, {
      onSuccess: (page) => {
        console.log('=== SUBMISSION SUCCESS ===', {
          response: page,
          timestamp: new Date().toISOString()
        });
        
        // Check if there's a success message in the response
        const successMessage = page.props?.success || page.props?.message;
        if (successMessage) {
          // Show success modal instead of redirect
          setIsSubmitting(false);
          setShowSuccessModal(true);
        } else {
          // If no success message, something might be wrong
          setSubmitError('Terjadi kesalahan dalam memproses pendaftaran.');
          setIsSubmitting(false);
        }
      },
      onError: (errors) => {
        console.error('=== SUBMISSION ERROR ===', {
          errors: errors,
          errorType: typeof errors,
          errorKeys: errors ? Object.keys(errors) : 'no keys',
          errorStructure: {
            hasError: 'error' in errors,
            hasMessage: 'message' in errors,
            hasValidationErrors: errors && typeof errors === 'object' && Object.keys(errors).some(key => Array.isArray(errors[key]))
          },
          timestamp: new Date().toISOString()
        });
        
        // Handle different types of errors with detailed logging
        let errorMessage = 'Gagal membuat pendaftaran. Silakan coba lagi.';
        
        if (errors.error) {
          console.log('Using errors.error:', errors.error);
          // Clean up error message - remove the technical prefix if present
          errorMessage = errors.error.replace('Terjadi kesalahan dalam memproses pendaftaran: ', '');
        } else if (typeof errors === 'string') {
          console.log('Using string error:', errors);
          errorMessage = errors;
        } else if (errors.message) {
          console.log('Using errors.message:', errors.message);
          errorMessage = errors.message;
        } else if (errors && typeof errors === 'object') {
          // Handle validation errors
          const validationErrors = Object.entries(errors)
            .filter(([key, value]) => Array.isArray(value))
            .map(([key, messages]) => `${key}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          
          if (validationErrors) {
            console.log('Using validation errors:', validationErrors);
            errorMessage = `Validation errors:\n${validationErrors}`;
          } else {
            console.log('Using fallback for object error:', JSON.stringify(errors));
            errorMessage = `Error: ${JSON.stringify(errors)}`;
          }
        }
        
        console.log('Final error message set:', errorMessage);
        setSubmitError(errorMessage);
        setIsSubmitting(false);
      },
      onFinish: () => {
        console.log('=== SUBMISSION FINISHED ===', {
          timestamp: new Date().toISOString()
        });
        // Don't set isSubmitting to false here as it's handled in onSuccess/onError
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

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Pendaftaran PKL</h1>
            <p className="text-gray-600">Lengkapi formulir di bawah untuk mendaftar program PKL</p>
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
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h3>
              <p className="text-gray-600">
                Pendaftaran PKL Anda telah berhasil dikirim. Tim kami akan segera meninjau pendaftaran Anda dan memberikan konfirmasi melalui email.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.visit('/client/dashboard');
                }}
                className="flex-1 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Lihat Dashboard
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
