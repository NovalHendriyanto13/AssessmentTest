<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class VerifyJwt
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $request->merge(['auth_user' => $user]);
            auth('api')->setUser($user);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'code' => 404,
                    'data' => null,
                    'message' => 'User not found'
                ], 404);
            }

            // Optional: check active user
            if ($user->active != 1) {
                return response()->json([
                    'success' => false,
                    'code' => 403,
                    'data' => null,
                    'message' => 'User is inactive'
                ], 403);
            }

        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json([
                'success' => false,
                'code' => 401,
                'data' => null,
                'message' => 'Token expired'
            ], 401);

        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json([
                'success' => false,
                'code' => 401,
                'data' => null,
                'message' => 'Token invalid'
            ], 401);

        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'code' => 401,
                'data' => null,
                'message' => 'Token not provided'
            ], 401);
        }
        return $next($request);
    }
}
