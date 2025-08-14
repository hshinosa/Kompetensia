import React from 'react';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, User, School, Building2, Globe, Settings, CheckCircle, Laptop, Camera, Video, Heart } from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  gender?: string;
  place_of_birth?: string;
  date_of_birth?: string;
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
}

interface PageProps {
  user: UserData;
  [key: string]: any;
}

const UserEditPage: React.FC = () => {
  const { props } = usePage<PageProps>();
  const { user } = props;

  const { data, setData, put, processing, errors } = useForm({
    name: user.name || '',
    email: user.email || '',
    full_name: user.full_name || '',
    phone_number: user.phone_number || '',
    gender: user.gender || 'none',
    place_of_birth: user.place_of_birth || '',
    date_of_birth: user.date_of_birth || '',
    address: user.address || '',
    user_type: user.user_type || 'student',
    role: user.role || 'user',
    account_status: user.account_status || 'active',
    is_active: user.is_active ?? true,
    school_university: user.school_university || '',
    major_concentration: user.major_concentration || '',
    class_semester: user.class_semester || '',
    instagram_handle: user.instagram_handle || '',
    tiktok_handle: user.tiktok_handle || '',
    transportation: user.transportation || 'none',
    preferred_field: user.preferred_field || 'none',
    preferred_field_type: user.preferred_field_type || 'none',
    motivation_level: user.motivation_level || 5,
    self_rating: user.self_rating || '',
    has_laptop: user.has_laptop ?? false,
    has_dslr: user.has_dslr ?? false,
    has_video_review_experience: user.has_video_review_experience ?? false,
    interested_in_content_creation: user.interested_in_content_creation ?? false,
    has_viewed_company_profile: user.has_viewed_company_profile ?? false,
    is_smoker: user.is_smoker ?? false,
    agrees_to_school_return_if_violation: user.agrees_to_school_return_if_violation ?? false,
    agrees_to_return_if_absent_twice: user.agrees_to_return_if_absent_twice ?? false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert 'none' values back to empty strings before submission
    const formData = { ...data };
    if (formData.gender === 'none') formData.gender = '';
    if (formData.transportation === 'none') formData.transportation = '';
    if (formData.preferred_field === 'none') formData.preferred_field = '';
    if (formData.preferred_field_type === 'none') formData.preferred_field_type = '';
    
    router.put(route('admin.users.update', user.id), formData, {
      onSuccess: () => {
        router.visit(route('admin.users.show', user.id));
      },
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen User', href: '/admin/user-management' },
    { title: 'Detail User', href: route('admin.users.show', user.id) },
    { title: 'Edit User', href: '#' }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit User - ${user.full_name || user.name}`} />
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.get(route('admin.users.show', user.id))}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
              <p className="text-muted-foreground">{user.full_name || user.name}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                    <Label htmlFor="name">Username *</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="full_name">Nama Lengkap</Label>
                    <Input
                      id="full_name"
                      value={data.full_name}
                      onChange={(e) => setData('full_name', e.target.value)}
                      className={errors.full_name ? 'border-red-500' : ''}
                    />
                    {errors.full_name && <p className="text-sm text-red-500 mt-1">{errors.full_name}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone_number">No. Telepon</Label>
                    <Input
                      id="phone_number"
                      value={data.phone_number}
                      onChange={(e) => setData('phone_number', e.target.value)}
                      className={errors.phone_number ? 'border-red-500' : ''}
                    />
                    {errors.phone_number && <p className="text-sm text-red-500 mt-1">{errors.phone_number}</p>}
                  </div>
                  <div>
                    <Label htmlFor="gender">Jenis Kelamin</Label>
                    <Select value={data.gender} onValueChange={(value) => setData('gender', value === 'none' ? '' : value)}>
                      <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Tidak diisi</SelectItem>
                        <SelectItem value="L">Laki-laki</SelectItem>
                        <SelectItem value="P">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-sm text-red-500 mt-1">{errors.gender}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="place_of_birth">Tempat Lahir</Label>
                    <Input
                      id="place_of_birth"
                      value={data.place_of_birth}
                      onChange={(e) => setData('place_of_birth', e.target.value)}
                      className={errors.place_of_birth ? 'border-red-500' : ''}
                    />
                    {errors.place_of_birth && <p className="text-sm text-red-500 mt-1">{errors.place_of_birth}</p>}
                  </div>
                  <div>
                    <Label htmlFor="date_of_birth">Tanggal Lahir</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={data.date_of_birth}
                      onChange={(e) => setData('date_of_birth', e.target.value)}
                      className={errors.date_of_birth ? 'border-red-500' : ''}
                    />
                    {errors.date_of_birth && <p className="text-sm text-red-500 mt-1">{errors.date_of_birth}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Alamat</Label>
                  <Textarea
                    id="address"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    className={errors.address ? 'border-red-500' : ''}
                    rows={3}
                  />
                  {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Informasi Akun
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="user_type">Tipe User *</Label>
                    <Select value={data.user_type} onValueChange={(value) => setData('user_type', value)}>
                      <SelectTrigger className={errors.user_type ? 'border-red-500' : ''}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="instructor">Instructor</SelectItem>
                        <SelectItem value="assessor">Assessor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.user_type && <p className="text-sm text-red-500 mt-1">{errors.user_type}</p>}
                  </div>
                  <div>
                    <Label htmlFor="role">Role *</Label>
                    <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                      <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="account_status">Status Akun *</Label>
                  <Select value={data.account_status} onValueChange={(value) => setData('account_status', value)}>
                    <SelectTrigger className={errors.account_status ? 'border-red-500' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.account_status && <p className="text-sm text-red-500 mt-1">{errors.account_status}</p>}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={(checked: boolean) => setData('is_active', checked)}
                  />
                  <Label htmlFor="is_active">User Aktif</Label>
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
                  <Label htmlFor="school_university">Sekolah/Universitas</Label>
                  <Input
                    id="school_university"
                    value={data.school_university}
                    onChange={(e) => setData('school_university', e.target.value)}
                    className={errors.school_university ? 'border-red-500' : ''}
                  />
                  {errors.school_university && <p className="text-sm text-red-500 mt-1">{errors.school_university}</p>}
                </div>
                <div>
                  <Label htmlFor="major_concentration">Jurusan/Konsentrasi</Label>
                  <Input
                    id="major_concentration"
                    value={data.major_concentration}
                    onChange={(e) => setData('major_concentration', e.target.value)}
                    className={errors.major_concentration ? 'border-red-500' : ''}
                  />
                  {errors.major_concentration && <p className="text-sm text-red-500 mt-1">{errors.major_concentration}</p>}
                </div>
                <div>
                  <Label htmlFor="class_semester">Kelas/Semester</Label>
                  <Input
                    id="class_semester"
                    value={data.class_semester}
                    onChange={(e) => setData('class_semester', e.target.value)}
                    className={errors.class_semester ? 'border-red-500' : ''}
                  />
                  {errors.class_semester && <p className="text-sm text-red-500 mt-1">{errors.class_semester}</p>}
                </div>
              </CardContent>
            </Card>

            {/* PKL Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informasi PKL
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="transportation">Transportasi</Label>
                  <Select value={data.transportation} onValueChange={(value) => setData('transportation', value === 'none' ? '' : value)}>
                    <SelectTrigger className={errors.transportation ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Pilih transportasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak diisi</SelectItem>
                      <SelectItem value="punya">Punya</SelectItem>
                      <SelectItem value="tidak">Tidak Punya</SelectItem>
                      <SelectItem value="transportasi_umum">Transportasi Umum</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.transportation && <p className="text-sm text-red-500 mt-1">{errors.transportation}</p>}
                </div>
                <div>
                  <Label htmlFor="preferred_field">Bidang Minat</Label>
                  <Select value={data.preferred_field} onValueChange={(value) => setData('preferred_field', value === 'none' ? '' : value)}>
                    <SelectTrigger className={errors.preferred_field ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Pilih bidang minat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak diisi</SelectItem>
                      <SelectItem value="teknologi">Teknologi</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="desain">Desain</SelectItem>
                      <SelectItem value="bisnis">Bisnis</SelectItem>
                      <SelectItem value="pendidikan">Pendidikan</SelectItem>
                      <SelectItem value="kesehatan">Kesehatan</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="keuangan">Keuangan</SelectItem>
                      <SelectItem value="lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.preferred_field && <p className="text-sm text-red-500 mt-1">{errors.preferred_field}</p>}
                </div>
                <div>
                  <Label htmlFor="preferred_field_type">Tipe Bidang</Label>
                  <Select value={data.preferred_field_type} onValueChange={(value) => setData('preferred_field_type', value === 'none' ? '' : value)}>
                    <SelectTrigger className={errors.preferred_field_type ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Pilih tipe bidang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak diisi</SelectItem>
                      <SelectItem value="praktis">Praktis</SelectItem>
                      <SelectItem value="teoritis">Teoritis</SelectItem>
                      <SelectItem value="kreatif">Kreatif</SelectItem>
                      <SelectItem value="analitis">Analitis</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.preferred_field_type && <p className="text-sm text-red-500 mt-1">{errors.preferred_field_type}</p>}
                </div>
                <div>
                  <Label htmlFor="motivation_level">Level Motivasi (1-10)</Label>
                  <Input
                    id="motivation_level"
                    type="number"
                    min="1"
                    max="10"
                    value={data.motivation_level}
                    onChange={(e) => setData('motivation_level', parseInt(e.target.value) || 5)}
                    className={errors.motivation_level ? 'border-red-500' : ''}
                  />
                  {errors.motivation_level && <p className="text-sm text-red-500 mt-1">{errors.motivation_level}</p>}
                </div>
                <div>
                  <Label htmlFor="self_rating">Self Rating</Label>
                  <Input
                    id="self_rating"
                    value={data.self_rating}
                    onChange={(e) => setData('self_rating', e.target.value)}
                    className={errors.self_rating ? 'border-red-500' : ''}
                  />
                  {errors.self_rating && <p className="text-sm text-red-500 mt-1">{errors.self_rating}</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instagram_handle">Instagram Handle</Label>
                  <Input
                    id="instagram_handle"
                    value={data.instagram_handle}
                    onChange={(e) => setData('instagram_handle', e.target.value)}
                    placeholder="contoh: @username"
                    className={errors.instagram_handle ? 'border-red-500' : ''}
                  />
                  {errors.instagram_handle && <p className="text-sm text-red-500 mt-1">{errors.instagram_handle}</p>}
                </div>
                <div>
                  <Label htmlFor="tiktok_handle">TikTok Handle</Label>
                  <Input
                    id="tiktok_handle"
                    value={data.tiktok_handle}
                    onChange={(e) => setData('tiktok_handle', e.target.value)}
                    placeholder="contoh: @username"
                    className={errors.tiktok_handle ? 'border-red-500' : ''}
                  />
                  {errors.tiktok_handle && <p className="text-sm text-red-500 mt-1">{errors.tiktok_handle}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Equipment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Laptop className="h-5 w-5" />
                Skills & Equipment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_laptop"
                    checked={data.has_laptop}
                    onCheckedChange={(checked: boolean) => setData('has_laptop', checked)}
                  />
                  <Label htmlFor="has_laptop" className="flex items-center gap-2">
                    <Laptop className="h-4 w-4" />
                    Punya Laptop
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_dslr"
                    checked={data.has_dslr}
                    onCheckedChange={(checked: boolean) => setData('has_dslr', checked)}
                  />
                  <Label htmlFor="has_dslr" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Punya DSLR
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_video_review_experience"
                    checked={data.has_video_review_experience}
                    onCheckedChange={(checked: boolean) => setData('has_video_review_experience', checked)}
                  />
                  <Label htmlFor="has_video_review_experience" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Pengalaman Video Review
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="interested_in_content_creation"
                    checked={data.interested_in_content_creation}
                    onCheckedChange={(checked: boolean) => setData('interested_in_content_creation', checked)}
                  />
                  <Label htmlFor="interested_in_content_creation" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Minat Content Creation
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Informasi Tambahan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_viewed_company_profile"
                    checked={data.has_viewed_company_profile}
                    onCheckedChange={(checked: boolean) => setData('has_viewed_company_profile', checked)}
                  />
                  <Label htmlFor="has_viewed_company_profile">Sudah Lihat Profil Perusahaan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_smoker"
                    checked={data.is_smoker}
                    onCheckedChange={(checked: boolean) => setData('is_smoker', checked)}
                  />
                  <Label htmlFor="is_smoker">Perokok</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agrees_to_school_return_if_violation"
                    checked={data.agrees_to_school_return_if_violation}
                    onCheckedChange={(checked: boolean) => setData('agrees_to_school_return_if_violation', checked)}
                  />
                  <Label htmlFor="agrees_to_school_return_if_violation">Setuju Kembali ke Sekolah jika Melanggar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agrees_to_return_if_absent_twice"
                    checked={data.agrees_to_return_if_absent_twice}
                    onCheckedChange={(checked: boolean) => setData('agrees_to_return_if_absent_twice', checked)}
                  />
                  <Label htmlFor="agrees_to_return_if_absent_twice">Setuju Kembali jika Absen 2x</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.get(route('admin.users.show', user.id))}
            >
              Batal
            </Button>
            <Button type="submit" disabled={processing}>
              <Save className="h-4 w-4 mr-2" />
              {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default UserEditPage;
