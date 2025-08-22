<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;
    protected $table = 'video';

    protected $fillable = [
        'judul',
        'deskripsi',
        'thumbnail',
        'link_video',
        'status',
        'penulis',
        'featured',
        'views'
    ];

    protected $casts = [
        'views' => 'integer',
        'featured' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function scopePublished($query)
    {
        return $query->where('status', 'Publish');
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function getThumbnailUrlAttribute()
    {
        return $this->thumbnail ? asset('storage/' . $this->thumbnail) : null;
    }

    public function incrementViews()
    {
        $this->increment('views');
    }
}
