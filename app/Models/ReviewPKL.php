<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReviewPKL extends Model
{
    use HasFactory;

    protected $table = 'review_pkl';

    protected $fillable = [
        'user_id',
        'posisi_pkl_id',
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
     * Get the PKL position that this review belongs to.
     */
    public function posisiPKL(): BelongsTo
    {
        return $this->belongsTo(PosisiPKL::class, 'posisi_pkl_id');
    }
}
