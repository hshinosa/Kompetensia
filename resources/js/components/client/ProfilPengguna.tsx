import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { User, CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';

interface ProfileData {
    nama: string;
    nama_lengkap: string;
    email: string;
    telepon?: string;
    alamat?: string;
    tanggal_lahir?: string;
    jenis_kelamin?: string;
    institusi?: string;
    jurusan?: string;
    semester?: number;
    foto_profil?: string;
    profile_completion_percentage: number;
    status_akun: string;
    role: string;
}

interface ProfilPenggunaProps {
    user: ProfileData;
}

export default function ProfilPengguna({ user }: Readonly<ProfilPenggunaProps>) {
    const getCompletionColor = (percentage: number) => {
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getCompletionStatus = (percentage: number) => {
        if (percentage >= 80) return 'Lengkap';
        if (percentage >= 60) return 'Hampir Lengkap';
        return 'Perlu Dilengkapi';
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'aktif':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'suspended':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case 'mahasiswa': return 'Mahasiswa';
            case 'instruktur': return 'Instruktur';
            case 'asesor': return 'Asesor';
            case 'admin': return 'Administrator';
            default: return role.charAt(0).toUpperCase() + role.slice(1);
        }
    };

    return (
        <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-blue-600" />
                    Profil Saya
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* User Info */}
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                            {user.foto_profil ? (
                                <img 
                                    src={user.foto_profil} 
                                    alt={user.nama_lengkap || user.nama}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                (user.nama_lengkap || user.nama).split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg">
                                {user.nama_lengkap || user.nama}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                            <div className="flex gap-2 flex-wrap">
                                <Badge className={`rounded-full border ${getStatusColor(user.status_akun)}`}>
                                    {user.status_akun}
                                </Badge>
                                <Badge variant="outline" className="rounded-full">
                                    {getRoleDisplayName(user.role)}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Personal Info */}
                    {(user.telepon || user.alamat || user.tanggal_lahir || user.jenis_kelamin) && (
                        <div className="border-t pt-4">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-600" />
                                Informasi Personal
                            </h4>
                            <div className="space-y-2 text-sm">
                                {user.telepon && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Telepon:</span>
                                        <span className="font-medium">{user.telepon}</span>
                                    </div>
                                )}
                                {user.jenis_kelamin && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Jenis Kelamin:</span>
                                        <span className="font-medium">{user.jenis_kelamin}</span>
                                    </div>
                                )}
                                {user.tanggal_lahir && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tanggal Lahir:</span>
                                        <span className="font-medium">
                                            {new Date(user.tanggal_lahir).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long', 
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                )}
                                {user.alamat && (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-gray-600">Alamat:</span>
                                        <span className="font-medium text-sm">{user.alamat}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Academic Info */}
                    {(user.institusi || user.jurusan || user.semester) && (
                        <div className="border-t pt-4">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <Target className="h-4 w-4 text-blue-600" />
                                Informasi Akademik
                            </h4>
                            <div className="space-y-2 text-sm">
                                {user.institusi && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Institusi:</span>
                                        <span className="font-medium">{user.institusi}</span>
                                    </div>
                                )}
                                {user.jurusan && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Jurusan:</span>
                                        <span className="font-medium">{user.jurusan}</span>
                                    </div>
                                )}
                                {user.semester && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Semester:</span>
                                        <span className="font-medium">Semester {user.semester}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Profile Completion */}
                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-blue-600" />
                                Kelengkapan Profil
                            </h4>
                            <span className={`text-sm font-semibold ${getCompletionColor(user.profile_completion_percentage)}`}>
                                {user.profile_completion_percentage}%
                            </span>
                        </div>
                        <Progress 
                            value={user.profile_completion_percentage} 
                            className="h-2 rounded-full"
                        />
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                                {getCompletionStatus(user.profile_completion_percentage)}
                            </span>
                            {user.profile_completion_percentage >= 80 ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                                <Clock className="h-4 w-4 text-yellow-600" />
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
