import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { BookOpen, Calendar, Clock, ArrowRight, Plus } from 'lucide-react';

interface ProgramItem {
    id: number;
    nama: string;
    jenis: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status: string;
    deskripsi?: string;
}

interface ProgramSayaProps {
    programs: ProgramItem[];
}

export default function ProgramSaya({ programs }: Readonly<ProgramSayaProps>) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'aktif':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'selesai':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getJenisColor = (jenis: string) => {
        switch (jenis.toLowerCase()) {
            case 'sertifikasi kompetensi':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'praktik kerja lapangan':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        Program Saya
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild className="rounded-lg">
                            <Link href="/sertifikasi-kompetensi" className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Sertifikasi
                            </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild className="rounded-lg">
                            <Link href="/praktik-kerja-lapangan" className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                PKL
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {programs.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-sm mb-4">Belum ada program yang diikuti</p>
                            <div className="flex justify-center gap-2">
                                <Button size="sm" asChild className="rounded-lg">
                                    <Link href="/sertifikasi-kompetensi">
                                        Daftar Sertifikasi
                                    </Link>
                                </Button>
                                <Button size="sm" variant="outline" asChild className="rounded-lg">
                                    <Link href="/praktik-kerja-lapangan">
                                        Daftar PKL
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {programs.map((program) => (
                                <div key={program.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 mb-1">{program.nama}</h4>
                                            <p className="text-sm text-gray-600 mb-2">{program.deskripsi || 'Tidak ada deskripsi'}</p>
                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{program.tanggal_mulai}</span>
                                                </div>
                                                <span>-</span>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{program.tanggal_selesai}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 items-end">
                                            <Badge className={`rounded-full border ${getJenisColor(program.jenis)}`}>
                                                {program.jenis}
                                            </Badge>
                                            <Badge className={`rounded-full border ${getStatusColor(program.status)}`}>
                                                {program.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button size="sm" variant="ghost" asChild className="rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                            <Link href={`/program/${program.id}`} className="flex items-center gap-1">
                                                Detail
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
