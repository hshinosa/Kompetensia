import React, { useRef, useState } from 'react';

interface Props {
  readonly formData: any;
  readonly onFormDataChange: (field: string, value: any) => void;
  readonly onNext: () => void;
  readonly user?: {
    nama?: string;
    nama_lengkap?: string;
    email?: string;
    telepon?: string;
    alamat?: string;
    tempat_lahir?: string;
    tanggal_lahir?: string;
  };
}

export default function DataDiriForm({ formData, onFormDataChange, onNext, user }: Props) {
  const cvInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    cv: { uploading: boolean; uploaded: boolean; fileName?: string };
    portfolio: { uploading: boolean; uploaded: boolean; fileName?: string };
  }>({
    cv: { uploading: false, uploaded: false },
    portfolio: { uploading: false, uploaded: false }
  });

  // Helper function to check if field is prefilled from user data
  const isPrefilled = (fieldValue: string, userValue?: string): boolean => {
    return !!(userValue && fieldValue === userValue);
  };

  // Helper function to get field class with prefill indicator
  const getFieldClass = (isPrefilled: boolean) => {
    const baseClass = "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent";
    return isPrefilled 
      ? `${baseClass} border-green-300 bg-green-50` 
      : `${baseClass} border-gray-200`;
  };

  const handleFileUpload = async (file: File, type: 'cv' | 'portfolio') => {
    if (!file) return;

    // === DETAILED FRONTEND LOGGING FOR FILE UPLOAD ===
    console.log('=== FILE UPLOAD STARTED ===', {
      type: type,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      timestamp: new Date().toISOString()
    });

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      console.error('FILE VALIDATION FAILED:', {
        type: type,
        fileName: file.name,
        fileType: file.type,
        allowedTypes: allowedTypes,
        reason: 'Invalid file type'
      });
      alert('Hanya file PDF, DOC, atau DOCX yang diperbolehkan');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error('FILE VALIDATION FAILED:', {
        type: type,
        fileName: file.name,
        fileSize: file.size,
        maxSize: 5 * 1024 * 1024,
        reason: 'File too large'
      });
      alert('Ukuran file maksimal 5MB');
      return;
    }

    console.log('FILE VALIDATION PASSED:', {
      type: type,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    setUploadStatus(prev => ({
      ...prev,
      [type]: { ...prev[type], uploading: true }
    }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jenis_dokumen', type);

      console.log('SENDING UPLOAD REQUEST:', {
        type: type,
        fileName: file.name,
        formDataKeys: Array.from(formData.keys()),
        url: '/api/upload-document'
      });

      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
      });

      console.log('UPLOAD RESPONSE RECEIVED:', {
        type: type,
        responseStatus: response.status,
        responseOk: response.ok,
        responseStatusText: response.statusText
      });

      if (response.ok) {
        const result = await response.json();
        console.log('=== UPLOAD SUCCESS ===', {
          type: type,
          result: result,
          filePath: result.data?.filePath,
          fileName: result.data?.fileName
        });
        
        setUploadStatus(prev => ({
          ...prev,
          [type]: { uploading: false, uploaded: true, fileName: result.data.fileName }
        }));
        
        // Save file path to form data using the correct response structure
        const filePathKey = `${type}_file_path`;
        const fileNameKey = `${type}_file_name`;
        
        console.log('SAVING TO FORM DATA:', {
          type: type,
          filePathKey: filePathKey,
          fileNameKey: fileNameKey,
          filePath: result.data.filePath,
          fileName: result.data.fileName
        });
        
        onFormDataChange(filePathKey, result.data.filePath);
        onFormDataChange(fileNameKey, result.data.fileName);
        
        console.log('FORM DATA UPDATED SUCCESSFULLY:', {
          type: type,
          [filePathKey]: result.data.filePath,
          [fileNameKey]: result.data.fileName
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('=== UPLOAD ERROR ===', {
        type: type,
        fileName: file.name,
        error: error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      alert('Upload gagal. Silakan coba lagi.');
      setUploadStatus(prev => ({
        ...prev,
        [type]: { uploading: false, uploaded: false }
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="bg-white rounded-2xl p-8 border-2 border-purple-200 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nama Lengkap */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Lengkap
            {isPrefilled(formData.namaLengkap, user?.nama_lengkap || user?.nama) && (
              <span className="ml-2 text-xs text-green-600 font-medium">✓ Data dari profil</span>
            )}
          </label>
          <input
            type="text"
            value={formData.namaLengkap}
            onChange={(e) => onFormDataChange('namaLengkap', e.target.value)}
            placeholder="Abdullah Azhar"
            className={getFieldClass(isPrefilled(formData.namaLengkap, user?.nama_lengkap || user?.nama))}
            required
          />
        </div>

        {/* Tempat & Tanggal Lahir */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tempat Lahir
              {isPrefilled(formData.tempatLahir, user?.tempat_lahir) && (
                <span className="ml-2 text-xs text-green-600 font-medium">✓ Data dari profil</span>
              )}
            </label>
            <input
              type="text"
              value={formData.tempatLahir}
              onChange={(e) => onFormDataChange('tempatLahir', e.target.value)}
              placeholder="Kota Bandung"
              className={getFieldClass(isPrefilled(formData.tempatLahir, user?.tempat_lahir))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Lahir
            </label>
            <input
              type="date"
              value={formData.tanggalLahir}
              onChange={(e) => onFormDataChange('tanggalLahir', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Email & Nomor Handphone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
              {isPrefilled(formData.email, user?.email) && (
                <span className="ml-2 text-xs text-green-600 font-medium">✓ Data dari profil</span>
              )}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onFormDataChange('email', e.target.value)}
              placeholder="abudulah@gmail.com"
              className={getFieldClass(isPrefilled(formData.email, user?.email))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Handphone
              {isPrefilled(formData.nomorHandphone, user?.telepon) && (
                <span className="ml-2 text-xs text-green-600 font-medium">✓ Data dari profil</span>
              )}
            </label>
            <input
              type="tel"
              value={formData.nomorHandphone}
              onChange={(e) => onFormDataChange('nomorHandphone', e.target.value)}
              placeholder="+62 0812345"
              className={getFieldClass(isPrefilled(formData.nomorHandphone, user?.telepon))}
              required
            />
          </div>
        </div>

        {/* Alamat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alamat
            {isPrefilled(formData.alamat, user?.alamat) && (
              <span className="ml-2 text-xs text-green-600 font-medium">✓ Data dari profil</span>
            )}
          </label>
          <textarea
            value={formData.alamat}
            onChange={(e) => onFormDataChange('alamat', e.target.value)}
            placeholder="Jln. Jln minimal no 25"
            rows={3}
            className={`${getFieldClass(isPrefilled(formData.alamat, user?.alamat))} resize-none`}
            required
          />
        </div>

        {/* Instagram & TikTok */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => onFormDataChange('instagram', e.target.value)}
              placeholder="@tu_abdullah"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiktok
            </label>
            <input
              type="text"
              value={formData.tiktok}
              onChange={(e) => onFormDataChange('tiktok', e.target.value)}
              placeholder="@tu_abdullah"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Dropdown Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apakah anda memiliki laptop?
            </label>
            <select
              value={formData.memilikiLaptop || ''}
              onChange={(e) => onFormDataChange('memilikiLaptop', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Pilih jawaban</option>
              <option value="ya">Ya</option>
              <option value="tidak">Tidak</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apakah anda memiliki kamera DSLR?
            </label>
            <select
              value={formData.memilikiKameraDSLR || ''}
              onChange={(e) => onFormDataChange('memilikiKameraDSLR', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Pilih jawaban</option>
              <option value="ya">Ya</option>
              <option value="tidak">Tidak</option>
            </select>
          </div>
        </div>

        {/* Transportasi Operasional */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transportasi Operasional
          </label>
          <select
            value={formData.transportasiOperasional}
            onChange={(e) => onFormDataChange('transportasiOperasional', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Pilih jawaban</option>
            <option value="motor">Motor</option>
            <option value="mobil">Mobil</option>
            <option value="transportasi_umum">Transportasi Umum</option>
            <option value="jalan_kaki">Jalan Kaki</option>
          </select>
        </div>

        {/* Upload CV & Portfolio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Upload CV & Portfolio
          </label>
          
          {/* Hidden file inputs */}
          <input
            ref={cvInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, 'cv');
            }}
            className="hidden"
          />
          <input
            ref={portfolioInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, 'portfolio');
            }}
            className="hidden"
          />

          <div className="grid grid-cols-2 gap-4">
            {/* CV Upload */}
            <div className="border-2 border-dashed border-purple-300 rounded-xl p-4 text-center">
              <div className="mb-3">
                <svg className="w-8 h-8 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm font-medium text-gray-700">CV</p>
              </div>
              
              {uploadStatus.cv.uploaded ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center text-green-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">Berhasil diupload</span>
                  </div>
                  <p className="text-xs text-gray-600 truncate px-2">{uploadStatus.cv.fileName}</p>
                  <button
                    type="button"
                    onClick={() => cvInputRef.current?.click()}
                    className="w-full py-2 text-sm bg-purple-100 text-purple-700 font-medium rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    Ganti File
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => cvInputRef.current?.click()}
                  disabled={uploadStatus.cv.uploading}
                  className="w-full py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400"
                >
                  {uploadStatus.cv.uploading ? 'Mengupload...' : 'Upload CV'}
                </button>
              )}
            </div>

            {/* Portfolio Upload */}
            <div className="border-2 border-dashed border-purple-300 rounded-xl p-4 text-center">
              <div className="mb-3">
                <svg className="w-8 h-8 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-sm font-medium text-gray-700">Portfolio</p>
              </div>
              
              {uploadStatus.portfolio.uploaded ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center text-green-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">Berhasil diupload</span>
                  </div>
                  <p className="text-xs text-gray-600 truncate px-2">{uploadStatus.portfolio.fileName}</p>
                  <button
                    type="button"
                    onClick={() => portfolioInputRef.current?.click()}
                    className="w-full py-2 text-sm bg-purple-100 text-purple-700 font-medium rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    Ganti File
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => portfolioInputRef.current?.click()}
                  disabled={uploadStatus.portfolio.uploading}
                  className="w-full py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400"
                >
                  {uploadStatus.portfolio.uploading ? 'Mengupload...' : 'Upload Portfolio'}
                </button>
              )}
            </div>
          </div>
          
          {/* File requirements info */}
          <div className="mt-3 text-xs text-gray-500 text-center">
            <p>Format yang didukung: PDF, DOC, DOCX (Maksimal 5MB)</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
          >
            Lanjut
          </button>
        </div>
      </form>
    </div>
  );
}
