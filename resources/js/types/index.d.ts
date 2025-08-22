import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: Omit<NavItem, 'items'>[]; // nested children (one level)
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

// Definisi untuk item Breadcrumb di layout
export interface BreadcrumbItem {
    title: string;
    href: string;
}

// Interface untuk data Pengguna (User)
export interface User {
    id: number;
    name: string;
    email: string;
    institution?: string; // Universitas atau sekolah asal
    major?: string;       // Jurusan
    // Tambahkan properti lain yang mungkin dikirim dari backend
    // contoh: phone, address, avatar, dll.
}

// Interface untuk data Posisi PKL
export interface PosisiPKL {
    id: number;
    nama_posisi: string;
    kategori?: string;
    deskripsi?: string;
    persyaratan?: string;
    tipe?: string;
    status?: string;
    tanggal_mulai?: string;
    tanggal_selesai?: string;
}

// Interface untuk data utama PKL (detail program)
export interface PKL {
    id: number;
    posisi_id: number;
    lokasi: string;
    tanggal_mulai: string; // Format 'YYYY-MM-DD'
    tanggal_selesai: string; // Format 'YYYY-MM-DD'
    // Tambahkan properti lain yang relevan
}

// Interface untuk data Pendaftaran PKL yang menggabungkan semua relasi
export interface PendaftaranPKL {
    id: number;
    user_id: number;
    posisi_id: number; // Sesuaikan dengan foreign key Anda
    pkl_id: number;    // Sesuaikan dengan foreign key Anda
    status: string;
    tanggal_pendaftaran: string;
    tanggal_mulai?: string;
    tanggal_selesai?: string;
    
    // 👇 Tambahkan properti yang hilang di sini
    institusi_asal: string;
    program_studi: string;
    semester: number;
    ipk: number;
    
    // Relasi yang sudah dimuat dari backend
    user: User;
    pkl: PKL;
    posisi: PosisiPKL;
    penilaian?: PenilaianPKL;
    laporanMingguan?: WeeklyReport[];
}

export interface PenilaianPKL {
    id: number;
    pendaftaran_id: number;
    posisi_pkl_id: number;
    status_penilaian: string;      // <-- Tambahkan properti ini
    catatan_penilai?: string | null; // <-- Tambahkan properti ini (opsional)
    tanggal_penilaian?: string;    // <-- Tambahkan properti ini (opsional)
    created_at: string;
    updated_at: string;
    // Relasi juga bisa ditambahkan jika perlu
    pendaftaran?: PendaftaranPKL; 
}