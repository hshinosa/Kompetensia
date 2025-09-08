<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class UserDocument extends Model
{
    use HasFactory;

    protected $table = 'dokumen_pengguna';

    protected $fillable = [
        'user_id',
        'jenis_dokumen',
        'nama_dokumen',
        'path_file',
        'ukuran_file',
        'tipe_mime',
        'terverifikasi',
        'aktif',
        'catatan',
        'verified_at',
        'verified_by'
    ];

    protected $casts = [
        'terverifikasi' => 'boolean',
        'aktif' => 'boolean',
        'verified_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    // Scopes
    public function scopeByType($query, $type)
    {
        return $query->where('jenis_dokumen', $type);
    }

    public function scopeVerified($query)
    {
        return $query->where('terverifikasi', true);
    }

    public function scopeActive($query)
    {
        return $query->where('aktif', true);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // Accessors
    public function getFileUrlAttribute()
    {
        return $this->path_file ? Storage::url($this->path_file) : null;
    }

    public function getFileSizeHumanAttribute()
    {
        $size = $this->ukuran_file;
        if (!$size) {
            return 'Unknown';
        }
        
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $size > 1024 && $i < count($units) - 1; $i++) {
            $size /= 1024;
        }
        
        return round($size, 2) . ' ' . $units[$i];
    }

    // Methods
    public function verify($verifierId, $notes = null)
    {
        return $this->update([
            'terverifikasi' => true,
            'verified_by' => $verifierId,
            'verified_at' => now(),
            'catatan' => $notes
        ]);
    }

    public function reject($verifierId, $notes)
    {
        return $this->update([
            'terverifikasi' => false,
            'verified_by' => $verifierId,
            'verified_at' => now(),
            'catatan' => $notes
        ]);
    }

    public function delete()
    {
        // Delete physical file
        if ($this->path_file && Storage::exists($this->path_file)) {
            Storage::delete($this->path_file);
        }
        
        return parent::delete();
    }
}
