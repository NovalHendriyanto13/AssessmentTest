<?php
namespace App\Http\Controllers\Api\Orders;

use App\Http\Controllers\Api\ApiBaseController;
// Request and DTO
use App\Http\Requests\Api\Orders\OrderCreateRequest;
// Models;
use App\Models\User;
use App\Models\Order;

class OrderController extends ApiBaseController
{
    public function index()
    {

    }
    
    public function create(OrderCreateRequest $request)
    {
        $user = User::query()
            ->select('id')
            ->where('id', $request->user_id)
            ->where('active', true)
            ->first();

        if (empty($user)) {
            return $this->errorResponse(404, 'No user data found');
        }

        $data = Order::create([
            'user_id' => $request->user_id,
            'name' => $request->name,
            'order_id' => $request->order_id,
            'created_at' => $request->created_at,
        ]);

        return $this->successResponse($data);
    }
}