<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\SertifikasiRepositoryInterface;
use App\Repositories\SertifikasiRepository;
use App\Repositories\Contracts\BlogRepositoryInterface;
use App\Repositories\BlogRepository;
use App\Repositories\Contracts\VideoRepositoryInterface;
use App\Repositories\VideoRepository;
use App\Repositories\Contracts\PKLRepositoryInterface;
use App\Repositories\PKLRepository;
use App\Repositories\Contracts\PenilaianSertifikasiRepositoryInterface;
use App\Repositories\PenilaianSertifikasiRepository;
use App\Repositories\Contracts\PendaftaranSertifikasiRepositoryInterface;
use App\Repositories\PendaftaranSertifikasiRepository;
use App\Repositories\Contracts\PendaftaranPKLRepositoryInterface;
use App\Repositories\PendaftaranPKLRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(SertifikasiRepositoryInterface::class, SertifikasiRepository::class);
        $this->app->bind(BlogRepositoryInterface::class, BlogRepository::class);
        $this->app->bind(VideoRepositoryInterface::class, VideoRepository::class);
        $this->app->bind(PKLRepositoryInterface::class, PKLRepository::class);
        $this->app->bind(PenilaianSertifikasiRepositoryInterface::class, PenilaianSertifikasiRepository::class);
        $this->app->bind(PendaftaranSertifikasiRepositoryInterface::class, PendaftaranSertifikasiRepository::class);
        $this->app->bind(PendaftaranPKLRepositoryInterface::class, PendaftaranPKLRepository::class);
    }

    public function boot(): void
    {
    // Intentionally left empty: currently no boot-time actions needed for repository bindings.
    }
}
