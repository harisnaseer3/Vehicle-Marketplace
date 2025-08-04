<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostSale extends Model
{
    protected $table = 'post_sales';
    protected $guarded = [];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }
}
