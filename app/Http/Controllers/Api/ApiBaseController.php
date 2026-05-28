<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;

class ApiBaseController extends Controller
{
    public function successResponse($data, $message = '')
    {
        return [
            'success' => true,
            'code' => 200,
            'data' => $data,
            'message' => !empty($message) ? $message : 'Operation completed successfully.'
        ];
    }

    public function errosResponse($errorCode, $message = '')
    {
        if (is_a($message, 'Exception')) {
            if ($errorCode == 500) {
                Log::error($message->getMessage());
                $message = 'An error occurred. Please try again later.';
            } else {
                $message = $message->getMessage();
            }
        }

        return [
            'success' => false,
            'code' => $errorCode,
            'data' => null,
            'message' => !empty($message) ? $message : 'Operation completed successfully.'
        ];
    }
}