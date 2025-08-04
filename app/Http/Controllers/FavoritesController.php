<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoritesController extends BaseController
{
    public function index()
    {
        try {
            $user = Auth::user();
            $favorites = $user->favorites()
                ->with(['post' => function ($query) {
                    $query->with(['make', 'model', 'category']);
                }])
                ->get()
                ->pluck('post');

            return $this->sendResponse($favorites, 'Favorites retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function toggle(Request $request)
    {
        try {
            $user = Auth::user();
            $postId = $request->post_id;

            $existingFavorite = Favorite::where('user_id', $user->id)
                ->where('post_id', $postId)
                ->first();

            if ($existingFavorite) {
                $existingFavorite->delete();
                $message = 'Removed from favorites.';
                $isFavorited = false;
            } else {
                Favorite::create([
                    'user_id' => $user->id,
                    'post_id' => $postId
                ]);
                $message = 'Added to favorites.';
                $isFavorited = true;
            }

            // Update favorites count on post
            $post = Post::find($postId);
            $post->favorites_count = $post->favorites()->count();
            $post->save();

            return $this->sendResponse([
                'is_favorited' => $isFavorited,
                'favorites_count' => $post->favorites_count
            ], $message);
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function check(Request $request)
    {
        try {
            $user = Auth::user();
            $postId = $request->post_id;

            $isFavorited = Favorite::where('user_id', $user->id)
                ->where('post_id', $postId)
                ->exists();

            return $this->sendResponse(['is_favorited' => $isFavorited], 'Favorite status checked.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }
} 