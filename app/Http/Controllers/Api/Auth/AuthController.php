<?php
namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Api\ApiBaseController;
use Illuminate\Support\Facades\Auth;

// Request and DTO
use App\Http\Requests\Api\Auth\LoginRequest;
use App\Http\DTO\Api\Auth\LoginDTO;

class AuthController extends ApiBaseController
{
    public function login(LoginRequest $request)
    {
        $credentials = [
            'email' => $request->email, 
            'password' => $request->password,
            'active' => 1
        ];

        if (!$token = Auth::guard('api')->attempt($credentials)) {
            return $this->errosResponse(401, 'Invalid Credentials');
        }

        $data = LoginDTO::fromItem([
            'user' => auth('api')->user(),
            'token' => $token
        ]);
        return $this->successResponse($data);
    }
}