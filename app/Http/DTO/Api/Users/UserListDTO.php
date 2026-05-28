<?php
namespace App\Http\DTO\Api\Users;

use App\Http\DTO\Api\BasePaginationDTO;

class UserListDTO extends BasePaginationDTO
{
    public static function setItems($data)
    {
        return array_map(function($user) {
            $user->append('can_edit');
            return [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'order_count' => count($user->orders),
                'can_edit' => $user->can_edit,
            ];
        }, $data->items());
    }
}