<?php

namespace App\Http\Controllers\Vehicle;

use App\Classes\StatusEnum;
use App\Http\Controllers\BaseController;
use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class FeaturedVehicleController extends BaseController
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->per_page ?? 10;

            $vehicles = Post::with(StatusEnum::POST_RELATIONSHIP)
                ->where('is_featured', 1)
                ->whereHas('category', function ($query) {
                    $query->where('name', StatusEnum::CAR);
                })
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            return $this->sendResponse($vehicles, 'Featured vehicle list displayed successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Failed to fetch featured vehicles: ' . $e->getMessage(), $e->getCode() ?: 500);
        }
    }

}
