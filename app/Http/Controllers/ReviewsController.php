<?php

namespace App\Http\Controllers;

use App\Http\Requests\Reviews\StoreReviewRequest;
use App\Http\Requests\Reviews\UpdateReviewRequest;
use App\Models\Review;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewsController extends BaseController
{
    public function index(Request $request)
    {
        try {
            $query = Review::with(['reviewer', 'post.category', 'post.make', 'post.model'])
                ->where('is_verified', true)
                ->orderBy('created_at', 'desc');

            // Apply search filter
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('comment', 'like', "%{$search}%")
                      ->orWhereHas('post', function ($postQuery) use ($search) {
                          $postQuery->where('title', 'like', "%{$search}%")
                                   ->orWhereHas('make', function ($makeQuery) use ($search) {
                                       $makeQuery->where('name', 'like', "%{$search}%");
                                   })
                                   ->orWhereHas('model', function ($modelQuery) use ($search) {
                                       $modelQuery->where('name', 'like', "%{$search}%");
                                   });
                      });
                });
            }

            // Apply category filter
            if ($request->has('category') && $request->category) {
                $query->whereHas('post', function ($postQuery) use ($request) {
                    $postQuery->where('category_id', $request->category);
                });
            }

            // Apply rating filter
            if ($request->has('rating') && $request->rating) {
                $query->where('rating', '>=', $request->rating);
            }

            $perPage = $request->get('per_page', 12);
            $reviews = $query->paginate($perPage);

            return $this->sendResponse($reviews->toArray(), 'Reviews retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function store(StoreReviewRequest $request)
    {
        try {
            // Check if user has already reviewed this post
            $existingReview = Review::where('reviewer_id', Auth::id())
                ->where('post_id', $request->post_id)
                ->first();

            if ($existingReview) {
                return $this->sendError('You have already reviewed this vehicle', 400);
            }

            $review = Review::create([
                'user_id' => Auth::id(),
                'post_id' => $request->post_id,
                'reviewer_id' => Auth::id(),
                'rating' => $request->rating,
                'title' => $request->title,
                'comment' => $request->comment,
                'is_verified' => false // Admin will verify
            ]);

            // Update post's average rating
            $this->updatePostRating($request->post_id);

            return $this->sendResponse($review->toArray(), 'Review submitted successfully. It will be visible after verification.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function update(UpdateReviewRequest $request, $id)
    {
        try {
            $review = Review::findOrFail($id);

            // Check if user owns this review
            if ($review->reviewer_id !== Auth::id()) {
                return $this->sendError('Unauthorized', 403);
            }

            $review->update($request->only(['rating', 'title', 'comment']));

            $this->updatePostRating($review->post_id);

            return $this->sendResponse($review->toArray(), 'Review updated successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function destroy($id)
    {
        try {
            $review = Review::findOrFail($id);

            // Check if user owns this review or is admin
            if ($review->reviewer_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
                return $this->sendError('Unauthorized', 403);
            }

            $postId = $review->post_id;
            $review->delete();

            // Update post's average rating
            $this->updatePostRating($postId);

            return $this->sendResponse([], 'Review deleted successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    private function updatePostRating($postId)
    {
        $post = Post::find($postId);
        if ($post) {
            $averageRating = Review::where('post_id', $postId)
                ->where('is_verified', true)
                ->avg('rating');

            $reviewsCount = Review::where('post_id', $postId)
                ->where('is_verified', true)
                ->count();

            $post->update([
                'average_rating' => round($averageRating, 1),
                'reviews_count' => $reviewsCount
            ]);
        }
    }
}
