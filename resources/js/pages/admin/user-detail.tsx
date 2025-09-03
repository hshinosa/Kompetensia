import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Edit, Calendar, Mail, Phone, School, User, MapPin, Globe, Heart, Laptop, Camera, Video, Building2, CheckCircle, XCircle, ExternalLink, Eye, Award } from 'lucide-react';

interface UserActivity {
  id: number;
  activity_type: string;
  description: string;
  created_at: string;
  metadata?: any;
}

interface UserDocument {
  id: number;
  document_type: string;
  document_name: string;
  file_path: string;
  verification_status: string;
  uploaded_at: string;
}

interface PendaftaranSertifikasi {
  id: number;
  status: string;
  created_at: string;
  sertifikasi: {
    id: number;
    nama: string;
  };
  batch?: {
    id: number;
    nama_batch: string;
  };
}

interface PendaftaranPKL {
  id: number;
  status: string;
  created_at: string;
  posisiPKL: {
    id: number;
    nama_posisi: string;
  };
}

interface UserDetailData {
  id: number;
  name: string;
  email: string;
  full_name?: string;
  phone?: string; // Changed from phone_number to phone (sesuai migrasi)
  gender?: string;
  place_of_birth?: string;
  date_of_birth?: string;
  // Legacy fields (untuk backward compatibility)
  birth_place?: string;
  birth_date?: string;
  address?: string;
  user_type: string;
  role: string;
  account_status: string;
  is_active: boolean;
  school_university?: string;
  major_concentration?: string;
  class_semester?: string;
  instagram_handle?: string;
  tiktok_handle?: string;
  transportation?: string;
  preferred_field?: string;
  preferred_field_type?: string;
  motivation_level?: number;
  self_rating?: string;
  has_laptop?: boolean;
  has_dslr?: boolean;
  has_video_review_experience?: boolean;
  interested_in_content_creation?: boolean;
  has_viewed_company_profile?: boolean;
  is_smoker?: boolean;
  agrees_to_school_return_if_violation?: boolean;
  agrees_to_return_if_absent_twice?: boolean;
  created_at: string;
  updated_at: string;
  activities?: UserActivity[];
  documents?: UserDocument[];
  pendaftaranSertifikasi?: PendaftaranSertifikasi[];
  pendaftaranPKL?: PendaftaranPKL[];
}

interface UserStats {
  sertifikasi_count: number;
  pkl_count: number;
  documents_count: number;
  activities_count: number;
  profile_completion: number;
}

interface PageProps {
  user: UserDetailData;
  userStats: UserStats;
  [key: string]: any;
}

const UserDetailPage: React.FC = () => {
  const { props } = usePage<PageProps>();
  const { user, userStats } = props;

  const getUserTypeBadge = (userType: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      admin: 'destructive',
      instructor: 'default',
      assessor: 'secondary',
      student: 'outline'
    };
    return <Badge variant={variants[userType] || 'outline'}>{userType}</Badge>;
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive) return <Badge variant="destructive">Nonaktif</Badge>;
    
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: 'default',
      pending: 'secondary',
      suspended: 'destructive',
      banned: 'destructive'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen User', href: '/admin/user-management' },
    { title: 'Detail User', href: `#` }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Detail User - ${user.full_name || user.name}`} />
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.get(route('admin.user-management'))}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Detail User</h1>
              <p className="text-muted-foreground">{user.full_name || user.name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => router.get(route('admin.dashboard'))}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button onClick={() => router.get(route('admin.users.edit', user.id))}>
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-5">
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{userStats?.profile_completion || 0}%</div>
                  <p className="text-sm text-muted-foreground">Profile Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <School className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{userStats?.sertifikasi_count || 0}</div>
                  <p className="text-sm text-muted-foreground">Sertifikasi</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{userStats?.pkl_count || 0}</div>
                  <p className="text-sm text-muted-foreground">PKL</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{userStats?.activities_count || 0}</div>
                  <p className="text-sm text-muted-foreground">Activities</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{userStats?.documents_count || 0}</div>
                  <p className="text-sm text-muted-foreground">Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informasi Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Username</label>
                  <p className="text-sm font-medium">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nama Lengkap</label>
                  <p className="text-sm font-medium">{user.full_name || '-'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">No. Telepon</label>
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {user.phone || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Jenis Kelamin</label>
                  <p className="text-sm font-medium">
                    {(() => {
                      console.log('Gender value:', user.gender, 'Type:', typeof user.gender);
                      if (user.gender === 'L') return 'Laki-laki';
                      if (user.gender === 'P') return 'Perempuan';
                      if (user.gender === 'Laki-laki') return 'Laki-laki';
                      if (user.gender === 'Perempuan') return 'Perempuan';
                      return user.gender || '-';
                    })()}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tempat Lahir</label>
                  <p className="text-sm font-medium">{user.place_of_birth || user.birth_place || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tanggal Lahir</label>
                  <p className="text-sm font-medium">
                    {(() => {
                      const dateValue = user.date_of_birth || user.birth_date;
                      return dateValue ? new Date(dateValue).toLocaleDateString('id-ID') : '-';
                    })()}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Alamat</label>
                <p className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {user.address || '-'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Informasi Akun
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipe User</label>
                  <div>{getUserTypeBadge(user.user_type)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div>{getStatusBadge(user.account_status, user.is_active)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Role</label>
                  <p className="text-sm font-medium capitalize">{user.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User Aktif</label>
                  <p className="text-sm font-medium flex items-center gap-2">
                    {user.is_active ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Ya
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-600" />
                        Tidak
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Terdaftar</label>
                  <p className="text-sm font-medium">
                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Update Terakhir</label>
                  <p className="text-sm font-medium">
                    {new Date(user.updated_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Education Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                Informasi Pendidikan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Sekolah/Universitas</label>
                <p className="text-sm font-medium">{user.school_university || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Jurusan/Konsentrasi</label>
                <p className="text-sm font-medium">{user.major_concentration || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Kelas/Semester</label>
                <p className="text-sm font-medium">{user.class_semester || '-'}</p>
              </div>
            </CardContent>
          </Card>

          {/* PKL Specific Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informasi PKL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Transportasi</label>
                  <p className="text-sm font-medium capitalize">{user.transportation || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bidang Minat</label>
                  <p className="text-sm font-medium capitalize">{user.preferred_field || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipe Bidang</label>
                  <p className="text-sm font-medium capitalize">{user.preferred_field_type || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Motivasi (1-10)</label>
                  <p className="text-sm font-medium">{user.motivation_level || '-'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Self Rating</label>
                <p className="text-sm font-medium">{user.self_rating || '-'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Equipment & Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Laptop className="h-5 w-5" />
              Equipment & Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Laptop className="h-4 w-4" />
                <span className="text-sm">Laptop:</span>
                {user.has_laptop ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span className="text-sm">DSLR:</span>
                {user.has_dslr ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span className="text-sm">Video Review:</span>
                {user.has_video_review_experience ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="text-sm">Content Creation:</span>
                {user.interested_in_content_creation ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media & Contact */}
        {(user.instagram_handle || user.tiktok_handle) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Media
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {user.instagram_handle && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Instagram</label>
                    <p className="text-sm font-medium">@{user.instagram_handle}</p>
                  </div>
                )}
                {user.tiktok_handle && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">TikTok</label>
                    <p className="text-sm font-medium">@{user.tiktok_handle}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activities */}
        {user.activities && user.activities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Aktivitas Terkini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.activity_type}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registrations */}
        {((user.pendaftaranSertifikasi && user.pendaftaranSertifikasi.length > 0) || 
          (user.pendaftaranPKL && user.pendaftaranPKL.length > 0)) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sertifikasi */}
            {user.pendaftaranSertifikasi && user.pendaftaranSertifikasi.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5" />
                    Pendaftaran Sertifikasi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sertifikasi</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.pendaftaranSertifikasi.map((sertifikasi) => (
                        <TableRow key={sertifikasi.id}>
                          <TableCell className="font-medium">
                            {sertifikasi.sertifikasi?.nama || '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{sertifikasi.status}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(sertifikasi.created_at).toLocaleDateString('id-ID')}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {sertifikasi.status === 'Disetujui' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => router.get(route('admin.batch-penilaian-sertifikasi', {
                                      sertifikasiId: sertifikasi.sertifikasi?.id,
                                      batchId: sertifikasi.batch?.id
                                    }))}
                                  >
                                    <School className="h-4 w-4 mr-1" />
                                    Batch
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => router.get(route('admin.detail-penilaian-sertifikasi', sertifikasi.id))}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Penilaian
                                  </Button>
                                </>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.get(route('admin.pendaftaran.detail', ['sertifikasi', sertifikasi.id]))}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Detail
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* PKL */}
            {user.pendaftaranPKL && user.pendaftaranPKL.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Pendaftaran PKL
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Posisi</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.pendaftaranPKL.map((pkl) => (
                        <TableRow key={pkl.id}>
                          <TableCell className="font-medium">
                            {pkl.posisiPKL?.nama_posisi || '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{pkl.status}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(pkl.created_at).toLocaleDateString('id-ID')}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {pkl.status === 'Disetujui' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => router.get(route('admin.detail-penilaian-pkl', pkl.id))}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Penilaian
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.get(route('admin.pendaftaran.detail', ['pkl', pkl.id]))}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Detail
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default UserDetailPage;
