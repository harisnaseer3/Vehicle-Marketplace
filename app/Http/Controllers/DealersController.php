<?php

namespace App\Http\Controllers;

use App\Models\Dealer;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DealersController extends BaseController
{
    public function index(Request $request)
    {
        try {
            $query = Dealer::with(['user:id,name,email,phone'])
                ->where('is_verified', true);

            // Search by name or location
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('city', 'like', "%{$search}%")
                      ->orWhere('address', 'like', "%{$search}%");
                });
            }

            // Filter by featured
            if ($request->has('featured')) {
                $query->where('is_featured', true);
            }

            $dealers = $query->orderBy('rating', 'desc')
                ->orderBy('reviews_count', 'desc')
                ->paginate(12);

            return $this->sendResponse($dealers, 'Dealers retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function show($id)
    {
        try {
            $dealer = Dealer::with([
                'user:id,name,email,phone',
                'posts' => function ($query) {
                    $query->with(['make', 'model', 'category'])
                        ->where('is_featured', true)
                        ->limit(6);
                },
                'reviews' => function ($query) {
                    $query->with('reviewer:id,name')
                        ->orderBy('created_at', 'desc')
                        ->limit(5);
                }
            ])->findOrFail($id);

            // Get dealer stats
            $stats = [
                'total_vehicles' => $dealer->posts()->count(),
                'featured_vehicles' => $dealer->posts()->where('is_featured', true)->count(),
                'certified_vehicles' => $dealer->posts()->where('certified', true)->count(),
                'average_rating' => $dealer->reviews()->avg('rating') ?? 0,
                'total_reviews' => $dealer->reviews()->count()
            ];

            $dealer->stats = $stats;

            return $this->sendResponse($dealer, 'Dealer details retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $user = Auth::user();

            // Check if user already has a dealer profile
            $existingDealer = Dealer::where('user_id', $user->id)->first();
            if ($existingDealer) {
                return $this->sendError('You already have a dealer profile.', 400);
            }

            $dealer = Dealer::create([
                'user_id' => $user->id,
                'name' => $request->name,
                'description' => $request->description,
                'phone' => $request->phone,
                'email' => $request->email,
                'website' => $request->website,
                'address' => $request->address,
                'city' => $request->city,
                'business_hours' => $request->business_hours,
                'services' => $request->services
            ]);

            return $this->sendResponse($dealer, 'Dealer profile created successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
            $dealer = Dealer::findOrFail($id);

            // Check if user owns this dealer profile
            if ($dealer->user_id !== $user->id) {
                return $this->sendError('Unauthorized.', 403);
            }

            $dealer->update($request->all());

            return $this->sendResponse($dealer, 'Dealer profile updated successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function featured()
    {
        try {
            $dealers = Dealer::with(['user:id,name'])
                ->where('is_featured', true)
                ->where('is_verified', true)
                ->orderBy('rating', 'desc')
                ->limit(6)
                ->get();

            return $this->sendResponse($dealers, 'Featured dealers retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }
}
