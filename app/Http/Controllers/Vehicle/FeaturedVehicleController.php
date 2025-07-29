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
            $perPage = $request->per_page ?? 12;

            $conditions = [
                'new',
                'used',
                'certified-pre-owned',
                'salvage',
            ];

            foreach ($conditions as $condition) {
                $vehicles = Post::with(StatusEnum::POST_RELATIONSHIP)
                    ->where('is_featured', 1)
                    ->where('condition', $condition)
                    ->whereHas('category', function ($query) {
                        $query->where('name', StatusEnum::CAR);
                    })
                    ->orderBy('created_at', 'desc')
                    ->take($perPage)
                    ->get();

                $result[$condition] = $vehicles;
            }

            return $this->sendResponse($result, 'Featured vehicles grouped by condition.');
        } catch (\Exception $e) {
            return $this->sendError(
                'Failed to fetch featured vehicles: ' . $e->getMessage(),
                $e->getCode() ?: 500
            );
        }
    }

    public function getFeaturedBikes()
    {
        try {
            $perPage = $request->per_page ?? 12;

            $conditions = ['new', 'used', 'certified-pre-owned', 'salvage'];
            $featuredBikes = [];

            foreach ($conditions as $condition) {
                $featuredBikes[$condition] = Post::where('condition', $condition)
                    ->whereHas('category', function ($query) {
                        $query->where('name', StatusEnum::BIKE);
                    })
                    ->where('is_featured', 1)
                    ->with(StatusEnum::POST_RELATIONSHIP)
                    ->orderBy('created_at', 'desc')
                    ->take($perPage)
                    ->get();
            }

            return $this->sendResponse($featuredBikes, 'Featured vehicles grouped by condition.');
        } catch (\Exception $e) {
            return $this->sendError(
                'Failed to fetch featured vehicles: ' . $e->getMessage(),
                $e->getCode() ?: 500
            );
        }

    }
}
