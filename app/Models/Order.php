<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'order_id', 'name', 'created_at'])]
class Order extends Model
{
    //
    protected $table = 'orders';

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
