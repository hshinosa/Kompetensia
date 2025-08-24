import React from 'react';
import { router, Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Pagination from '@/components/Pagination';
import { Users, UserCheck, UserX, Shield, Clock, Filter, Plus, Eye, Edit, Trash2, ToggleLeft, ToggleRight, MoreHorizontal } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import ConfirmationModal from '@/components/ConfirmationModal';

interface UserActivity {
  id: number;
  activity_type: string;
  description: string;
  created_at: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  gender?: string;
  user_type: string;
  role: string;
  account_status: string;
  is_active: boolean;
  school_university?: string;
  major_concentration?: string;
  created_at: string;
  activities?: UserActivity[];
  pendaftaran_sertifikasi_count?: number;
  pendaftaran_p_k_l_count?: number;
  activities_count?: number;
}

interface PaginationMeta {
  per_page: number;
  current_page: number;
  last_page: number;
  total: number;
}

interface Filters {
  search?: string;
  user_type?: string;
  account_status?: string;
  per_page?: number;
}

interface Stats {
  total_users: number;
  active_users: number;
  students: number;
  admins: number;
  pending_users: number;
}

interface PageProps {
  users?: {
    data: UserData[];
    meta: PaginationMeta;
  };
  filters?: Filters;
  stats?: Stats;
  [key: string]: any;
}

const UserManagementPage: React.FC = () => {
  const { props } = usePage<PageProps>();
  const { users, filters, stats } = props;
  
  // Safe defaults for users data
  const userData = users?.data || [];
  const userMeta = users?.meta || {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  };
  
  const [search, setSearch] = React.useState(filters?.search || '');
  const [userType, setUserType] = React.useState<string>(filters?.user_type || '');
  const [accountStatus, setAccountStatus] = React.useState<string>(filters?.account_status || '');
  const [perPage, setPerPage] = React.useState(filters?.per_page || 10);

  // Modal states
  const [toggleModal, setToggleModal] = React.useState<{
    isOpen: boolean;
    user: UserData | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    user: null,
    isLoading: false
  });

  const [deleteModal, setDeleteModal] = React.useState<{
    isOpen: boolean;
    user: UserData | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    user: null,
    isLoading: false
  });

  const firstLoad = React.useRef(true);

  // Debounce search & filter changes
  React.useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    const timer = setTimeout(() => {
      router.get(route('admin.user-management'), {
        search,
        user_type: userType,
        account_status: accountStatus,
        per_page: perPage,
        page: 1
      }, {
        preserveState: true,
        replace: true
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [search, userType, accountStatus, perPage]);

  const changePage = (page: number) => {
    router.get(route('admin.user-management'), {
      search,
      user_type: userType,
      account_status: accountStatus,
      per_page: perPage,
      page
    }, {
      preserveState: true,
      replace: true
    });
  };

  const handleDeleteUser = (user: UserData) => {
    setDeleteModal({
      isOpen: true,
      user,
      isLoading: false
    });
  };

  const confirmDeleteUser = () => {
    if (!deleteModal.user) return;
    
    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    
    router.delete(route('admin.users.destroy', deleteModal.user.id), {
      onSuccess: () => {
        setDeleteModal({
          isOpen: false,
          user: null,
          isLoading: false
        });
      },
      onError: () => {
        setDeleteModal(prev => ({ ...prev, isLoading: false }));
      }
    });
  };

  const handleToggleStatus = (user: UserData) => {
    setToggleModal({
      isOpen: true,
      user,
      isLoading: false
    });
  };

  const confirmToggleStatus = () => {
    if (!toggleModal.user) return;
    
    setToggleModal(prev => ({ ...prev, isLoading: true }));
    
    router.patch(route('admin.users.toggle-status', toggleModal.user.id), {}, {
      onSuccess: () => {
        setToggleModal({
          isOpen: false,
          user: null,
          isLoading: false
        });
      },
      onError: () => {
        setToggleModal(prev => ({ ...prev, isLoading: false }));
      }
    });
  };

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
    { title: 'Manajemen User', href: '/admin/user-management' }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manajemen User" />
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manajemen User</h1>
            <p className="text-muted-foreground">Kelola akun pengguna sistem</p>
          </div>
          <Button onClick={() => router.get(route('admin.users.create'))}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah User
          </Button>
        </div>

        {/* Stats */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-5">
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
                  <p className="text-sm text-muted-foreground">Total User</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats?.active_users || 0}</div>
                  <p className="text-sm text-muted-foreground">User Aktif</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserX className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats?.students || 0}</div>
                  <p className="text-sm text-muted-foreground">Student</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats?.admins || 0}</div>
                  <p className="text-sm text-muted-foreground">Admin</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats?.pending_users || 0}</div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <CardTitle>Daftar User</CardTitle>
              <div className="flex gap-2 items-center flex-wrap">
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  placeholder="Cari nama, email, sekolah..."
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="relative">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                      {(userType || accountStatus) && (
                        <Badge variant="destructive" className="ml-2 px-1.5 py-0 text-xs h-5 min-w-5">
                          {[userType, accountStatus].filter(Boolean).length}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Tipe User</DropdownMenuLabel>
                    {['student', 'instructor', 'assessor', 'admin'].map(type => (
                      <DropdownMenuItem
                        key={type}
                        onClick={() => setUserType(prev => prev === type ? '' : type)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <span className="capitalize">{type}</span>
                        {userType === type && <div className="w-2 h-2 bg-primary rounded-full" />}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Status Akun</DropdownMenuLabel>
                    {['active', 'pending', 'suspended', 'banned'].map(status => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => setAccountStatus(prev => prev === status ? '' : status)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <span className="capitalize">{status}</span>
                        {accountStatus === status && <div className="w-2 h-2 bg-primary rounded-full" />}
                      </DropdownMenuItem>
                    ))}
                    {(userType || accountStatus) && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setUserType('');
                            setAccountStatus('');
                          }}
                          className="text-destructive cursor-pointer"
                        >
                          Reset Filter
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aktivitas</TableHead>
                  <TableHead>Terdaftar</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userData?.length ? userData.map((user, idx) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {(userMeta.current_page - 1) * userMeta.per_page + idx + 1}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.full_name || user.name}</div>
                        {user.school_university && (
                          <div className="text-sm text-muted-foreground">{user.school_university}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getUserTypeBadge(user.user_type)}</TableCell>
                    <TableCell>{getStatusBadge(user.account_status, user.is_active)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-2">
                          <span>Sertifikasi: {user.pendaftaran_sertifikasi_count || 0}</span>
                          {(user.pendaftaran_sertifikasi_count && user.pendaftaran_sertifikasi_count > 0) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.get(route('admin.penilaian-sertifikasi'))}
                              className="h-6 px-2 text-xs"
                            >
                              Lihat
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span>PKL: {user.pendaftaran_p_k_l_count || 0}</span>
                          {(user.pendaftaran_p_k_l_count && user.pendaftaran_p_k_l_count > 0) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.get(route('admin.penilaian-pkl'))}
                              className="h-6 px-2 text-xs"
                            >
                              Lihat
                            </Button>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.get(route('admin.users.show', user.id))}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.get(route('admin.users.edit', user.id))}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                            {user.is_active ? (
                              <>
                                <ToggleLeft className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <ToggleRight className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {search || userType || accountStatus ? 'Tidak ada data sesuai filter' : 'Tidak ada data user'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          {userData?.length > 0 && (
            <div className="px-4 pb-4">
              <Pagination
                currentPage={userMeta.current_page}
                totalPages={userMeta.last_page}
                itemsPerPage={userMeta.per_page}
                totalItems={userMeta.total}
                onPageChange={changePage}
                onItemsPerPageChange={(n) => setPerPage(n)}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Toggle Status Modal */}
      <ConfirmationModal
        isOpen={toggleModal.isOpen}
        onClose={() => setToggleModal({ isOpen: false, user: null, isLoading: false })}
        onConfirm={confirmToggleStatus}
        title={toggleModal.user?.is_active ? 'Nonaktifkan User' : 'Aktifkan User'}
        description={
          toggleModal.user?.is_active 
            ? `Apakah Anda yakin ingin menonaktifkan user "${toggleModal.user?.name}"? User tidak akan bisa mengakses sistem.`
            : `Apakah Anda yakin ingin mengaktifkan user "${toggleModal.user?.name}"? User akan bisa mengakses sistem kembali.`
        }
        confirmText={toggleModal.user?.is_active ? 'Nonaktifkan' : 'Aktifkan'}
        variant={toggleModal.user?.is_active ? 'destructive' : 'default'}
        isLoading={toggleModal.isLoading}
      />

      {/* Delete User Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null, isLoading: false })}
        onConfirm={confirmDeleteUser}
        title="Hapus User"
        description={`Apakah Anda yakin ingin menghapus user "${deleteModal.user?.name}"? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait user tersebut.`}
        confirmText="Hapus"
        variant="destructive"
        isLoading={deleteModal.isLoading}
      />
    </AppLayout>
  );
};

export default UserManagementPage;
