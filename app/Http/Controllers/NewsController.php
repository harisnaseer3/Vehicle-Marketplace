<?php

namespace App\Http\Controllers;

use App\Models\NewsArticle;
use App\Models\NewsCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NewsController extends BaseController
{
    public function index(Request $request)
    {
        try {
            $query = NewsArticle::with(['category', 'author'])
                ->published()
                ->orderBy('published_at', 'desc');

            // Apply search filter
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('excerpt', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
                });
            }

            // Apply category filter
            if ($request->has('category') && $request->category) {
                $query->where('category_id', $request->category);
            }

            $perPage = $request->get('per_page', 12);
            $articles = $query->paginate($perPage);

            return $this->sendResponse($articles->toArray(), 'Articles retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function show($slug)
    {
        try {
            $article = NewsArticle::with(['category', 'author'])
                ->published()
                ->where('slug', $slug)
                ->first();

            if (!$article) {
                return $this->sendError('Article not found', 404);
            }

            // Increment view count
            $article->incrementViews();

            return $this->sendResponse($article->toArray(), 'Article retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function featured()
    {
        try {
            $articles = NewsArticle::with(['category', 'author'])
                ->published()
                ->featured()
                ->orderBy('published_at', 'desc')
                ->limit(6)
                ->get();

            return $this->sendResponse($articles->toArray(), 'Featured articles retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function related(Request $request)
    {
        try {
            $categoryId = $request->get('category_id');
            $excludeId = $request->get('exclude_id');
            $limit = $request->get('limit', 3);

            $query = NewsArticle::with(['category', 'author'])
                ->published()
                ->where('category_id', $categoryId);

            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }

            $articles = $query->orderBy('published_at', 'desc')
                ->limit($limit)
                ->get();

            return $this->sendResponse($articles->toArray(), 'Related articles retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function categories()
    {
        try {
            $categories = NewsCategory::where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get();

            return $this->sendResponse($categories->toArray(), 'Categories retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }
} 