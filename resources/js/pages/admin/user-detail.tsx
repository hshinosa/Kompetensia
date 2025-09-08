import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useInitials } from '@/hooks/use-initials';
import { ArrowLeft, Edit, Mail, Phone, Calendar, User, GraduationCap, Shield, FileText, Clock, Hash } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface UserIndonesia {
    id: number;
    nama: string;
    nama_lengkap?: string;
    email: string;
    role: string;
    telepon?: string;
    alamat?: string;
    tanggal_lahir?: string;
    tempat_lahir?: string;
    institusi?: string;
    jurusan?: string;
    semester?: number;
    foto_profil?: string;
    aktif: boolean;
    status_akun?: string;
    tipe_pengguna?: string;
    // Additional fields
    gender?: string;
    instagram_handle?: string;
    tiktok_handle?: string;
    created_at: string;
    updated_at: string;
    email_verified_at?: string;
    // Relationships
    aktivitas?: UserActivity[];
    dokumen?: UserDocument[];
    pendaftaran_pkl?: any[];
    pendaftaran_sertifikasi?: any[];
}

interface UserActivity {
    id: number;
    jenis_aktivitas: string;
    deskripsi: string;
    created_at: string;
}

interface UserDocument {
    id: number;
    jenis_dokumen: string;
    nama_dokumen: string;
    terverifikasi: boolean;
    aktif: boolean;
    created_at: string;
}

interface UserStats {
    sertifikasi_count: number;
    pkl_count: number;
    documents_count: number;
    activities_count: number;
    profile_completion: number;
}

interface UserDetailProps {
    pengguna?: UserIndonesia;
    userStats?: UserStats;
}

export default function UserDetail({ pengguna, userStats }: Readonly<UserDetailProps>) {
    const getInitials = useInitials();

    // Handle case where pengguna is undefined
    if (!pengguna) {
        return (
            <AppLayout breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Manajemen Pengguna', href: '/admin/pengguna' },
                { title: 'Detail Pengguna', href: '/admin/pengguna' }
            ]}>
                <Head title="Detail Pengguna" />
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Pengguna Tidak Ditemukan
                        </h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Data pengguna yang Anda cari tidak dapat ditemukan.
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/admin/pengguna">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Daftar Pengguna
                            </Link>
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Manajemen Pengguna', href: '/admin/pengguna' },
        { title: 'Detail Pengguna', href: `/admin/pengguna/${pengguna.id}` }
    ];

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'instructor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'instruktur': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'assessor': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'asesor': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'student': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            case 'mahasiswa': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            case 'user': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getStatusBadgeColor = (status: string, aktif: boolean) => {
        if (!aktif) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'aktif': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'suspended': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'banned': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return '-';
        }
    };

    const getGenderDisplayName = (gender: string) => {
        switch (gender?.toLowerCase()) {
            case 'male': return 'Laki-laki';
            case 'female': return 'Perempuan';
            case 'laki-laki': return 'Laki-laki';
            case 'perempuan': return 'Perempuan';
            case 'l': return 'Laki-laki';
            case 'p': return 'Perempuan';
            default: return gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'Tidak Diketahui';
        }
    };

    const getTipePenggunaDisplayName = (tipe: string) => {
        switch (tipe) {
            case 'mahasiswa': return 'Mahasiswa';
            case 'instruktur': return 'Instruktur';
            case 'asesor': return 'Asesor';
            case 'admin': return 'Administrator';
            default: return tipe ? tipe.charAt(0).toUpperCase() + tipe.slice(1) : 'Tidak Diketahui';
        }
    };

    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case 'admin': return 'Administrator';
            case 'instructor': return 'Instruktur';
            case 'instruktur': return 'Instruktur';
            case 'assessor': return 'Asesor';
            case 'asesor': return 'Asesor';
            case 'student': return 'Mahasiswa';
            case 'mahasiswa': return 'Mahasiswa';
            case 'user': return 'Pengguna';
            default: return role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Tidak Diketahui';
        }
    };

    const getStatusDisplayName = (status: string, aktif: boolean) => {
        if (!aktif) return 'Tidak Aktif';
        switch (status) {
            case 'active': return 'Aktif';
            case 'aktif': return 'Aktif';
            case 'suspended': return 'Suspended';
            case 'pending': return 'Menunggu';
            case 'banned': return 'Diblokir';
            default: return aktif ? 'Aktif' : 'Tidak Aktif';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Pengguna - ${pengguna.nama_lengkap || pengguna.nama}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin/pengguna" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Detail Pengguna</h1>
                            <p className="text-muted-foreground">Informasi lengkap pengguna</p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/admin/pengguna/${pengguna.id}/edit`} className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit Pengguna
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <Card className="lg:col-span-1">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={pengguna.foto_profil} alt={pengguna.nama_lengkap || pengguna.nama} />
                                    <AvatarFallback className="text-xl">
                                        {getInitials(pengguna.nama_lengkap || pengguna.nama)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <CardTitle className="text-xl">{pengguna.nama_lengkap || pengguna.nama || 'Nama tidak tersedia'}</CardTitle>
                            <p className="text-sm text-muted-foreground">{pengguna.email || 'Email tidak tersedia'}</p>
                            <div className="flex justify-center gap-2 mt-2">
                                <Badge className={getRoleBadgeColor(pengguna.role)}>
                                    {getRoleDisplayName(pengguna.role)}
                                </Badge>
                                <Badge className={getStatusBadgeColor(pengguna.status_akun || '', pengguna.aktif)}>
                                    {getStatusDisplayName(pengguna.status_akun || '', pengguna.aktif)}
                                </Badge>
                            </div>
                            {pengguna.tipe_pengguna && (
                                <div className="mt-2">
                                    <Badge variant="outline">
                                        {getTipePenggunaDisplayName(pengguna.tipe_pengguna)}
                                    </Badge>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">ID Pengguna</p>
                                        <p className="font-medium">#{pengguna.id}</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium">{pengguna.email || '-'}</p>
                                        {pengguna.email_verified_at && (
                                            <p className="text-xs text-green-600">✓ Terverifikasi</p>
                                        )}
                                    </div>
                                </div>
                                {pengguna.telepon && (
                                    <>
                                        <Separator />
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Telepon</p>
                                                <p className="font-medium">{pengguna.telepon}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                                <Separator />
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Terdaftar</p>
                                        <p className="font-medium">{formatDate(pengguna.created_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Statistics Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">{userStats?.sertifikasi_count ?? 0}</div>
                                    <div className="text-sm text-muted-foreground">Sertifikasi</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">{userStats?.pkl_count ?? 0}</div>
                                    <div className="text-sm text-muted-foreground">PKL</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-600">{userStats?.documents_count ?? 0}</div>
                                    <div className="text-sm text-muted-foreground">Dokumen</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-orange-600">{userStats?.activities_count ?? 0}</div>
                                    <div className="text-sm text-muted-foreground">Aktivitas</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Profile Completion */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Kelengkapan Profil</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Progress</span>
                                        <span>{userStats?.profile_completion ?? 75}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                            style={{ width: `${userStats?.profile_completion ?? 75}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Media Information */}
                        {(pengguna.instagram_handle || pengguna.tiktok_handle) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Hash className="h-5 w-5" />
                                        Media Sosial
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {pengguna.instagram_handle && (
                                            <div>
                                                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                    <Hash className="h-4 w-4" />
                                                    Instagram
                                                </span>
                                                <p className="mt-1 text-base font-mono text-blue-600">@{pengguna.instagram_handle}</p>
                                            </div>
                                        )}
                                        {pengguna.tiktok_handle && (
                                            <div>
                                                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                    <Hash className="h-4 w-4" />
                                                    TikTok
                                                </span>
                                                <p className="mt-1 text-base font-mono text-pink-600">@{pengguna.tiktok_handle}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Detailed Information Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Informasi Personal
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Nama Lengkap</span>
                                    <p className="mt-1 text-base">{pengguna.nama_lengkap || pengguna.nama || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Username</span>
                                    <p className="mt-1 text-base">{pengguna.nama || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Email</span>
                                    <p className="mt-1 text-base flex items-center gap-2">
                                        {pengguna.email || '-'}
                                        {pengguna.email_verified_at && (
                                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                                Terverifikasi
                                            </Badge>
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Telepon</span>
                                    <p className="mt-1 text-base">{pengguna.telepon || '-'}</p>
                                </div>
                                {pengguna.gender && (
                                    <div>
                                        <span className="text-sm font-medium text-muted-foreground">Jenis Kelamin</span>
                                        <p className="mt-1 text-base">{getGenderDisplayName(pengguna.gender)}</p>
                                    </div>
                                )}
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Tempat Lahir</span>
                                    <p className="mt-1 text-base">{pengguna.tempat_lahir || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Tanggal Lahir</span>
                                    <p className="mt-1 text-base">{formatDate(pengguna.tanggal_lahir || '')}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Alamat</span>
                                    <p className="mt-1 text-base">{pengguna.alamat || '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Academic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5" />
                                Informasi Akademik
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Academic Info */}
                                {(pengguna.institusi || pengguna.jurusan || pengguna.semester) ? (
                                    <>
                                        {pengguna.institusi && (
                                            <div>
                                                <span className="text-sm font-medium text-muted-foreground">Institusi</span>
                                                <p className="mt-1 text-base">{pengguna.institusi}</p>
                                            </div>
                                        )}
                                        {pengguna.jurusan && (
                                            <div>
                                                <span className="text-sm font-medium text-muted-foreground">Jurusan</span>
                                                <p className="mt-1 text-base">{pengguna.jurusan}</p>
                                            </div>
                                        )}
                                        {pengguna.semester && (
                                            <div>
                                                <span className="text-sm font-medium text-muted-foreground">Semester</span>
                                                <p className="mt-1 text-base">Semester {pengguna.semester}</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>Belum ada informasi akademik</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* System Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Informasi Sistem
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Role</span>
                                <div className="mt-1">
                                    <Badge className={getRoleBadgeColor(pengguna.role)}>
                                        {getRoleDisplayName(pengguna.role)}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Tipe Pengguna</span>
                                <div className="mt-1">
                                    <Badge variant="outline">
                                        {getTipePenggunaDisplayName(pengguna.tipe_pengguna || pengguna.role)}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Status Akun</span>
                                <div className="mt-1">
                                    <Badge className={getStatusBadgeColor(pengguna.status_akun || '', pengguna.aktif)}>
                                        {getStatusDisplayName(pengguna.status_akun || '', pengguna.aktif)}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Status Aktif</span>
                                <div className="mt-1">
                                    <Badge className={pengguna.aktif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                        {pengguna.aktif ? 'Aktif' : 'Tidak Aktif'}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Tanggal Daftar</span>
                                <p className="mt-1 text-base">{formatDate(pengguna.created_at)}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Terakhir Update</span>
                                <p className="mt-1 text-base">{formatDate(pengguna.updated_at)}</p>
                            </div>
                            {pengguna.email_verified_at && (
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Email Terverifikasi</span>
                                    <p className="mt-1 text-base">{formatDate(pengguna.email_verified_at)}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activities */}
                {pengguna.aktivitas && pengguna.aktivitas.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Aktivitas Terbaru
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {pengguna.aktivitas.slice(0, 5).map((aktivitas) => (
                                    <div key={aktivitas.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div>
                                            <p className="font-medium text-sm">{aktivitas.jenis_aktivitas}</p>
                                            <p className="text-sm text-muted-foreground">{aktivitas.deskripsi}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDate(aktivitas.created_at)}
                                        </span>
                                    </div>
                                ))}
                                {pengguna.aktivitas.length > 5 && (
                                    <p className="text-sm text-center text-muted-foreground pt-2">
                                        ... dan {pengguna.aktivitas.length - 5} aktivitas lainnya
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Documents */}
                {pengguna.dokumen && pengguna.dokumen.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Dokumen
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {pengguna.dokumen.map((dokumen) => (
                                    <div key={dokumen.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium text-sm">{dokumen.nama_dokumen}</p>
                                                <p className="text-sm text-muted-foreground">{dokumen.jenis_dokumen}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge 
                                                className={dokumen.terverifikasi ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                                            >
                                                {dokumen.terverifikasi ? 'Terverifikasi' : 'Belum Verifikasi'}
                                            </Badge>
                                            <Badge 
                                                variant="outline"
                                                className={dokumen.aktif ? 'border-green-200 text-green-700' : 'border-red-200 text-red-700'}
                                            >
                                                {dokumen.aktif ? 'Aktif' : 'Tidak Aktif'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

            </div>
        </AppLayout>
    );
}
