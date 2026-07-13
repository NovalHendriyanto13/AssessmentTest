<?php
namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Api\ApiBaseController;
use App\Http\Payloads\Auth\LoginRequest;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends ApiBaseController {

    public function login(LoginRequest $request) 
    {
        $usernameOrEmail = $request->input('username');
        $password = $request->input('password');
        
        try {
            // Search dynamically by name, email, or username (if column exists)
            $query = \App\User::query();
            $query->where(function($q) use ($usernameOrEmail) {
                $q->where('email', $usernameOrEmail)
                  ->orWhere('name', $usernameOrEmail)
                  ->orWhere('email', $usernameOrEmail . '@example.com');
                
                if (\Schema::hasColumn('users', 'username')) {
                    $q->orWhere('username', $usernameOrEmail);
                }
            });

            $user = $query->first();

            if (!$user) {
                return $this->_errorResponse(
                    [
                        'error' => 'Unauthorized / Invalid Credentials',
                        'debug_info' => 'User not found in database',
                        'queried_username' => $usernameOrEmail
                    ], 411
                );
            }

            if (!\Hash::check($password, $user->password)) {
                return $this->_errorResponse(
                    [
                        'error' => 'Unauthorized / Invalid Credentials',
                        'debug_info' => 'Password mismatch',
                        'db_password_hash' => $user->password,
                        'input_password' => $password
                    ], 411
                );
            }

            if (! $token = JWTAuth::fromUser($user)) {
                return $this->_errorResponse(
                    [
                        'error' => 'Unauthorized / Invalid Credentials',
                        'debug_info' => 'Failed to generate JWT token'
                    ], 411
                );
            }
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return $this->_successResponse([
            'access_token' => $token,
            'token_type' => 'bearer',
        ]);
    }
}