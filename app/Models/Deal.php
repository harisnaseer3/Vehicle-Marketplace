<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deal extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id',
        'seller_id',
        'post_id',
        'price',
        'status',
        'completed_at',
        'notes'
    ];

    protected $casts = [
        'completed_at' => 'datetime',
        'price' => 'decimal:2'
    ];

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
