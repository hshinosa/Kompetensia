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

interface Sertifikat {
    id: number;
    link_sertifikat: string;
    tanggal_selesai: string;
    catatan_admin?: string;
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
    sertifikat?: Sertifikat;
    // Data Diri Fields from pendaftaran form
    nama_lengkap?: string;
    email_pendaftar?: string;
    nomor_handphone?: string;
    asal_sekolah?: string;
    jurusan?: string;
    kelas?: string;
    awal_pkl?: string;
    akhir_pkl?: string;
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
    kategori_submisi: 'proposal' | 'laporan-mingguan' | 'laporan-akhir' | 'evaluasi';
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

export default function DetailPenilaianPKL({ pendaftaran, submisi_pkl }: Readonly<Props>) {
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<SubmisiPKL | null>(null);
    
    // Assessment form state
    const [assessmentForm, setAssessmentForm] = useState({
        status_penilaian: '',
        feedback_pembimbing: ''
    });

    // Certificate modal state
    const [openCertModal, setOpenCertModal] = useState(false);
    const [certLink, setCertLink] = useState('');
    const [certDate, setCertDate] = useState(new Date().toISOString().split('T')[0]);
    const [certNote, setCertNote] = useState('');
    const [isSubmittingCert, setIsSubmittingCert] = useState(false);

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
                }
        });
    };

    const openCertificateModal = () => {
        setCertLink('');
        setCertDate(new Date().toISOString().split('T')[0]);
        setCertNote('');
        setOpenCertModal(true);
    };

    const handleSubmitCertificate = () => {
        if (!certLink || !certDate) {
            alert('Link sertifikat dan tanggal selesai harus diisi');
            return;
        }
        
        setIsSubmittingCert(true);
        router.post(`/admin/sertifikat-kelulusan/pkl/${pendaftaran.id}`, {
            link_sertifikat: certLink,
            tanggal_selesai: certDate,
            catatan_admin: certNote,
        }, {
            onSuccess: () => {
                setOpenCertModal(false);
                setCertLink('');
                setCertDate('');
                setCertNote('');
                setIsSubmittingCert(false);
            },
            onError: () => {
                setIsSubmittingCert(false);
            }
        });
    };

    // Check if Laporan Akhir is approved
    const hasApprovedLaporanAkhir = submisi_pkl.some(
        (s) => s.kategori_submisi === 'laporan-akhir' && s.status_penilaian === 'diterima'
    );

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
                    {hasApprovedLaporanAkhir && (
                        <>
                            {pendaftaran.sertifikat ? (
                                <Button 
                                    onClick={() => window.open(pendaftaran.sertifikat!.link_sertifikat, '_blank')}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Lihat Sertifikat
                                </Button>
                            ) : (
                                <Button 
                                    onClick={openCertificateModal}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Terbitkan Sertifikat
                                </Button>
                            )}
                        </>
                    )}
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
                                            pendaftaran.nama_lengkap || 
                                            pendaftaran.user?.full_name || 
                                            pendaftaran.user?.name || 
                                            'Nama tidak tersedia'
                                        }</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                                        <p className="text-sm">{
                                            pendaftaran.email_pendaftar || 
                                            pendaftaran.user?.email || 
                                            'Email tidak tersedia'
                                        }</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Nomor HP</Label>
                                        <p className="text-sm">{
                                            pendaftaran.nomor_handphone || 
                                            'Nomor tidak tersedia'
                                        }</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Institusi</Label>
                                        <p className="text-sm">{
                                            pendaftaran.asal_sekolah ||
                                            pendaftaran.institusi_asal || 
                                            'Institusi tidak tersedia'
                                        }</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Program Studi</Label>
                                        <p className="text-sm">{
                                            pendaftaran.jurusan ||
                                            pendaftaran.program_studi || 
                                            'Jurusan tidak tersedia'
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
                                            const institusi = pendaftaran.asal_sekolah || pendaftaran.institusi_asal || '';
                                            const isSMK = institusi.toLowerCase().includes('smk');
                                            
                                            if (isSMK) {
                                                // For SMK students, use kelas field from pendaftaran
                                                const kelas = pendaftaran.kelas;
                                                if (kelas) {
                                                    const kelasStr = kelas.toString().toUpperCase();
                                                    if (kelasStr === 'X' || kelasStr === 'XI' || kelasStr === 'XII') {
                                                        return `Kelas ${kelasStr}`;
                                                    }
                                                    return `Kelas ${kelas}`;
                                                }
                                                return 'Kelas tidak tersedia';
                                            } else {
                                                // For university students
                                                const semester = pendaftaran.semester;
                                                if (semester) {
                                                    const semesterNum = parseInt(semester.toString());
                                                    if (!isNaN(semesterNum) && semesterNum >= 1 && semesterNum <= 14) {
                                                        return `Semester ${semesterNum}`;
                                                    }
                                                    return semester.toString();
                                                }
                                                return 'Semester tidak tersedia';
                                            }
                                        })()}</p>
                                    </div>
                                </div>
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
                <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-y-auto">
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
                                        <p className="mt-1">{(() => {
                                            const kategori = selectedSubmission.kategori_submisi;
                                            switch(kategori) {
                                                case 'proposal': return 'Proposal PKL';
                                                case 'laporan-mingguan': return 'Laporan Mingguan';
                                                case 'laporan-akhir': return 'Laporan Akhir';
                                                case 'evaluasi': return 'Evaluasi';
                                                default: return 'Dokumen PKL';
                                            }
                                        })()}</p>
                                    </div>
                                    {selectedSubmission.tanggal_submit && (
                                        <div className="col-span-2">
                                            <span className="font-medium text-gray-600">Tanggal Submit</span>
                                            <p className="mt-1">{selectedSubmission.tanggal_submit}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-800 border-b pb-2">Dokumen & Link</h4>
                                    
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
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => window.location.href = selectedSubmission.url_file!}
                                                        >
                                                            <Download className="h-4 w-4 mr-1" />
                                                            Download
                                                        </Button>
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
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm"
                                                                    onClick={() => window.location.href = selectedSubmission.url_file!}
                                                                >
                                                                    <Download className="h-4 w-4 mr-1" />
                                                                    Download
                                                                </Button>
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

            {/* Certificate Modal */}
            <Dialog open={openCertModal} onOpenChange={setOpenCertModal}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Terbitkan Sertifikat Kelulusan</DialogTitle>
                        <DialogDescription>
                            Masukkan link sertifikat digital untuk peserta yang telah lulus
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        {/* Important Reminder */}
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-amber-800 mb-1">⚠️ Penting!</h4>
                                    <p className="text-sm text-amber-700">
                                        Pastikan file sertifikat sudah di-<strong>share secara PUBLIC</strong> agar dapat diakses oleh peserta. 
                                        <br />
                                        <span className="text-xs">
                                            (Google Drive: Klik kanan → Bagikan → Ubah ke "Siapa saja yang memiliki link")
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cert-link">Link Sertifikat *</Label>
                            <input
                                id="cert-link"
                                type="url"
                                value={certLink}
                                onChange={(e) => setCertLink(e.target.value)}
                                placeholder="https://drive.google.com/file/d/..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                            <p className="text-xs text-gray-500">
                                Masukkan link Google Drive, Dropbox, atau platform lainnya
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cert-date">Tanggal Selesai *</Label>
                            <input
                                id="cert-date"
                                type="date"
                                value={certDate}
                                onChange={(e) => setCertDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cert-note">Catatan Admin (Opsional)</Label>
                            <Textarea
                                id="cert-note"
                                value={certNote}
                                onChange={(e) => setCertNote(e.target.value)}
                                rows={3}
                                placeholder="Catatan tambahan untuk peserta..."
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpenCertModal(false)}
                            disabled={isSubmittingCert}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSubmitCertificate}
                            disabled={isSubmittingCert || !certLink || !certDate}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isSubmittingCert ? 'Menerbitkan...' : 'Terbitkan Sertifikat'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
