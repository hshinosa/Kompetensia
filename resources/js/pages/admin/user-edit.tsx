import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useInitials } from '@/hooks/use-initials';
import { ArrowLeft, Save, User, Calendar, GraduationCap, Shield, Hash } from 'lucide-react';
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
    foto_profil?: string;
    aktif: boolean;
    gender?: string;
    created_at: string;
    updated_at: string;
}

interface UserEditProps {
    pengguna: UserIndonesia;
}

export default function UserEdit({ pengguna }: Readonly<UserEditProps>) {
    const getInitials = useInitials();

    const { data, setData, put, processing, errors } = useForm({
        nama: pengguna.nama || '',
        nama_lengkap: pengguna.nama_lengkap || '',
        email: pengguna.email || '',
        role: pengguna.role || 'mahasiswa',
        telepon: pengguna.telepon || '',
        alamat: pengguna.alamat || '',
        tanggal_lahir: pengguna.tanggal_lahir || '',
        tempat_lahir: pengguna.tempat_lahir || '',
        gender: pengguna.gender || '',
        aktif: pengguna.aktif ?? true,
        password: '',
        password_confirmation: ''
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Manajemen Pengguna', href: '/admin/pengguna' },
        { title: 'Edit Pengguna', href: `/admin/pengguna/${pengguna.id}/edit` }
    ];

    const roleOptions = [
        { value: 'admin', label: 'Admin' },
        { value: 'instruktur', label: 'Instruktur' },
        { value: 'asesor', label: 'Asesor' },
        { value: 'mahasiswa', label: 'Mahasiswa' }
    ];

    const genderOptions = [
        { value: 'laki-laki', label: 'Laki-laki' },
        { value: 'perempuan', label: 'Perempuan' }
    ];

    const statusOptions = [
        { value: 'aktif', label: 'Aktif' },
        { value: 'tidak_aktif', label: 'Tidak Aktif' },
        { value: 'suspended', label: 'Suspended' }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Remove empty password fields if not changed
        const submitData: any = { ...data };
        if (!submitData.password) {
            delete submitData.password;
            delete submitData.password_confirmation;
        }

        put(`/admin/pengguna/${pengguna.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                router.get(`/admin/pengguna/${pengguna.id}`);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Pengguna - ${pengguna.nama_lengkap || pengguna.nama}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/pengguna/${pengguna.id}`} className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Edit Pengguna</h1>
                            <p className="text-muted-foreground">Ubah informasi pengguna</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Terdaftar</p>
                                            <p className="font-medium">{new Date(pengguna.created_at).toLocaleDateString('id-ID')}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Form Fields */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Informasi Dasar */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Informasi Dasar
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nama">Nama Panggilan <span className="text-red-500">*</span></Label>
                                            <Input
                                                id="nama"
                                                value={data.nama}
                                                onChange={(e) => setData('nama', e.target.value)}
                                                placeholder="Masukkan nama panggilan"
                                                required
                                            />
                                            {errors.nama && <p className="text-sm text-red-500">{errors.nama}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                                            <Input
                                                id="nama_lengkap"
                                                value={data.nama_lengkap}
                                                onChange={(e) => setData('nama_lengkap', e.target.value)}
                                                placeholder="Masukkan nama lengkap"
                                            />
                                            {errors.nama_lengkap && <p className="text-sm text-red-500">{errors.nama_lengkap}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="Masukkan email"
                                                required
                                            />
                                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="telepon">Telepon</Label>
                                            <Input
                                                id="telepon"
                                                value={data.telepon}
                                                onChange={(e) => setData('telepon', e.target.value)}
                                                placeholder="Masukkan nomor telepon"
                                            />
                                            {errors.telepon && <p className="text-sm text-red-500">{errors.telepon}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="gender">Jenis Kelamin</Label>
                                            <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih jenis kelamin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="laki-laki">Laki-laki</SelectItem>
                                                    <SelectItem value="perempuan">Perempuan</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                                            <Input
                                                id="tempat_lahir"
                                                value={data.tempat_lahir}
                                                onChange={(e) => setData('tempat_lahir', e.target.value)}
                                                placeholder="Masukkan tempat lahir"
                                            />
                                            {errors.tempat_lahir && <p className="text-sm text-red-500">{errors.tempat_lahir}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                            <Input
                                                id="tanggal_lahir"
                                                type="date"
                                                value={data.tanggal_lahir}
                                                onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                            />
                                            {errors.tanggal_lahir && <p className="text-sm text-red-500">{errors.tanggal_lahir}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="alamat">Alamat</Label>
                                        <Textarea
                                            id="alamat"
                                            value={data.alamat}
                                            onChange={(e) => setData('alamat', e.target.value)}
                                            placeholder="Masukkan alamat lengkap"
                                            rows={3}
                                        />
                                        {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                    </div>

                    {/* Detailed Information Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Informasi Sistem */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Informasi Sistem
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
                                        <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="aktif"
                                        checked={data.aktif}
                                        onChange={(e) => setData('aktif', e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <Label htmlFor="aktif">Akun Aktif</Label>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Password */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ubah Password</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Kosongkan jika tidak ingin mengubah password
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password Baru</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Masukkan password baru"
                                    />
                                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Konfirmasi password baru"
                                    />
                                    {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing} className="flex items-center gap-2">
                            <Save className="h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href={`/admin/pengguna/${pengguna.id}`}>
                                Batal
                            </Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
