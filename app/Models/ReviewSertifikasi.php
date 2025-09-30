<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReviewSertifikasi extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'sertifikasi_id',
        'rating',
        'review'
    ];

    protected $casts = [
        'rating' => 'integer'
    ];

    /**
     * Get the user that owns the review.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the sertifikasi that this review belongs to.
     */
    public function sertifikasi(): BelongsTo
    {
        return $this->belongsTo(Sertifikasi::class);
    }
}
