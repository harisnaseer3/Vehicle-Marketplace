<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class BaseController extends Controller
{
    /**
     * Send a success response.
     */
    public function sendResponse($result, $message = null): JsonResponse
    {
        $response = [
            'success' => true,
            'data'    => $result,
        ];

        if ($message) {
            $response['message'] = $message;
        }

        return response()->json($response, Response::HTTP_OK);
    }

    /**
     * Send an error response.
     */
    public function sendError($error, $errorMessages = [], $code = Response::HTTP_BAD_REQUEST): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $error,
        ];

        if (!empty($errorMessages)) {
            $response['data'] = $errorMessages;
        }

        return response()->json($response, $code);
    }
}
