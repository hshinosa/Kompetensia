<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserActivity extends Model
{
    use HasFactory;

    protected $table = 'aktivitas_pengguna';

    protected $fillable = [
        'user_id',
        'jenis_aktivitas',
        'deskripsi',
        'metadata',
        'alamat_ip',
        'user_agent'
    ];

    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeByType($query, $type)
    {
        return $query->where('jenis_aktivitas', $type);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    // Methods
    public static function catat($userId, $type, $description, $metadata = null, $ipAddress = null, $userAgent = null)
    {
        return self::create([
            'user_id' => $userId,
            'jenis_aktivitas' => $type,
            'deskripsi' => $description,
            'metadata' => $metadata,
            'alamat_ip' => $ipAddress,
            'user_agent' => $userAgent
        ]);
    }

    // Legacy method for backward compatibility
    public static function log($userId, $type, $description, $metadata = null, $ipAddress = null, $userAgent = null)
    {
        return self::catat($userId, $type, $description, $metadata, $ipAddress, $userAgent);
    }
}
