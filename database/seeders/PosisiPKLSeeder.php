<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Carbon;
use App\Models\User;

class PosisiPKLSeeder extends Seeder
{
    public function run(): void
    {
        if (!$this->shouldSeed()) {
            return;
        }
        $adminId = User::where('role','admin')->value('id') ?? 1;
        $today = now();
    DB::table('posisi_pkl')->insert($this->records($today, $adminId));
    }

    protected function shouldSeed(): bool
    {
        return Schema::hasTable('posisi_pkl') && DB::table('posisi_pkl')->count() === 0;
    }

    protected function records($today, int $adminId): array
    {
        return [
            $this->row('UI/UX Designer','Creative Labs','Kreatif','Merancang antarmuka dan pengalaman pengguna yang intuitif untuk aplikasi web & mobile.',"Mahasiswa/fresh graduate Design atau Informatika\nPortfolio design kuat\nMenguasai Figma / Adobe XD\nPemahaman dasar HTML/CSS\nKomunikasi baik",'Hybrid','Hybrid',3,null,3,'Aktif',$today->copy()->addDays(7),$today->copy()->addDays(97),'Andi','andi@creativelabs.test','0800000001',$adminId),
            $this->row('Backend Developer','Tech Core','Developer','Mengembangkan API dan layanan backend untuk aplikasi internal.',"Mahasiswa/fresh graduate Informatika\nMenguasai salah satu bahasa backend (PHP/Node/Python)\nPemahaman database SQL\nFamiliar RESTful API\nPengalaman Git",'Hybrid','Hybrid',4,null,2,'Aktif',$today->copy()->addDays(10),$today->copy()->addDays(130),'Budi','budi@techcore.test','0800000002',$adminId),
            $this->row('Frontend Developer','Tech Core','Developer','Membangun antarmuka pengguna reaktif menggunakan React.',"HTML, CSS, JavaScript kuat\nPengalaman React\nResponsive design\nFamiliar build tools\nGit workflow",'Hybrid','Hybrid',4,null,4,'Penuh',$today->copy()->addDays(14),$today->copy()->addDays(134),'Budi','budi@techcore.test','0800000002',$adminId),
            $this->row('Fullstack Developer','Innovation Hub','Developer','Mengembangkan aplikasi end-to-end (frontend & backend).',"Frontend & backend basics\nPengalaman framework full-stack\nSoftware architecture dasar\nProblem solving\nGit",'Remote','Remote',5,null,0,'Aktif',$today->copy()->addDays(21),$today->copy()->addDays(171),'Citra','citra@innovationhub.test','0800000003',$adminId),
            $this->row('Mobile App Developer','App Factory','Developer','Mengembangkan aplikasi mobile cross-platform.',"React Native / Flutter\nPemahaman arsitektur mobile\nDeployment store dasar\nMobile UI/UX dasar\nGit",'Onsite','Full-time',4,null,1,'Aktif',$today->copy()->addDays(18),$today->copy()->addDays(138),'Doni','doni@appfactory.test','0800000004',$adminId),
            $this->row('DevOps Engineer','Cloud Systems','Developer','Mengelola infrastruktur cloud & pipeline CI/CD.',"Linux dasar\nDocker & containerization\nCloud platform dasar\nScripting (Bash/Python)\nAutomation mindset",'Hybrid','Hybrid',4,null,2,'Aktif',$today->copy()->addDays(25),$today->copy()->addDays(145),'Eka','eka@cloudsystems.test','0800000005',$adminId),
            $this->row('Content Creator','MediaWorks','Marketing','Membuat konten kreatif multi-platform (blog, sosial media, website).',"Komunikasi & storytelling\nPortfolio konten\nTrend social media\nKreativitas tinggi\nBasic copywriting",'Hybrid','Hybrid',3,null,3,'Aktif',$today->copy()->addDays(12),$today->copy()->addDays(102),'Fajar','fajar@mediaworks.test','0800000006',$adminId),
            $this->row('Video Editor','MediaWorks','Kreatif','Mengedit dan memproduksi video untuk marketing & edukasi.',"Software editing (Premiere/DaVinci)\nColor grading dasar\nAudio mixing dasar\nPortfolio editing\nKreativitas visual",'Remote','Part-time',3,null,2,'Aktif',$today->copy()->addDays(9),$today->copy()->addDays(99),'Gita','gita@mediaworks.test','0800000007',$adminId),
            $this->row('Graphic Designer','DesignForge','Kreatif','Mendesain materi branding & marketing visual.',"Adobe Creative Suite\nBrand identity & typography\nPortfolio desain kuat\nDetail oriented\nKreatif",'Hybrid','Hybrid',3,null,1,'Aktif',$today->copy()->addDays(11),$today->copy()->addDays(101),'Hana','hana@designforge.test','0800000008',$adminId),
            $this->row('Social Media Specialist','BuzzReach','Marketing','Mengelola strategi & konten sosial media perusahaan.',"Platform social media mendalam\nAnalisis data dasar\nContent planning kreatif\nBasic ads knowledge\nCopywriting",'Remote','Part-time',3,null,0,'Non-Aktif',$today->copy()->addDays(16),$today->copy()->addDays(106),'Iwan','iwan@buzzreach.test','0800000009',$adminId),
            $this->row('Data Analyst Intern','InsightWorks','Data Analyst','Mengumpulkan, membersihkan, dan menganalisis data untuk mendukung keputusan bisnis.',"SQL dasar\nExcel / Spreadsheet advanced\nStatistik dasar\nVisualisasi data (Tableau/PowerBI)\nLogika analitis",'Hybrid','Hybrid',3,null,0,'Aktif',$today->copy()->addDays(13),$today->copy()->addDays(103),'Joko','joko@insightworks.test','0800000010',$adminId),
            $this->row('Quality Assurance Intern','QualityPlus','Quality Assurance','Menguji aplikasi dan memastikan kualitas sebelum rilis.',"Pemahaman SDLC\nTesting manual dasar\nMenulis test case\nBug reporting jelas\nDetail oriented",'Hybrid','Hybrid',3,null,0,'Aktif',$today->copy()->addDays(17),$today->copy()->addDays(107),'Kiki','kiki@qualityplus.test','0800000011',$adminId),
        ];
    }

    protected function row(
        string $nama,
        string $perusahaan,
        string $kategori,
        string $deskripsi,
        string $persyaratan,
        string $lokasi,
        string $tipe,
        int $durasi,
        $gaji,
        int $jumlah,
        string $status,
        $mulai,
        $selesai,
        string $cp,
        string $email,
        string $phone,
        int $createdBy
    ): array {
        return [
            'nama_posisi' => $nama,
            'perusahaan' => $perusahaan,
            'kategori' => $kategori,
            'deskripsi' => $deskripsi,
            'persyaratan' => $persyaratan,
            'lokasi' => $lokasi,
            'tipe' => $tipe,
            'durasi_bulan' => $durasi,
            'gaji' => $gaji,
            'jumlah_pendaftar' => $jumlah,
            'status' => $status,
            'tanggal_mulai' => $mulai,
            'tanggal_selesai' => $selesai,
            'contact_person' => $cp,
            'contact_email' => $email,
            'contact_phone' => $phone,
            'created_by' => $createdBy,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
