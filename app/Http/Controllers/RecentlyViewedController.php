<?php

namespace App\Http\Controllers;

use App\Models\RecentlyViewed;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RecentlyViewedController extends BaseController
{
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            $category = $request->get('category', 'all');
            $limit = $request->get('limit', 10);

            $query = $user->recentlyViewed()
                ->with(['post' => function ($query) {
                    $query->with(['make', 'model', 'category']);
                }])
                ->orderBy('viewed_at', 'desc');

            if ($category !== 'all') {
                $query->whereHas('post.category', function ($q) use ($category) {
                    $q->where('name', ucfirst($category));
                });
            }

            $recentlyViewed = $query->limit($limit)->get()->pluck('post');

            return $this->sendResponse($recentlyViewed, 'Recently viewed items retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function add(Request $request)
    {
        try {
            $user = Auth::user();
            $postId = $request->post_id;

            // Check if already exists
            $existing = RecentlyViewed::where('user_id', $user->id)
                ->where('post_id', $postId)
                ->first();

            if ($existing) {
                // Update viewed_at timestamp
                $existing->update(['viewed_at' => now()]);
            } else {
                // Create new record
                RecentlyViewed::create([
                    'user_id' => $user->id,
                    'post_id' => $postId,
                    'viewed_at' => now()
                ]);
            }

            // Increment views count on post
            $post = Post::find($postId);
            $post->incrementViews();

            return $this->sendResponse([], 'View recorded successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function clear()
    {
        try {
            $user = Auth::user();
            $user->recentlyViewed()->delete();

            return $this->sendResponse([], 'Recently viewed history cleared.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }
} 