<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleModel extends Model
{
    protected $table = 'models';
    protected $guarded = [];

    public function make()
    {
        return $this->belongsTo(Make::class);
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'model_id');
    }
}
