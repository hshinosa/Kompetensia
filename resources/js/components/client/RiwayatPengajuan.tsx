import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface PengajuanItem {
    id: number;
    tanggal: string;
    jenis_pengajuan: string;
    nama: string;
    status: string;
}

interface RiwayatPengajuanProps {
    pengajuan: PengajuanItem[];
}

export default function RiwayatPengajuan({ pengajuan }: Readonly<RiwayatPengajuanProps>) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'disetujui':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'sedang diverifikasi':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'ditolak':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'disetujui':
                return <CheckCircle className="h-4 w-4" />;
            case 'sedang diverifikasi':
                return <Clock className="h-4 w-4" />;
            case 'ditolak':
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    return (
        <Card className="rounded-xl shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Riwayat Pengajuan
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {pengajuan.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>Belum ada riwayat pengajuan</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">No</th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Tanggal</th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Jenis Pengajuan</th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Nama</th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pengajuan.map((item, index) => (
                                        <tr key={item.id} className="border-b border-gray-100 :bg-gray-50 transition-colorshover">
                                            <td className="py-3 px-2 text-sm">{index + 1}</td>
                                            <td className="py-3 px-2 text-sm text-gray-600">{item.tanggal}</td>
                                            <td className="py-3 px-2 text-sm font-medium">{item.jenis_pengajuan}</td>
                                            <td className="py-3 px-2 text-sm">{item.nama}</td>
                                            <td className="py-3 px-2">
                                                <Badge className={`rounded-full border ${getStatusColor(item.status)} flex items-center gap-1 w-fit`}>
                                                    {getStatusIcon(item.status)}
                                                    <span className="text-xs">{item.status}</span>
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
