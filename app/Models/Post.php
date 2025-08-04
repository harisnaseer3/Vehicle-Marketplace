<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use SoftDeletes;

    protected $casts = [
        'features' => 'array',
        'images' => 'array', // Also cast images to array if storing as JSON
        'is_featured' => 'boolean',
    ];

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function make()
    {
        return $this->belongsTo(Make::class);
    }

    public function model()
    {
        return $this->belongsTo(VehicleModel::class, 'model_id');
    }

    public function vehicleRegister()
    {
        return $this->belongsTo(VehicleRegister::class, 'vehicle_registration_id');
    }

    public function sold()
    {
        return $this->hasOne(PostSale::class);
    }
}
