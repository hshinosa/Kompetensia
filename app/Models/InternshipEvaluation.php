<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InternshipEvaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'evaluator_id',
        'evaluation_type',
        'week_number',
        'month_number',
        'technical_skills_score',
        'communication_score',
        'teamwork_score',
        'initiative_score',
        'punctuality_score',
        'creativity_score',
        'overall_score',
        'strengths',
        'weaknesses',
        'suggestions',
        'achievements',
        'additional_notes',
        'status',
        'evaluation_date',
        'submitted_at',
        'approved_by',
        'approved_at'
    ];

    protected $casts = [
        'technical_skills_score' => 'integer',
        'communication_score' => 'integer',
        'teamwork_score' => 'integer',
        'initiative_score' => 'integer',
        'punctuality_score' => 'integer',
        'creativity_score' => 'integer',
        'overall_score' => 'decimal:2',
        'week_number' => 'integer',
        'month_number' => 'integer',
        'evaluation_date' => 'datetime',
        'submitted_at' => 'datetime',
        'approved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relationships
    public function application()
    {
        return $this->belongsTo(InternshipApplication::class, 'application_id');
    }

    public function evaluator()
    {
        return $this->belongsTo(User::class, 'evaluator_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // Scopes
    public function scopeByApplication($query, $applicationId)
    {
        return $query->where('application_id', $applicationId);
    }

    public function scopeByEvaluator($query, $evaluatorId)
    {
        return $query->where('evaluator_id', $evaluatorId);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('evaluation_type', $type);
    }

    public function scopeSubmitted($query)
    {
        return $query->where('status', 'submitted');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    // Boot method for auto-calculating overall score
    protected static function boot()
    {
        parent::boot();
        
        static::saving(function ($model) {
            $model->calculateOverallScore();
        });
    }

    // Methods
    public function calculateOverallScore()
    {
        $scores = [
            $this->technical_skills_score,
            $this->communication_score,
            $this->teamwork_score,
            $this->initiative_score,
            $this->punctuality_score,
            $this->creativity_score
        ];
        
        $validScores = array_filter($scores, function($score) {
            return $score !== null && $score > 0;
        });
        
        if (count($validScores) > 0) {
            $this->overall_score = round(array_sum($validScores) / count($validScores), 2);
        }
    }

    public function submit()
    {
        return $this->update([
            'status' => 'submitted',
            'submitted_at' => now()
        ]);
    }

    public function approve($approverId)
    {
        return $this->update([
            'status' => 'approved',
            'approved_by' => $approverId,
            'approved_at' => now()
        ]);
    }

    public function getScoreGradeAttribute()
    {
        if ($this->overall_score >= 4.5) {
            return 'A';
        } elseif ($this->overall_score >= 3.5) {
            return 'B';
        } elseif ($this->overall_score >= 2.5) {
            return 'C';
        } elseif ($this->overall_score >= 1.5) {
            return 'D';
        } else {
            return 'E';
        }
    }

    public function getScoreColorAttribute()
    {
        $grade = $this->getScoreGradeAttribute();
        
        $colors = [
            'A' => 'text-green-600',
            'B' => 'text-blue-600',
            'C' => 'text-yellow-600',
            'D' => 'text-orange-600',
            'E' => 'text-red-600'
        ];
        
        return $colors[$grade] ?? 'text-gray-600';
    }
}
