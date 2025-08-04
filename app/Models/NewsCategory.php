<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'is_active',
        'sort_order'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer'
    ];

    public function articles()
    {
        return $this->hasMany(NewsArticle::class, 'category_id');
    }

    public function getActiveArticlesCountAttribute()
    {
        return $this->articles()->where('is_published', true)->count();
    }
} 