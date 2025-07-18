<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleRegister extends Model
{
    protected $table = 'vehicle_register';
    protected $guarded = [];

    public function posts()
    {
        return $this->hasMany(Post::class, 'vehicle_registration_id');
    }
}
