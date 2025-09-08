import { Card, CardContent } from '@/components/ui/card';
import { Award, BookOpen, Users, TrendingUp } from 'lucide-react';

interface StatsData {
    sertifikasi_selesai: number;
    program_aktif: number;
    pengajuan_diproses: number;
    total_program: number;
}

interface StatsOverviewProps {
    stats: StatsData;
}

export default function StatsOverview({ stats }: Readonly<StatsOverviewProps>) {
    const statsCards = [
        {
            id: 'sertifikasi-selesai',
            title: 'Sertifikasi Selesai',
            value: stats.sertifikasi_selesai,
            icon: Award,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        {
            id: 'program-aktif',
            title: 'Program Aktif',
            value: stats.program_aktif,
            icon: BookOpen,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            id: 'pengajuan-diproses',
            title: 'Pengajuan Diproses',
            value: stats.pengajuan_diproses,
            icon: Users,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200'
        },
        {
            id: 'total-program',
            title: 'Total Program',
            value: stats.total_program,
            icon: TrendingUp,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat) => {
                const IconComponent = stat.icon;
                return (
                    <Card key={stat.id} className={`rounded-xl border-2 ${stat.borderColor} ${stat.bgColor} hover:shadow-lg transition-shadow`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                        {stat.title}
                                    </p>
                                    <p className={`text-3xl font-bold ${stat.color}`}>
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
