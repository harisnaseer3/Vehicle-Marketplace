<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dealer extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'phone',
        'email',
        'website',
        'address',
        'city',
        'rating',
        'reviews_count',
        'is_verified',
        'is_featured',
        'logo',
        'business_hours',
        'services'
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'is_featured' => 'boolean',
        'business_hours' => 'array',
        'services' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'user_id', 'user_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'user_id', 'user_id');
    }
} 