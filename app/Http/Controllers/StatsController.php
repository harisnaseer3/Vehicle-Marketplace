<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use App\Models\Deal;
use App\Models\Review;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class StatsController extends BaseController
{
    public function index()
    {
        return Cache::remember('landing_stats', now()->addHours(6), function () {
            try {
                $stats = [
                    'vehicles' => Post::count(),
                    'users' => User::count(),
                    'deals' => Deal::where('status', 'completed')->count(),
                    'satisfaction' => $this->calculateSatisfactionRate(),
                ];

                return $this->sendResponse($stats, 'Statistics data displayed successfully.');
            } catch (\Exception $e) {
                return $this->sendError($e->getMessage());
            }
        });
    }

    public function countVehiclesByCategories()
    {
        return Cache::remember('count_by_categories', now()->addHours(6), function () {
            try {
                $counts = Post::select('category_id', DB::raw('COUNT(*) as total'))
//                ->where('status', '!=', 'sold') // Optional: Exclude sold vehicles
                    ->groupBy('category_id')
                    ->with('category:id,name') // Load category name
                    ->get()
                    ->map(function ($item) {
                        return [
                            'category_id' => $item->category_id,
                            'category_name' => $item->category->name ?? 'Unknown',
                            'total' => $item->total,
                        ];
                    });

                return $this->sendResponse($counts, 'Vehicle counts by category retrieved successfully.');
            } catch (\Exception $e) {
                return $this->sendError($e->getMessage());
            }
        });
    }

    protected function calculateSatisfactionRate()
    {
        $avgRating = Review::whereNotNull('rating')->avg('rating');

        if ($avgRating) {
            return round(($avgRating / 5) * 100);
        }

        return 95; // Default if no reviews exist
    }
}
