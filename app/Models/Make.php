<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Make extends Model
{
    protected $guarded = [];

    public function models()
    {
        return $this->hasMany(VehicleModel::class);
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}
