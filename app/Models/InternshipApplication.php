<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class InternshipApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'position_id',
        'application_number',
        'status',
        'motivation_letter',
        'expectations',
        'attachments',
        'applied_at',
        'reviewed_at',
        'reviewed_by',
        'review_notes',
        'accepted_at',
        'rejected_at',
        'rejection_reason',
        'internship_start_date',
        'internship_end_date'
    ];

    protected $casts = [
        'attachments' => 'array',
        'applied_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'accepted_at' => 'datetime',
        'rejected_at' => 'datetime',
        'internship_start_date' => 'date',
        'internship_end_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function position()
    {
        return $this->belongsTo(PosisiPKL::class, 'position_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function evaluations()
    {
        return $this->hasMany(InternshipEvaluation::class, 'application_id');
    }

    // Scopes
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByPosition($query, $positionId)
    {
        return $query->where('position_id', $positionId);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    // Boot method for auto-generating application number
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->application_number)) {
                $model->application_number = self::generateApplicationNumber();
            }
            
            if (empty($model->applied_at)) {
                $model->applied_at = now();
            }
        });
    }

    // Methods
    public static function generateApplicationNumber()
    {
        $prefix = 'PKL-' . date('Y');
        $lastNumber = self::where('application_number', 'like', $prefix . '%')
                         ->orderBy('application_number', 'desc')
                         ->first();
        
        if ($lastNumber) {
            $lastNum = (int) substr($lastNumber->application_number, -4);
            $nextNum = $lastNum + 1;
        } else {
            $nextNum = 1;
        }
        
        return $prefix . '-' . str_pad($nextNum, 4, '0', STR_PAD_LEFT);
    }

    public function accept($reviewerId, $notes = null, $startDate = null, $endDate = null)
    {
        return $this->update([
            'status' => 'accepted',
            'reviewed_by' => $reviewerId,
            'reviewed_at' => now(),
            'accepted_at' => now(),
            'review_notes' => $notes,
            'internship_start_date' => $startDate,
            'internship_end_date' => $endDate
        ]);
    }

    public function reject($reviewerId, $reason)
    {
        return $this->update([
            'status' => 'rejected',
            'reviewed_by' => $reviewerId,
            'reviewed_at' => now(),
            'rejected_at' => now(),
            'rejection_reason' => $reason
        ]);
    }

    public function cancel()
    {
        return $this->update([
            'status' => 'cancelled'
        ]);
    }

    public function getDurationInWeeksAttribute()
    {
        if ($this->internship_start_date && $this->internship_end_date) {
            return $this->internship_start_date->diffInWeeks($this->internship_end_date);
        }
        return null;
    }
}
