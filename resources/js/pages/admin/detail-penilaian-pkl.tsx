import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    ExternalLink,
    File,
    Download
} from 'lucide-react';

interface User {
    id: number;
    nama?: string;
    nama_lengkap?: string;
    full_name?: string;
    name?: string;
    email: string;
    phone?: string;
    telepon?: string;
    institution?: string;
    institusi?: string;
    major?: string;
    jurusan?: string;
    semester?: number;
    school_university?: string;
    major_concentration?: string;
    class_semester?: string;
}

interface PosisiPKL {
    id: number;
    nama_posisi: string;
    kategori?: string;
    deskripsi?: string;
    lokasi?: string;
    tipe?: string;
    durasi_bulan?: number;
}

interface Penilaian {
    id: number;
    status_kelulusan: string;
    nilai_akhir: number;
    catatan_pembimbing?: string;
}

interface PendaftaranPKL {
    id: number;
    user_id: number;
    posisi_pkl_id: number;
    status: string;
    tanggal_pendaftaran: string;
    tanggal_mulai?: string;
    tanggal_selesai?: string;
    institusi_asal?: string;
    program_studi?: string;
    semester?: number;
    ipk?: number;
    user?: User;
    posisiPKL?: PosisiPKL;
    posisi_p_k_l?: PosisiPKL; // Laravel serializes camelCase to snake_case
    penilaian?: Penilaian;
}

interface Props {
    pendaftaran: PendaftaranPKL;
    submisi_pkl: SubmisiPKL[];
}

interface SubmisiPKL {
    id: number;
    nomor_submisi: string;
    tanggal_submit: string | null;
    status: 'submitted' | 'pending';
    kategori_submisi: 'laporan' | 'tugas';
    tipe_submisi: 'link' | 'dokumen' | 'dokumen_dan_link';
    judul_tugas?: string;
    deskripsi_tugas?: string;
    link_submisi?: string;
    nama_dokumen?: string;
    path_file?: string;
    ukuran_file?: number;
    tipe_mime?: string;
    url_file?: string;
    ukuran_file_format?: string;
    is_assessed: boolean;
    status_penilaian: 'menunggu' | 'diterima' | 'ditolak';
    feedback_pembimbing?: string;
    tanggal_verifikasi?: string;
    diverifikasi_oleh?: string;
}

const weeklyReports: WeeklyReport[] = [
    { 
        id: 1, 
        submissionNumber: 'Submisi 1', 
        submittedDate: '28 Jul 2025', 
        status: 'submitted',
        jenisDocument: 'Laporan/Tugas',
        submissionType: 'link',
        isAssessed: true,
        statusPenilaian: 'Diterima',
        feedback: 'Implementasi fitur login sudah baik, dokumentasi lengkap',
        judulTugas: 'Implementasi Fitur Login dengan React',
        deskripsiTugas: 'Membuat sistem autentikasi menggunakan React dan Laravel',
        linkSubmisi: 'https://github.com/hashfi/pkl-login-feature'
    },
    { 
        id: 2, 
        submissionNumber: 'Submisi 2', 
        submittedDate: '04 Agu 2025', 
        status: 'submitted',
        jenisDocument: 'Laporan/Tugas',
        submissionType: 'document',
        isAssessed: true,
        statusPenilaian: 'Tidak Diterima',
        feedback: 'Laporan perlu perbaikan pada bagian analisis dan testing',
        judulTugas: 'Laporan Analisis Dashboard Analytics',
        deskripsiTugas: 'Dokumentasi lengkap pengembangan dashboard dengan Chart.js',
        fileName: 'Laporan_Dashboard_Analytics.pdf',
        fileSize: '2.5 MB',
        fileType: 'PDF'
    },
    { 
        id: 3, 
        submissionNumber: 'Submisi 3', 
        submittedDate: '11 Agu 2025', 
        status: 'submitted',
        jenisDocument: 'Laporan/Tugas',
        submissionType: 'link',
        isAssessed: false,
        judulTugas: 'API Integration dengan Third Party Services',
        deskripsiTugas: 'Integrasi dengan API eksternal untuk fitur payment gateway',
        linkSubmisi: 'https://github.com/hashfi/pkl-api-integration'
    },
    { 
        id: 4, 
        submissionNumber: 'Submisi 4', 
        submittedDate: '18 Agu 2025', 
        status: 'submitted',
        jenisDocument: 'Laporan/Tugas',
        submissionType: 'document',
        isAssessed: true,
        statusPenilaian: 'Diterima',
        feedback: 'Dokumentasi database optimization sangat detail dan implementasi baik',
        judulTugas: 'Dokumentasi Database Optimization',
        deskripsiTugas: 'Laporan lengkap optimisasi query database dan implementasi indexing',
        fileName: 'Database_Optimization_Report.docx',
        fileSize: '1.8 MB',
        fileType: 'DOCX'
    },
    { 
        id: 5, 
        submissionNumber: 'Submisi 5', 
        submittedDate: '25 Agu 2025', 
        status: 'submitted',
        jenisDocument: 'Laporan/Tugas',
        submissionType: 'link',
        isAssessed: true,
        statusPenilaian: 'Diterima',
        feedback: 'Penerapan security yang baik dan testing comprehensive',
        judulTugas: 'Security Implementation dan Authentication',
        deskripsiTugas: 'Implementasi security features seperti rate limiting, CORS, dan JWT authentication',
        linkSubmisi: 'https://github.com/hashfi/pkl-security'
    },
    { 
        id: 6, 
        submissionNumber: 'Submisi 6', 
        submittedDate: '01 Sep 2025', 
        status: 'submitted',
        jenisDocument: 'Laporan/Tugas',
        submissionType: 'document',
        isAssessed: false,
        judulTugas: 'Laporan Mobile App Development',
        deskripsiTugas: 'Dokumentasi pengembangan aplikasi mobile companion menggunakan React Native',
        fileName: 'Mobile_App_Development.pdf',
        fileSize: '3.2 MB',
        fileType: 'PDF'
    },
    { 
        id: 7, 
        submissionNumber: 'Submisi 7', 
        submittedDate: '08 Sep 2025', 
        status: 'submitted',
        jenisDocument: 'Laporan/Tugas',
        submissionType: 'link',
        isAssessed: true,
        statusPenilaian: 'Tidak Diterima',
        feedback: 'Perlu perbaikan pada error handling dan user experience',
        judulTugas: 'DevOps dan Deployment Automation',
        deskripsiTugas: 'Setup CI/CD pipeline menggunakan GitHub Actions dan Docker',
        linkSubmisi: 'https://github.com/hashfi/pkl-devops'
    },
    { 
        id: 8, 
        submissionNumber: 'Submisi 8', 
        status: 'pending',
        jenisDocument: '',
        submissionType: '',
        isAssessed: false
    }
];

export default function DetailPenilaianPKL({ pendaftaran, submisi_pkl }: Readonly<Props>) {
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<SubmisiPKL | null>(null);
    
    // Assessment form state
    const [assessmentForm, setAssessmentForm] = useState({
        status_penilaian: '',
        feedback_pembimbing: ''
    });

    const handleViewSubmission = (submission: SubmisiPKL) => {
        setSelectedSubmission(submission);
        setIsSubmissionModalOpen(true);
        // Initialize form with existing data if assessed
        if (submission.is_assessed) {
            setAssessmentForm({
                status_penilaian: submission.status_penilaian || '',
                feedback_pembimbing: submission.feedback_pembimbing || ''
            });
        } else {
            setAssessmentForm({
                status_penilaian: '',
                feedback_pembimbing: ''
            });
        }
    };

    const handleSaveAssessment = () => {
        if (!selectedSubmission || !assessmentForm.status_penilaian) return;
        
        // Submit assessment using Inertia
        router.post(`/admin/penilaian-pkl-submisi/${selectedSubmission.id}`, assessmentForm, {
            onSuccess: () => {
                setIsSubmissionModalOpen(false);
                setAssessmentForm({ status_penilaian: '', feedback_pembimbing: '' });
            },
            onError: (errors) => {
                console.error('Assessment submission failed:', errors);
            }
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Penilaian PKL', href: '/admin/penilaian-pkl' },
        { title: pendaftaran.user?.full_name || 'Detail Peserta', href: '#' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Penilaian PKL - ${pendaftaran.user?.full_name || 'Detail Peserta'}`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/admin/penilaian-pkl">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{pendaftaran.user?.full_name || 'Detail Peserta'}</h1>
                            <p className="text-muted-foreground font-serif">
                                Detail penilaian dan progress PKL
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Student Information */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Student Info Card */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Nama</Label>
                                        <p className="text-sm">{
                                            pendaftaran.user?.nama_lengkap || 
                                            pendaftaran.user?.nama || 
                                            pendaftaran.user?.full_name || 
                                            pendaftaran.user?.name || 
                                            'Nama tidak tersedia'
                                        }</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Institusi</Label>
                                        <p className="text-sm">{
                                            pendaftaran.user?.institusi ||
                                            pendaftaran.user?.institution || 
                                            pendaftaran.institusi_asal || 
                                            pendaftaran.user?.school_university || 
                                            'Universitas Gadjah Mada'
                                        }</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Program Studi</Label>
                                        <p className="text-sm">{
                                            pendaftaran.user?.jurusan ||
                                            pendaftaran.program_studi || 
                                            pendaftaran.user?.major_concentration || 
                                            pendaftaran.user?.major || 
                                            'Teknik Industri'
                                        }</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Periode PKL</Label>
                                        <p className="text-sm">
                                            {(() => {
                                                if (pendaftaran.tanggal_mulai && pendaftaran.tanggal_selesai) {
                                                    const posisiPKL = pendaftaran.posisiPKL || pendaftaran.posisi_p_k_l;
                                                    const durasi = posisiPKL?.durasi_bulan;
                                                    const isProjectBased = durasi === 1;
                                                    
                                                    // Format tanggal untuk menghilangkan timestamp
                                                    const formatDate = (dateStr: string) => {
                                                        return dateStr.split('T')[0]; // Ambil bagian sebelum T
                                                    };
                                                    
                                                    const periode = `${formatDate(pendaftaran.tanggal_mulai)} - ${formatDate(pendaftaran.tanggal_selesai)}`;
                                                    return isProjectBased ? `${periode} (Project Based)` : periode;
                                                }
                                                return pendaftaran.status === 'Disetujui' 
                                                    ? 'Periode akan ditentukan setelah persetujuan'
                                                    : 'Periode belum ditentukan';
                                            })()}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Program PKL</Label>
                                        <p className="text-sm">{(pendaftaran.posisiPKL || pendaftaran.posisi_p_k_l)?.nama_posisi || 'Program tidak tersedia'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Kelas/Semester</Label>
                                        <p className="text-sm">{(() => {
                                            const institusi = pendaftaran.user?.institusi || pendaftaran.user?.institution || pendaftaran.institusi_asal || '';
                                            const isSMK = institusi.toLowerCase().includes('smk');
                                            
                                            if (isSMK) {
                                                // For SMK students, try multiple sources for class information
                                                const klasSMK = pendaftaran.user?.class_semester;
                                                if (klasSMK) {
                                                    const kelasStr = klasSMK.toString().toUpperCase();
                                                    if (kelasStr === 'X' || kelasStr === 'XI' || kelasStr === 'XII') {
                                                        return `Kelas ${kelasStr}`;
                                                    }
                                                }
                                                
                                                const userSemester = pendaftaran.user?.semester || pendaftaran.semester;
                                                if (userSemester) {
                                                    const semesterStr = userSemester.toString().toUpperCase();
                                                    if (semesterStr === 'X' || semesterStr === 'XI' || semesterStr === 'XII') {
                                                        return `Kelas ${semesterStr}`;
                                                    }
                                                    const semesterNum = parseInt(semesterStr);
                                                    if (!isNaN(semesterNum)) {
                                                        if (semesterNum >= 5 && semesterNum <= 6) return 'Kelas XII';
                                                        if (semesterNum >= 3 && semesterNum <= 4) return 'Kelas XI';
                                                        if (semesterNum >= 1 && semesterNum <= 2) return 'Kelas X';
                                                    }
                                                }
                                                return 'Semester 7';
                                            } else {
                                                // For university students
                                                const semester = pendaftaran.user?.semester || pendaftaran.semester;
                                                if (semester) {
                                                    const semesterNum = parseInt(semester.toString());
                                                    if (!isNaN(semesterNum) && semesterNum >= 1 && semesterNum <= 8) {
                                                        return `Semester ${semesterNum}`;
                                                    }
                                                    return semester.toString();
                                                }
                                                return 'Semester 7';
                                            }
                                        })()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Assessment Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Penilaian Akhir Program</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-sm font-medium">Kelulusan?</Label>
                                        <div className="flex gap-4 mt-2">
                                            <label className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
                                                <input
                                                    type="radio"
                                                    name="kelulusan"
                                                    value="Lulus"
                                                    disabled
                                                    className="text-gray-400"
                                                />
                                                <span className="text-gray-400">Lulus</span>
                                            </label>
                                            <label className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
                                                <input
                                                    type="radio"
                                                    name="kelulusan"
                                                    value="Tidak Lulus"
                                                    disabled
                                                    className="text-gray-400"
                                                />
                                                <span className="text-gray-400">Tidak Lulus</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-gray-400">Link Sertifikat Kelulusan</Label>
                                        <input
                                            type="url"
                                            disabled
                                            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-400 cursor-not-allowed"
                                            placeholder="https://example.com/certificate"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-gray-400">Catatan & Feedback Final</Label>
                                        <Textarea
                                            disabled
                                            className="mt-1 bg-gray-50 text-gray-400 cursor-not-allowed"
                                            placeholder="Catatan penilaian akhir..."
                                            rows={4}
                                        />
                                    </div>
                                </div>

                                <Button 
                                    disabled 
                                    className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                                >
                                    Simpan Penilaian & Selesaikan PKL
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Submission Reports */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Submission Tugas & Laporan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {submisi_pkl.map((report) => (
                                        <div
                                            key={report.id}
                                            className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{report.nomor_submisi}</span>
                                                    {report.tipe_submisi === 'link' && (
                                                        <ExternalLink className="h-4 w-4 text-blue-500" />
                                                    )}
                                                    {report.tipe_submisi === 'dokumen' && (
                                                        <File className="h-4 w-4 text-gray-500" />
                                                    )}
                                                    {report.tipe_submisi === 'dokumen_dan_link' && (
                                                        <div className="flex items-center gap-1">
                                                            <File className="h-4 w-4 text-gray-500" />
                                                            <ExternalLink className="h-4 w-4 text-blue-500" />
                                                        </div>
                                                    )}
                                                </div>
                                                {report.tanggal_submit && (
                                                    <div className="text-sm text-muted-foreground mt-1">
                                                        {report.tanggal_submit}
                                                    </div>
                                                )}
                                                {report.judul_tugas && (
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        {report.judul_tugas}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {report.status === 'submitted' ? (
                                                    <>
                                                        {report.is_assessed ? (
                                                            <Badge 
                                                                variant={report.status_penilaian === 'diterima' ? 'default' : 'destructive'}
                                                                className="flex items-center gap-1"
                                                            >
                                                                {report.status_penilaian === 'diterima' ? (
                                                                    <CheckCircle className="h-3 w-3" />
                                                                ) : (
                                                                    <XCircle className="h-3 w-3" />
                                                                )}
                                                                {report.status_penilaian === 'diterima' ? 'Diterima' : 'Ditolak'}
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary">Belum Dinilai</Badge>
                                                        )}
                                                        
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleViewSubmission(report)}
                                                        >
                                                            Lihat Detail
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Badge variant="outline" className="text-gray-500">
                                                        Belum Submit
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Submission Detail Modal */}
            <Dialog open={isSubmissionModalOpen} onOpenChange={setIsSubmissionModalOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detail Submisi</DialogTitle>
                        <DialogDescription>
                            Informasi detail submisi peserta PKL
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedSubmission && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column - Basic Info & Content */}
                            <div className="space-y-4">
                                {/* Basic Info */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-600">Submisi</span>
                                        <p className="mt-1 text-lg font-semibold">{selectedSubmission.nomor_submisi}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Kategori</span>
                                        <p className="mt-1">{selectedSubmission.kategori_submisi === 'laporan' ? 'Laporan' : 'Tugas'}</p>
                                    </div>
                                    {selectedSubmission.tanggal_submit && (
                                        <div className="col-span-2">
                                            <span className="font-medium text-gray-600">Tanggal Submit</span>
                                            <p className="mt-1">{selectedSubmission.tanggal_submit}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Content based on document type */}
                                {selectedSubmission.judul_tugas && (
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-800 border-b pb-2">Detail Tugas</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="font-medium text-gray-600">Judul Tugas</span>
                                                <p className="mt-1 bg-gray-50 p-3 rounded border">{selectedSubmission.judul_tugas}</p>
                                            </div>
                                            
                                            {selectedSubmission.deskripsi_tugas && (
                                                <div>
                                                    <span className="font-medium text-gray-600">Deskripsi</span>
                                                    <p className="mt-1 bg-gray-50 p-3 rounded border text-sm leading-relaxed">{selectedSubmission.deskripsi_tugas}</p>
                                                </div>
                                            )}
                                        
                                        {/* Display based on submission type */}
                                        {selectedSubmission.tipe_submisi === 'link' && selectedSubmission.link_submisi && (
                                            <div>
                                                <span className="font-medium text-gray-600">Link Submisi</span>
                                                <div className="mt-1 flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
                                                    <ExternalLink className="h-4 w-4 text-blue-600" />
                                                    <a 
                                                        href={selectedSubmission.link_submisi} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 underline break-all flex-1"
                                                    >
                                                        {selectedSubmission.link_submisi}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {selectedSubmission.tipe_submisi === 'dokumen' && selectedSubmission.nama_dokumen && (
                                            <div>
                                                <span className="font-medium text-gray-600">Dokumen Submisi</span>
                                                <div className="mt-1 p-3 bg-gray-50 border rounded">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <File className="h-8 w-8 text-gray-500" />
                                                            <div>
                                                                <p className="font-medium">{selectedSubmission.nama_dokumen}</p>
                                                                <p className="text-sm text-gray-500">
                                                                    {selectedSubmission.ukuran_file_format} • {selectedSubmission.tipe_mime}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {selectedSubmission.url_file && (
                                                            <a href={selectedSubmission.url_file} target="_blank" rel="noopener noreferrer">
                                                                <Button variant="outline" size="sm">
                                                                    <Download className="h-4 w-4 mr-1" />
                                                                    Download
                                                                </Button>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {selectedSubmission.tipe_submisi === 'dokumen_dan_link' && (
                                            <div className="space-y-4">
                                                {/* Dokumen Section */}
                                                {selectedSubmission.nama_dokumen && (
                                                    <div>
                                                        <span className="font-medium text-gray-600">Dokumen Submisi</span>
                                                        <div className="mt-1 p-3 bg-gray-50 border rounded">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <File className="h-8 w-8 text-gray-500" />
                                                                    <div>
                                                                        <p className="font-medium">{selectedSubmission.nama_dokumen}</p>
                                                                        <p className="text-sm text-gray-500">
                                                                            {selectedSubmission.ukuran_file_format} • {selectedSubmission.tipe_mime}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                {selectedSubmission.url_file && (
                                                                    <a href={selectedSubmission.url_file} target="_blank" rel="noopener noreferrer">
                                                                        <Button variant="outline" size="sm">
                                                                            <Download className="h-4 w-4 mr-1" />
                                                                            Download
                                                                        </Button>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Link Section */}
                                                {selectedSubmission.link_submisi && (
                                                    <div>
                                                        <span className="font-medium text-gray-600">Link Submisi</span>
                                                        <div className="mt-1 flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
                                                            <ExternalLink className="h-4 w-4 text-blue-600" />
                                                            <a 
                                                                href={selectedSubmission.link_submisi} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 underline break-all flex-1"
                                                            >
                                                                {selectedSubmission.link_submisi}
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            </div>

                            {/* Right Column - Assessment Section */}
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium text-gray-800">Penilaian</h4>
                                        <Badge 
                                            variant={selectedSubmission.is_assessed ? 'default' : 'outline'}
                                            className={selectedSubmission.is_assessed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                                        >
                                            {selectedSubmission.is_assessed ? 'Sudah Dinilai' : 'Belum Dinilai'}
                                        </Badge>
                                    </div>
                                    
                                    {selectedSubmission.is_assessed ? (
                                        <div className="space-y-3">
                                            <div className="text-center">
                                                <span className="font-medium text-gray-600">Status Penilaian</span>
                                                <div className="mt-2">
                                                    <Badge 
                                                        variant={selectedSubmission.status_penilaian === 'diterima' ? 'default' : 'destructive'}
                                                        className="text-sm px-3 py-1"
                                                    >
                                                        {selectedSubmission.status_penilaian === 'diterima' ? 'Diterima' : 'Ditolak'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">Feedback</span>
                                                <p className="mt-1 bg-white p-3 rounded border text-sm">
                                                    {selectedSubmission.feedback_pembimbing || 'Tidak ada feedback'}
                                                </p>
                                            </div>
                                            {selectedSubmission.tanggal_verifikasi && (
                                                <div>
                                                    <span className="font-medium text-gray-600">Tanggal Penilaian</span>
                                                    <p className="mt-1 text-sm text-gray-600">{selectedSubmission.tanggal_verifikasi}</p>
                                                </div>
                                            )}
                                            {selectedSubmission.diverifikasi_oleh && (
                                                <div>
                                                    <span className="font-medium text-gray-600">Dinilai Oleh</span>
                                                    <p className="mt-1 text-sm text-gray-600">{selectedSubmission.diverifikasi_oleh}</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="text-center py-4 text-gray-500">
                                                <p className="text-sm">Submisi ini belum diberikan penilaian</p>
                                            </div>
                                            
                                            {/* Assessment Form */}
                                            <div className="space-y-3">
                                                <div>
                                                    <Label className="text-sm font-medium">Status Penilaian</Label>
                                                    <div className="flex gap-4 mt-2">
                                                        <label className="flex items-center space-x-2">
                                                            <input
                                                                type="radio"
                                                                name="status_penilaian"
                                                                value="diterima"
                                                                checked={assessmentForm.status_penilaian === 'diterima'}
                                                                onChange={(e) => setAssessmentForm(prev => ({ ...prev, status_penilaian: e.target.value }))}
                                                            />
                                                            <span>Diterima</span>
                                                        </label>
                                                        <label className="flex items-center space-x-2">
                                                            <input
                                                                type="radio"
                                                                name="status_penilaian"
                                                                value="ditolak"
                                                                checked={assessmentForm.status_penilaian === 'ditolak'}
                                                                onChange={(e) => setAssessmentForm(prev => ({ ...prev, status_penilaian: e.target.value }))}
                                                            />
                                                            <span>Ditolak</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <Label className="text-sm font-medium">Feedback</Label>
                                                    <Textarea
                                                        value={assessmentForm.feedback_pembimbing}
                                                        onChange={(e) => setAssessmentForm(prev => ({ ...prev, feedback_pembimbing: e.target.value }))}
                                                        placeholder="Berikan feedback untuk submisi ini..."
                                                        rows={4}
                                                        className="mt-1"
                                                    />
                                                </div>
                                                
                                                <Button 
                                                    onClick={handleSaveAssessment}
                                                    disabled={!assessmentForm.status_penilaian}
                                                    className="w-full"
                                                >
                                                    Simpan Penilaian
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
