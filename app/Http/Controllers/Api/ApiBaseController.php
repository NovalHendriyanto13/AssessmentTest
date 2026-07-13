<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class ApiBaseController extends Controller {
    public function _successResponse($data = null, $locale = 'ID', $message = null) {
        return response()->json([
            'success' => true,
            'locale' => $locale,
            'message' => $message ?? 'Process is success',
            'data' => $data,
        ], 200);
    }

    public function _errorResponse($data = null, $errCode = 500, $locale = 'ID', $message = null) {
        return response()->json([
            'success' => false,
            'locale' => $locale,
            'message' => $message ?? 'Process is failed',
            'data' => $data,
        ], $errCode);
    } 
}