<?php
namespace App\Http\DTO\Api\Auth;

use App\Http\DTO\Api\BaseDTO;
use Illuminate\Support\Facades\Auth;

class LoginDTO extends BaseDTO
{
    public static function setItems($data): array
    {
        $userInfo = $data['user'];
        return [
            'user' => [
                'name' => $userInfo->name,
                'email' => $userInfo->email,
                'role' => $userInfo->role,   
            ],
            'token' => $data['token'],
            'token_type' => 'bearer',
            'expiry_in' => Auth::guard('api')->factory()->getTTL() * 60
        ];
    }
}