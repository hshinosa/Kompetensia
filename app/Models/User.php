<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        // Basic user fields
        'name',
        'email',
        'password',
        'full_name',
        
        // Contact & personal info (sesuai migrasi)
        'phone', // dari migrasi 2025_08_09 dan 2025_08_14
        'address',
        'gender',
        'place_of_birth',
        'date_of_birth',
        
        // Legacy fields (masih ada di migrasi lama)
        'birth_date',
        'birth_place',
        'institution',
        'major',
        'semester',
        'role',
        'avatar',
        
        // Education (dari PKL migration)
        'school_university',
        'major_concentration',
        'class_semester',
        
        // Social Media
        'instagram_handle',
        'tiktok_handle',
        
        // Equipment & Skills
        'has_laptop',
        'has_dslr',
        'has_video_review_experience',
        'interested_in_content_creation',
        'transportation',
        
        // Skills & Experience
        'skills_to_improve',
        'skills_to_contribute',
        
        // Preferences & Goals
        'preferred_field',
        'preferred_field_type',
        'motivation_level',
        'self_rating',
        
        // Compliance & Agreement
        'is_smoker',
        'agrees_to_school_return_if_violation',
        'agrees_to_return_if_absent_twice',
        
        // Internship Period
        'internship_start_period',
        'internship_end_period',
        
        // Documents
        'cv_path',
        'portfolio_path',
        
        // System fields
        'is_active',
        'last_login_at',
        'last_login_ip',
        'account_status',
        'user_type',
        'profile_completion_percentage',
        'has_viewed_company_profile'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'birth_date' => 'date',
            'date_of_birth' => 'date',
            'semester' => 'integer',
            'gpa' => 'decimal:2',
            'internship_start_period' => 'date',
            'internship_end_period' => 'date',
            'last_login_at' => 'datetime',
            'has_laptop' => 'boolean',
            'has_dslr' => 'boolean',
            'has_video_review_experience' => 'boolean',
            'interested_in_content_creation' => 'boolean',
            'has_viewed_company_profile' => 'boolean',
            'motivation_level' => 'integer',
            'is_smoker' => 'boolean',
            'agrees_to_school_return_if_violation' => 'boolean',
            'agrees_to_return_if_absent_twice' => 'boolean',
            'is_active' => 'boolean',
            'profile_completion_percentage' => 'integer',
        ];
    }

    // Relationships
    public function pendaftaranSertifikasi()
    {
        return $this->hasMany(PendaftaranSertifikasi::class);
    }

    public function pendaftaranPKL()
    {
        return $this->hasMany(PendaftaranPKL::class);
    }

    public function penilaianPKLAsPembimbing()
    {
        return $this->hasMany(PenilaianPKL::class, 'pembimbing_id');
    }

    public function sertifikasiCreated()
    {
        return $this->hasMany(Sertifikasi::class, 'created_by');
    }

    public function sertifikasiUpdated()
    {
        return $this->hasMany(Sertifikasi::class, 'updated_by');
    }

    // New relationships
    public function activities()
    {
        return $this->hasMany(UserActivity::class);
    }

    public function documents()
    {
        return $this->hasMany(UserDocument::class);
    }

    public function internshipApplications()
    {
        return $this->hasMany(InternshipApplication::class);
    }

    public function evaluationsAsEvaluator()
    {
        return $this->hasMany(InternshipEvaluation::class, 'evaluator_id');
    }

    public function evaluationsAsApprover()
    {
        return $this->hasMany(InternshipEvaluation::class, 'approved_by');
    }

    // Scopes
    public function scopeAdmin($query)
    {
        return $query->where('role', 'admin');
    }

    public function scopeUser($query)
    {
        return $query->where('role', 'user');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByUserType($query, $type)
    {
        return $query->where('user_type', $type);
    }

    public function scopeByAccountStatus($query, $status)
    {
        return $query->where('account_status', $status);
    }


    // Accessors
    public function getAvatarUrlAttribute()
    {
        return $this->avatar ? asset('storage/' . $this->avatar) : null;
    }

    public function getDisplayName()
    {
        return $this->full_name ?: $this->name;
    }

    public function getAgeAttribute()
    {
        return $this->date_of_birth ? $this->date_of_birth->age : null;
    }

    public function getProfileCompletionPercentageAttribute($value)
    {
        if ($value) {
            return $value;
        }
        
        return $this->calculateProfileCompletion();
    }

    // Methods
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isUser()
    {
        return $this->role === 'user';
    }

    public function isActive()
    {
        return $this->is_active && $this->account_status === 'active';
    }

    public function canApplyForInternship()
    {
        return $this->user_type === 'student' && $this->isActive();
    }

    public function calculateProfileCompletion()
    {
        $requiredFields = [
            'full_name', 'email', 'phone', 'gender', 'address',
            'place_of_birth', 'date_of_birth', 'school_university',
            'major_concentration', 'class_semester'
        ];
        
        $filledFields = 0;
        foreach ($requiredFields as $field) {
            if (!empty($this->getAttribute($field))) {
                $filledFields++;
            }
        }
        
        return round(($filledFields / count($requiredFields)) * 100);
    }

    public function updateLastLogin($ipAddress = null)
    {
        $this->update([
            'last_login_at' => now(),
            'last_login_ip' => $ipAddress
        ]);
    }

    public function logActivity($type, $description, $metadata = null, $ipAddress = null, $userAgent = null)
    {
        return $this->activities()->create([
            'activity_type' => $type,
            'description' => $description,
            'metadata' => $metadata,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent
        ]);
    }

    // asesor role/relations removed
}
