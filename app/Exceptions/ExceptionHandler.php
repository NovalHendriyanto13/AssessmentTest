<?php
namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\ValidationException;
use Throwable;

class ExceptionHandler extends Handler
{
    public function render($request, Throwable $exception)
    {
        return $this->handleException($request, $exception);
    }

    private function handleException($request, Throwable $exception)
    {
        $statusCode = 404;
        $exception = $this->prepareException($exception);
        $data = [];
        $message = $exception->getMessage();
        
        if ($exception instanceof HttpResponseException) {
            $statusCode = $exception->getStatusCode();
            $exception = $exception->getResponse();
        } else if ($exception instanceof AuthenticationException) {
            $statusCode = 401;
            $exception = $this->unauthenticated($request, $exception);
        } else if ($exception instanceof ValidationException) {
            $statusCode = 422;
            $exception = $this->convertValidationExceptionToResponse($exception, $request);
        } else if ($exception instanceof AuthorizationException) {
            $statusCode = 403;
            $exception = $exception->response();
        } else if ($exception instanceof QueryException) {
            $statusCode = 500;

            $message = 'An internal server error occurred. Please try again later.';

            if (app()->environment('local') && config('app.debug')) {
                $data['trace'] = $exception->getTrace();
            }
        }

        return response()->json([
            'success' => false,
            'code' => $statusCode,
            'data' => $data,
            'message' => $message,
        ], $statusCode);
    }
}