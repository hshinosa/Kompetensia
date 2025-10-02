import { Head, usePage, router } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentRegistrationsTable, type RegistrationRow } from '@/components/dashboard/RecentRegistrationsTable';
import { DetailPendaftaranModal, type PendaftarData } from '@/components/dashboard/DetailPendaftaranModal';
import { StatusNotificationModal } from '@/components/dashboard/StatusNotificationModal';
import Pagination from '@/components/Pagination';
// Replaced legacy DashboardFilterBar with unified FilterDropdown
import { type ActiveFilters } from '@/components/dashboard/FilterDropdown';
import { Users, UserCheck, BookOpen, FileText, UserCog, Video as VideoIcon } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface PendaftaranItem {
  id: string;
  original_id: number;
  user_id: number;
  nama: string;
  full_name: string;
  jenis_pendaftaran: string;
  program: string;
  batch?: string | null;
  tanggal_pendaftaran: string;
  status: string;
  type: string;
}

interface StatsSummary { 
  peserta_sertifikasi?: number; 
  siswa_pkl?: number; 
  jumlah_sertifikasi?: number; 
  total_blog?: number; 
  total_video?: number;
  total_users?: number;
}
export default function Dashboard() {
  const { props } = usePage<{ stats: StatsSummary; pendaftaran_terbaru: PendaftaranItem[] }>();
  const breadcrumbs: BreadcrumbItem[] = [ { title: 'Dashboard', href: '/admin/dashboard' } ];
  const { stats, pendaftaran_terbaru } = props;
  const rows = (pendaftaran_terbaru||[]).map(p => ({ 
    id: p.id, 
    original_id: p.original_id,
    user_id: p.user_id,
    nama: p.nama,
    full_name: p.full_name, 
    jenis: p.jenis_pendaftaran, 
    program: p.program, 
    batch: p.batch, 
    tanggal: p.tanggal_pendaftaran, 
    status: p.status,
    type: p.type
  }));
  
  // Modal state for approval
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedRegistration, setSelectedRegistration] = React.useState<PendaftarData | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = React.useState(false);
  
  // Status notification modal state
  const [statusModal, setStatusModal] = React.useState<{
    isOpen: boolean;
    status: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    status: 'info',
    title: '',
    message: ''
  });
  
  // placeholder search state reuse (server side filtering bisa ditambahkan)
  const [search, setSearch] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState<ActiveFilters>({ jenisPendaftaran: [], tanggalPendaftaran: null, status: [] });
  // Function to fetch registration detail from backend
  const fetchRegistrationDetail = async (registrationId: number, type: 'sertifikasi' | 'pkl') => {
    try {
      setIsLoadingDetail(true);
      
      const response = await fetch(`/admin/pendaftaran/${type}/${registrationId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      // The backend now returns flattened data structure matching PendaftarData interface
      // Just pass the data directly as it already matches our interface
      const transformedData: PendaftarData = {
        user_id: data.user_id,
        original_id: registrationId,
        type: type,
        nama: data.nama,
        full_name: data.full_name,
        jenis_pendaftaran: data.jenis_pendaftaran,
        status: data.status,
        biodata: data.biodata,
        sertifikasi: data.sertifikasi,
        pkl_info: data.pkl_info,
        catatan_admin: data.catatan_admin
      };
      
      setSelectedRegistration(transformedData);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching registration detail:', error);
      alert('Gagal memuat detail pendaftaran');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Function to handle approval/rejection
  const handleApproval = async (status: 'Disetujui' | 'Ditolak', alasan?: string): Promise<void> => {
    if (!selectedRegistration) return;
    
    try {
      // Use original_id and type directly from selectedRegistration
      const id = selectedRegistration.original_id;
      const type = selectedRegistration.type;
      
      if (!id || !type) {
        throw new Error('Data pendaftaran tidak lengkap');
      }
      
      console.log('Sending approval request:', {
        type,
        id,
        status,
        alasan,
        selectedRegistration: selectedRegistration
      });
      
      // Get CSRF token
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (!csrfToken) {
        throw new Error('CSRF token tidak ditemukan');
      }
      
      // Use fetch API for JSON response (not Inertia response)
      const response = await fetch(`/admin/pendaftaran/${type}/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          status: status,
          catatan_admin: alasan || null
        })
      });
      
      // Log response details
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        const text = await response.text();
        console.error('Response text:', text);
        throw new Error('Server mengembalikan response yang tidak valid');
      }
      
      console.log('Response data:', result);
      
      if (!response.ok) {
        throw new Error(result.error || result.message || `Server error: ${response.status}`);
      }
      
      if (!result.success) {
        throw new Error(result.error || result.message || 'Failed to update registration status');
      }
      
      // Show success modal
      setStatusModal({
        isOpen: true,
        status: 'success',
        title: 'Berhasil!',
        message: result.message || `Pendaftaran berhasil ${status.toLowerCase()}`
      });
      
    } catch (error) {
      console.error('Error updating registration:', error);
      // Show error modal
      setStatusModal({
        isOpen: true,
        status: 'error',
        title: 'Gagal!',
        message: `Gagal memperbarui status pendaftaran: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      throw error; // Re-throw to let the modal handle the error state
    }
  };

  // Function to handle status modal close and refresh
  const handleStatusModalClose = () => {
    setStatusModal(prev => ({ ...prev, isOpen: false }));
    if (statusModal.status === 'success') {
      // Refresh the page to update the data
      window.location.reload();
    }
  };

  // Handler for table action button
  const handleRegistrationAction = (registration: RegistrationRow) => {
    if (isLoadingDetail) return;
    
    // Use the type field directly from backend data
    const type = (registration.type || (registration.jenis.toLowerCase().includes('sertifikasi') ? 'sertifikasi' : 'pkl')) as 'sertifikasi' | 'pkl';
    fetchRegistrationDetail(registration.original_id, type);
  };

  const matchesSearch = (r: typeof rows[number]) => {
    if(!search) return true;
    const q = search.toLowerCase();
    return [r.nama, r.program].some(f => f?.toLowerCase().includes(q));
  };
  const matchesJenis = (r: typeof rows[number]) => {
    if (activeFilters.jenisPendaftaran.length === 0) return true;
    const jenisLower = r.jenis.toLowerCase();
    return activeFilters.jenisPendaftaran.some(sel => jenisLower.includes(sel.toLowerCase()));
  };
  const matchesStatus = (r: typeof rows[number]) => {
    return activeFilters.status.length === 0 || activeFilters.status.includes(r.status);
  };
  const matchesDate = (r: typeof rows[number]) => {
    const range = activeFilters.tanggalPendaftaran;
    if(!range || (!range.startDate && !range.endDate)) return true;
    const rowDate = new Date(r.tanggal);
    if(range.startDate && rowDate < new Date(range.startDate)) return false;
    if(range.endDate && rowDate > new Date(range.endDate + 'T23:59:59')) return false;
    return true;
  };
  const filteredRows = rows.filter(r => matchesSearch(r) && matchesJenis(r) && matchesStatus(r) && matchesDate(r));
  const [page,setPage] = React.useState(1);
  const [perPage,setPerPage] = React.useState(5);
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / perPage));
  React.useEffect(()=>{ if(page>totalPages) setPage(1); },[totalPages,page]);
  const paginated = filteredRows.slice((page-1)*perPage, page*perPage);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Dashboard</h1>
          <p className="text-muted-foreground">Ringkasan aktifitas terbaru</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard 
            label="Peserta Sertifikasi" 
            value={stats?.peserta_sertifikasi ?? 0} 
            icon={<Users className="h-5 w-5" />} 
            iconColor="text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-400/10"
            onClick={() => router.visit('/admin/sertifikasi-kompetensi')}
            isClickable
          />
          <StatsCard 
            label="Siswa PKL" 
            value={stats?.siswa_pkl ?? 0} 
            icon={<UserCheck className="h-5 w-5" />} 
            iconColor="text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-400/10"
            onClick={() => router.visit('/admin/praktik-kerja-lapangan')}
            isClickable
          />
          <StatsCard 
            label="Jumlah Sertifikasi Aktif" 
            value={stats?.jumlah_sertifikasi ?? 0} 
            icon={<BookOpen className="h-5 w-5" />} 
            iconColor="text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-400/10"
            onClick={() => router.visit('/admin/sertifikasi-kompetensi')}
            isClickable
          />
          <StatsCard 
            label="Total Users" 
            value={stats?.total_users ?? 0} 
            icon={<UserCog className="h-5 w-5" />} 
            iconColor="text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-400/10"
            onClick={() => router.visit('/admin/user-management')}
            isClickable
          />
        </div>
        <RecentRegistrationsTable 
          rows={paginated} 
          onApprove={handleRegistrationAction} 
          search={search}
          onSearchChange={setSearch}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
        />
        <Pagination currentPage={page} totalPages={totalPages} itemsPerPage={perPage} totalItems={filteredRows.length} onPageChange={setPage} onItemsPerPageChange={setPerPage} />
        
        {/* Modal for registration approval */}
        {selectedRegistration && (
          <DetailPendaftaranModal
            isOpen={isModalOpen}
            pendaftarData={selectedRegistration}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedRegistration(null);
            }}
            onApproval={handleApproval}
          />
        )}

        {/* Status notification modal */}
        <StatusNotificationModal
          isOpen={statusModal.isOpen}
          onClose={handleStatusModalClose}
          status={statusModal.status}
          title={statusModal.title}
          message={statusModal.message}
        />
      </div>
    </AppLayout>
  );
}
