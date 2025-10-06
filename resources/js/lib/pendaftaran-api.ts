import axios from 'axios';

// Types untuk API responses
export interface PendaftaranSertifikasiData {
  sertifikasi_id: number;
  batch_id: number;
  nama_lengkap: string;
  email: string;
  no_telp: string;
}

export interface PendaftaranPKLData {
  id?: number;
  user_id?: number;
  posisi_pkl_id: number;
  status?: string;
  tanggal_pendaftaran?: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  tanggal_diproses?: string;
  
  // Data Diri
  nama_lengkap: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  email_pendaftar: string;
  nomor_handphone: string;
  alamat: string;
  instagram?: string;
  tiktok?: string;
  memiliki_laptop: 'ya' | 'tidak';
  memiliki_kamera_dslr: 'ya' | 'tidak';
  transportasi_operasional: string;
  
  // File uploads
  cv_file_path?: string;
  cv_file_name?: string;
  portfolio_file_path?: string;
  portfolio_file_name?: string;
  
  // Background Pendidikan
  institusi_asal: string;
  asal_sekolah: string;
  program_studi?: string;
  jurusan: string;
  kelas?: string;
  semester?: number;
  awal_pkl: string;
  akhir_pkl: string;
  
  // Skill & Minat
  kemampuan_ditingkatkan?: string;
  skill_kelebihan?: string;
  bidang_yang_disukai?: string;
  pernah_membuat_video: 'ya' | 'tidak';
  
  // Kebijakan & Finalisasi
  sudah_melihat_profil: 'ya' | 'tidak';
  tingkat_motivasi: number;
  nilai_diri?: string;
  apakah_merokok: 'ya' | 'tidak';
  bersedia_ditempatkan: 'ya' | 'tidak';
  bersedia_masuk_2_kali: 'ya' | 'tidak';
  
  motivasi?: string;
  berkas_persyaratan?: string;
  catatan_admin?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

// API Service class
class PendaftaranApiService {
  private baseURL = '/api';

  constructor() {
    // Set default axios configuration for Laravel web routes
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    
    // Add CSRF token if available
    this.refreshCsrfToken();
  }

  // Get fresh CSRF token before making requests
  private async ensureCsrfToken(): Promise<void> {
    this.refreshCsrfToken();
  }

  // Refresh CSRF token from meta tag
  private refreshCsrfToken(): void {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }
  }

  // Get fresh CSRF token by making a request to client-specific endpoint
  private async fetchCsrfToken(): Promise<void> {
    try {
      const response = await axios.get('/client/csrf-token');
      if (response.data.token) {
        // Update both the meta tag and axios headers
        let metaTag = document.querySelector('meta[name="csrf-token"]');
        if (metaTag) {
          metaTag.setAttribute('content', response.data.token);
        } else {
          // Create meta tag if it doesn't exist
          metaTag = document.createElement('meta');
          metaTag.setAttribute('name', 'csrf-token');
          metaTag.setAttribute('content', response.data.token);
          document.head.appendChild(metaTag);
        }
        axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data.token;
      }
    } catch (error) {
      }
  }

  // Pendaftaran Sertifikasi APIs
  async createPendaftaranSertifikasi(data: PendaftaranSertifikasiData): Promise<ApiResponse<PendaftaranSertifikasiData>> {
    try {
      // Ensure fresh CSRF token - try both methods
      await this.fetchCsrfToken();
      await this.ensureCsrfToken();
      
      const response = await axios.post('/client/pendaftaran-sertifikasi', data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      // If CSRF error, try refreshing token once
      if (error.response?.status === 419) {
        try {
          await this.fetchCsrfToken();
          const retryResponse = await axios.post('/client/pendaftaran-sertifikasi', data, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
          return retryResponse.data;
        } catch (retryError: any) {
          throw new Error(retryError.response?.data?.message || 'CSRF token mismatch - please refresh page');
        }
      }
      throw new Error(error.response?.data?.message || 'Gagal membuat pendaftaran sertifikasi');
    }
  }

  async getPendaftaranSertifikasi(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<PendaftaranSertifikasiData>> {
    try {
      const response = await axios.get(`${this.baseURL}/pendaftaran-sertifikasi`, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil data pendaftaran sertifikasi');
    }
  }

  async getPendaftaranSertifikasiById(id: number): Promise<ApiResponse<PendaftaranSertifikasiData>> {
    try {
      const response = await axios.get(`${this.baseURL}/pendaftaran-sertifikasi/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil detail pendaftaran sertifikasi');
    }
  }

  async updatePendaftaranSertifikasi(id: number, data: Partial<PendaftaranSertifikasiData>): Promise<ApiResponse<PendaftaranSertifikasiData>> {
    try {
      const response = await axios.put(`${this.baseURL}/pendaftaran-sertifikasi/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Gagal memperbarui pendaftaran sertifikasi');
    }
  }

  async getPendaftaranSertifikasiByUser(userId: number): Promise<ApiResponse<PendaftaranSertifikasiData[]>> {
    try {
      const response = await axios.get(`${this.baseURL}/pendaftaran-sertifikasi/user/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil pendaftaran sertifikasi user');
    }
  }

  // Pendaftaran PKL APIs
  async createPendaftaranPKL(data: PendaftaranPKLData): Promise<ApiResponse<PendaftaranPKLData>> {
    try {
      // Ensure fresh CSRF token - try both methods
      await this.fetchCsrfToken();
      await this.ensureCsrfToken();
      
      const response = await axios.post('/client/pendaftaran-pkl', data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      // If CSRF error, try refreshing token once
      if (error.response?.status === 419) {
        try {
          await this.fetchCsrfToken();
          const retryResponse = await axios.post('/client/pendaftaran-pkl', data, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
          return retryResponse.data;
        } catch (retryError: any) {
          throw new Error(retryError.response?.data?.message || 'CSRF token mismatch - please refresh page');
        }
      }
      throw new Error(error.response?.data?.message || 'Gagal membuat pendaftaran PKL');
    }
  }

  async getPendaftaranPKL(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    search?: string;
    posisi_pkl_id?: number;
  }): Promise<PaginatedResponse<PendaftaranPKLData>> {
    try {
      const response = await axios.get(`${this.baseURL}/pendaftaran-pkl`, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil data pendaftaran PKL');
    }
  }

  async getPendaftaranPKLById(id: number): Promise<ApiResponse<PendaftaranPKLData>> {
    try {
      const response = await axios.get(`${this.baseURL}/pendaftaran-pkl/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil detail pendaftaran PKL');
    }
  }

  async updatePendaftaranPKL(id: number, data: Partial<PendaftaranPKLData>): Promise<ApiResponse<PendaftaranPKLData>> {
    try {
      const response = await axios.put(`${this.baseURL}/pendaftaran-pkl/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Gagal memperbarui pendaftaran PKL');
    }
  }

  async getPendaftaranPKLByUser(userId: number): Promise<ApiResponse<PendaftaranPKLData[]>> {
    try {
      const response = await axios.get(`${this.baseURL}/pendaftaran-pkl/user/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil pendaftaran PKL user');
    }
  }

  async getPKLStatistics(): Promise<ApiResponse<any>> {
    try {
      const response = await axios.get(`${this.baseURL}/pendaftaran-pkl/statistics`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil statistik PKL');
    }
  }

  // Status update APIs
  async updateStatusSertifikasi(id: number, status: string, catatanAdmin?: string): Promise<ApiResponse<PendaftaranSertifikasiData>> {
    try {
      const response = await axios.patch(`${this.baseURL}/pendaftaran-sertifikasi/${id}/status`, {
        status,
        catatan_admin: catatanAdmin,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Gagal memperbarui status pendaftaran sertifikasi');
    }
  }

  async updateStatusPKL(id: number, status: string, catatanAdmin?: string, tanggalMulai?: string, tanggalSelesai?: string): Promise<ApiResponse<PendaftaranPKLData>> {
    try {
      const response = await axios.patch(`${this.baseURL}/pendaftaran-pkl/${id}/status`, {
        status,
        catatan_admin: catatanAdmin,
        tanggal_mulai: tanggalMulai,
        tanggal_selesai: tanggalSelesai,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Gagal memperbarui status pendaftaran PKL');
    }
  }
}

// Export singleton instance
export const pendaftaranApi = new PendaftaranApiService();

// Export untuk digunakan di komponen
export default pendaftaranApi;