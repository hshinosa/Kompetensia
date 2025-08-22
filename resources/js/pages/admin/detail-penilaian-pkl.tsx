import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
// Pastikan path ke 'types' sudah benar
import { type BreadcrumbItem, PenilaianPKL, PendaftaranPKL, User, PKL, PosisiPKL } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, CheckCircle, XCircle, ExternalLink, File, Download } from 'lucide-react';

// Interface untuk Laporan Mingguan (sesuai struktur dari database)
interface WeeklyReport {
    id: number;
    submissionNumber: string;
    submittedDate?: string;
    status: 'submitted' | 'pending';
    jenisDocument: 'Laporan/Tugas' | '';
    submissionType: 'link' | 'document' | '';
    isAssessed: boolean;
    statusPenilaian?: 'Diterima' | 'Tidak Diterima';
    feedback?: string;
    judulTugas?: string;
    deskripsiTugas?: string;
    linkSubmisi?: string;
    fileName?: string;
    fileSize?: string;
    fileType?: string;
}

// Definisikan tipe Props yang akan diterima dari controller (sudah benar)
interface Props {
    penilaian: PenilaianPKL & {
        pendaftaran: PendaftaranPKL & {
            user: User;
            pkl: PKL;
            posisi: PosisiPKL;
            penilaian?: PenilaianPKL; // Penilaian akhir bersifat opsional
        }
    };
    weeklyReports: WeeklyReport[];
}

export default function DetailPenilaianPKL({ penilaian, weeklyReports = [] }: Readonly<Props>) {
    // Guard Clause untuk mencegah error jika data belum siap
    if (!penilaian) {
        return (
            <AppLayout>
                <div className="p-6">Loading...</div>
            </AppLayout>
        );
    }

    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<WeeklyReport | null>(null);
    const [assessmentForm, setAssessmentForm] = useState({
        statusPenilaian: '',
        feedback: ''
    });

    const handleViewSubmission = (submission: WeeklyReport) => {
        setSelectedSubmission(submission);
        setIsSubmissionModalOpen(true);
        if (submission.isAssessed) {
            setAssessmentForm({
                statusPenilaian: submission.statusPenilaian || '',
                feedback: submission.feedback || ''
            });
        } else {
            setAssessmentForm({ statusPenilaian: '', feedback: '' });
        }
    };

    const handleSaveAssessment = () => {
        if (!selectedSubmission) return;
        router.post(
            `/admin/penilaian-pkl/assessment/${selectedSubmission.id}`,
            {
                statusPenilaian: assessmentForm.statusPenilaian,
                feedback: assessmentForm.feedback
            },
            {
                onSuccess: () => setIsSubmissionModalOpen(false),
                onError: () => alert('Gagal menyimpan penilaian')
            }
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Penilaian PKL', href: '/admin/penilaian-pkl' },
        { title: penilaian.pendaftaran?.user?.name || 'Detail Penilaian', href: '#' }
    ];

    const { pendaftaran } = penilaian; // Shortcut untuk akses lebih mudah

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Penilaian PKL - ${pendaftaran?.user?.name}`} />
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
                            <h1 className="text-3xl font-bold tracking-tight">{pendaftaran?.user?.name}</h1>
                            <p className="text-muted-foreground font-serif">
                                Detail penilaian dan progress PKL
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kolom Kiri - Informasi & Penilaian Akhir */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Kartu Informasi Peserta */}
                        <Card>
                             <CardContent className="p-6 space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Nama</Label>
                                    <p className="text-sm">{pendaftaran?.user?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Institusi</Label>
                                    <p className="text-sm">{pendaftaran?.institusi_asal || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Program Studi</Label>
                                    <p className="text-sm">{pendaftaran?.program_studi || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Periode PKL</Label>
                                    <p className="text-sm">
                                        {pendaftaran.pkl?.tanggal_mulai && pendaftaran.pkl?.tanggal_selesai
                                            ? `${new Date(pendaftaran.pkl.tanggal_mulai).toLocaleDateString('id-ID')} - ${new Date(pendaftaran.pkl.tanggal_selesai).toLocaleDateString('id-ID')}`
                                            : 'Belum ditentukan'}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Posisi PKL</Label>
                                    <p className="text-sm">{pendaftaran?.posisi?.nama_posisi || 'N/A'}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Kartu Penilaian Akhir */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Penilaian Akhir Program</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {pendaftaran?.penilaian ? (
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Status Penilaian</Label>
                                            <div className="mt-2">
                                                <Badge
                                                    variant={pendaftaran.penilaian.status_penilaian === 'Diterima' ? 'default' : 'destructive'}
                                                    className="text-sm px-3 py-1"
                                                >
                                                    {pendaftaran.penilaian.status_penilaian}
                                                </Badge>
                                            </div>
                                        </div>
                                        {pendaftaran.penilaian.catatan_penilai && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Catatan Penilai</Label>
                                                <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                                                    {pendaftaran.penilaian.catatan_penilai}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Tanggal Penilaian</Label>
                                            <p className="text-sm mt-1">
                                                {pendaftaran.penilaian.tanggal_penilaian
                                                    ? new Date(pendaftaran.penilaian.tanggal_penilaian).toLocaleDateString('id-ID', {
                                                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                                      })
                                                    : 'Belum dinilai'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p className="text-lg font-medium">Belum Ada Penilaian</p>
                                        <p className="text-sm">Penilaian akhir untuk peserta ini belum tersedia.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom Kanan - Submission Laporan */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader><CardTitle className="text-lg">Submission Tugas & Laporan</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {weeklyReports.map((report) => (
                                        <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{report.submissionNumber}</span>
                                                    {report.submissionType === 'link' && <ExternalLink className="h-4 w-4 text-blue-500" />}
                                                    {report.submissionType === 'document' && <File className="h-4 w-4 text-gray-500" />}
                                                </div>
                                                {report.submittedDate && <div className="text-sm text-muted-foreground mt-1">{new Date(report.submittedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {report.status === 'submitted' ? (
                                                    <>
                                                        {report.isAssessed ? (
                                                            <Badge variant={report.statusPenilaian === 'Diterima' ? 'default' : 'destructive'} className="flex items-center gap-1">
                                                                {report.statusPenilaian === 'Diterima' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                                {report.statusPenilaian}
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary">Belum Dinilai</Badge>
                                                        )}
                                                        <Button variant="outline" size="sm" onClick={() => handleViewSubmission(report)}>Lihat Detail</Button>
                                                    </>
                                                ) : (
                                                    <Badge variant="outline" className="text-gray-500">Belum Submit</Badge>
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

            {/* Modal Detail Submisi */}
            <Dialog open={isSubmissionModalOpen} onOpenChange={setIsSubmissionModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Detail Submisi</DialogTitle>
                        <DialogDescription>
                            Informasi detail submisi peserta PKL
                        </DialogDescription>
                    </DialogHeader>
                    {selectedSubmission && (
                        <div className="space-y-4">
                             <div className="grid grid-cols-1 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-600">Submisi</span>
                                    <p className="mt-1 text-lg font-semibold">{selectedSubmission.submissionNumber}</p>
                                </div>
                            </div>
                            {selectedSubmission.jenisDocument === 'Laporan/Tugas' && (
                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-800">Detail Tugas</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="font-medium text-gray-600">Judul Tugas</span>
                                            <p className="mt-1 bg-gray-50 p-3 rounded border">{selectedSubmission.judulTugas}</p>
                                        </div>
                                        {selectedSubmission.submissionType === 'link' && selectedSubmission.linkSubmisi && (
                                            <div>
                                                <span className="font-medium text-gray-600">Link Submisi</span>
                                                <div className="mt-1 flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
                                                    <ExternalLink className="h-4 w-4 text-blue-600" />
                                                    <a href={selectedSubmission.linkSubmisi} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline break-all flex-1">
                                                        {selectedSubmission.linkSubmisi}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        {selectedSubmission.submissionType === 'document' && (
                                            <div>
                                                <span className="font-medium text-gray-600">Dokumen Submisi</span>
                                                <div className="mt-1 p-3 bg-gray-50 border rounded">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <File className="h-8 w-8 text-gray-500" />
                                                            <div>
                                                                <p className="font-medium">{selectedSubmission.fileName}</p>
                                                                <p className="text-sm text-gray-500">{selectedSubmission.fileSize} • {selectedSubmission.fileType}</p>
                                                            </div>
                                                        </div>
                                                        <Button variant="outline" size="sm">
                                                            <Download className="h-4 w-4 mr-1" /> Download
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="border-t pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-gray-800">Penilaian</h4>
                                    <Badge variant={selectedSubmission.isAssessed ? 'default' : 'outline'} className={selectedSubmission.isAssessed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                                        {selectedSubmission.isAssessed ? 'Sudah Dinilai' : 'Belum Dinilai'}
                                    </Badge>
                                </div>
                                {selectedSubmission.isAssessed ? (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="text-center">
                                                <span className="font-medium text-gray-600">Status Penilaian</span>
                                                <div className="mt-2">
                                                    <Badge variant={selectedSubmission.statusPenilaian === 'Diterima' ? 'default' : 'destructive'} className="text-sm px-3 py-1">
                                                        {selectedSubmission.statusPenilaian}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Feedback</span>
                                            <p className="mt-1 bg-gray-50 p-3 rounded border text-sm">
                                                {selectedSubmission.feedback || 'Tidak ada feedback'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="text-center py-4 text-gray-500">
                                            <p className="text-sm">Submisi ini belum diberikan penilaian</p>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <Label className="text-sm font-medium">Status Penilaian</Label>
                                                <div className="flex gap-4 mt-2">
                                                    <label className="flex items-center space-x-2">
                                                        <input type="radio" name="statusPenilaian" value="Diterima" checked={assessmentForm.statusPenilaian === 'Diterima'} onChange={(e) => setAssessmentForm(prev => ({ ...prev, statusPenilaian: e.target.value }))} />
                                                        <span>Diterima</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2">
                                                        <input type="radio" name="statusPenilaian" value="Tidak Diterima" checked={assessmentForm.statusPenilaian === 'Tidak Diterima'} onChange={(e) => setAssessmentForm(prev => ({ ...prev, statusPenilaian: e.target.value }))} />
                                                        <span>Tidak Diterima</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium">Feedback</Label>
                                                <Textarea value={assessmentForm.feedback} onChange={(e) => setAssessmentForm(prev => ({ ...prev, feedback: e.target.value }))} placeholder="Berikan feedback untuk submisi ini..." rows={3} className="mt-1" />
                                            </div>
                                            <Button onClick={handleSaveAssessment} disabled={!assessmentForm.statusPenilaian} className="w-full">
                                                Simpan Penilaian
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}