<?php

namespace App\Http\Controllers\Posts;

use App\Classes\StatusEnum;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Vehicle\CreatePostRequest;
use App\Http\Requests\Vehicle\UpdatePostRequest;
use App\Models\Post;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PostsController extends BaseController
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        try {
            $per_page = $request->per_page ?? 12;

            $query = Post::query()
                ->with(StatusEnum::POST_RELATIONSHIP)
                ->whereHas('category', function ($q) {
                    $q->where('name', 'Cars');
                });

            // Apply filters
            $this->applyFilters($query, $request);

            // Apply sorting
            $this->applySorting($query, $request);

            $vehicles = $query->paginate($per_page);

            return $this->sendResponse($vehicles->toArray(), 'Vehicles retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function getAllBikes(Request $request)
    {
        try {
            $per_page = $request->per_page ?? 12;

            $query = Post::query()
                ->with(StatusEnum::POST_RELATIONSHIP)
                ->whereHas('category', function ($q) {
                    $q->where('name', 'Bikes');
                });

            // Apply filters
            $this->applyFilters($query, $request);

            // Apply sorting
            $this->applySorting($query, $request);

            $vehicles = $query->paginate($per_page);

            return $this->sendResponse($vehicles->toArray(), 'Bikes retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    private function applyFilters($query, $request)
    {
        if ($request->has('make_id') && $request->make_id) {
            $query->where('make_id', $request->make_id);
        }

        if ($request->has('model_id') && $request->model_id) {
            $query->where('model_id', $request->model_id);
        }

        if ($request->has('min_price') && $request->min_price) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price') && $request->max_price) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->has('year') && $request->year) {
            $query->where('year', $request->year);
        }

        if ($request->has('condition') && $request->condition) {
            $query->where('condition', $request->condition);
        }

        if ($request->has('transmission_type') && $request->transmission_type) {
            $query->where('transmission_type', $request->transmission_type);
        }

        if ($request->has('fuel_type') && $request->fuel_type) {
            $query->where('fuel_type', $request->fuel_type);
        }

        if ($request->has('body_type') && $request->body_type) {
            $query->where('body_type', $request->body_type);
        }

        if ($request->has('color') && $request->color) {
            $query->where('color', $request->color);
        }

        if ($request->has('location') && $request->location) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        // Bike-specific filters
        if ($request->has('engine_capacity') && $request->engine_capacity) {
            $query->where('engine_size', $request->engine_capacity);
        }

        if ($request->has('bike_type') && $request->bike_type) {
            $query->where('bike_type', $request->bike_type);
        }

        // Quick filters
        if ($request->has('certified') && $request->certified) {
            $query->where('certified', true);
        }

        if ($request->has('featured') && $request->featured) {
            $query->where('is_featured', true);
        }

        if ($request->has('new_arrivals') && $request->new_arrivals) {
            $query->where('created_at', '>=', now()->subDays(7));
        }

        if ($request->has('best_deals') && $request->best_deals) {
            // Logic for best deals (e.g., price below average)
            $query->where('price', '<=', 500000); // Example threshold
        }
    }

    private function applySorting($query, $request)
    {
        $sortBy = $request->get('sort_by', 'latest');

        switch ($sortBy) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'year':
                $query->orderBy('year', 'desc');
                break;
            case 'mileage':
                $query->orderBy('mileage', 'asc');
                break;
            case 'latest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }
    }

    public function create(CreatePostRequest $request)
    {
//        $this->authorize('create-post');
        try {
            DB::beginTransaction();

            $imagePaths = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('images/vehicles', 'public');
                    $imagePaths[] = $path;

                    // Consider creating thumbnails here if needed
                    // $this->createThumbnail($path);
                }
            }

            $vehicle = Post::create([
                'user_id' => $request->user_id,
                'category_id' => $request->category_id,
                'make_id' => $request->make_id,
                'model_id' => $request->model_id,
                'vehicle_registration_id' => $request->vehicle_registration_id,
                'city_id' => $request->city_id,
                'title' => $request->title,
                'description' => $request->description,
                'price' => $request->price,
                'features' => is_array($request->features)
                    ? $request->features
                    : array_map('trim', explode(',', $request->features)),
                'year' => $request->year,
                'mileage' => $request->mileage,
                'transmission_type' => $request->transmission_type,
                'fuel_type' => $request->fuel_type,
                'body_type' => $request->body_type,
                'condition' => $request->condition,
                'color' => $request->color,
                'location' => $request->location,
                'engine_size' => $request->engine_size,
                'bike_type' => $request->bike_type,
                'images' => !empty($imagePaths) ? $imagePaths : null,
                'is_featured' => $request->boolean('is_featured')
            ]);

            DB::commit();

            return $this->sendResponse([$vehicle, 'Post created successfully'], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            // Delete any uploaded images if transaction fails
            if (!empty($imagePaths)) {
                foreach ($imagePaths as $path) {
                    Storage::disk('public')->delete($path);
                }
            }

            return $this->sendError(
                'Post creation failed: ' . $e->getMessage(),
                $e->getCode() ?: 500
            );
        }
    }

    public function show($id)
    {
        try {
            $vehicle = Post::with(StatusEnum::POST_RELATIONSHIP)->findOrFail($id);

            return $this->sendResponse($vehicle, 'Post retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage());
        }
    }

    public function showBikes($id)
    {
        try {
            $vehicle = Post::with(StatusEnum::POST_RELATIONSHIP)->findOrFail($id);

            return $this->sendResponse($vehicle, 'Post retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage());
        }
    }


    public function update(UpdatePostRequest $request, Post $post)
    {
        $this->authorize('create-post');
        try {
            DB::beginTransaction();

            $newImagePaths = [];

            if ($request->hasFile('images')) {
                // Delete old images
                if (!empty($post->images)) {
                    foreach ($post->images as $oldImage) {
                        Storage::disk('public')->delete($oldImage);
                    }
                }

                // Upload new images
                foreach ($request->file('images') as $image) {
                    $path = $image->store('images/vehicles', 'public');
                    $newImagePaths[] = $path;
                }
            }

            // Update fields
            $post->update([
                'category_id' => $request->category_id,
                'make_id' => $request->make_id,
                'model_id' => $request->model_id,
                'vehicle_registration_id' => $request->vehicle_registration_id,
                'city_id' => $request->city_id,
                'title' => $request->title,
                'description' => $request->description,
                'price' => $request->price,
                'features' => is_array($request->features)
                    ? $request->features
                    : array_map('trim', explode(',', $request->features)),
                'year' => $request->year,
                'mileage' => $request->mileage,
                'transmission_type' => $request->transmission_type,
                'fuel_type' => $request->fuel_type,
                'body_type' => $request->body_type,
                'condition' => $request->condition,
                'color' => $request->color,
                'location' => $request->location,
                'engine_size' => $request->engine_size,
                'bike_type' => $request->bike_type,
                'images' => !empty($newImagePaths) ? $newImagePaths : $post->images,
                'is_featured' => $request->boolean('is_featured')
            ]);

            DB::commit();

            return $this->sendResponse($post, 'Post updated successfully');

        } catch (\Exception $e) {
            DB::rollBack();

            // Rollback any uploaded images if update fails
            if (!empty($newImagePaths)) {
                foreach ($newImagePaths as $path) {
                    Storage::disk('public')->delete($path);
                }
            }

            return $this->sendError(
                'Post update failed: ' . $e->getMessage(),
                $e->getCode() ?: 500
            );
        }
    }


    public function destroy($id)
    {
//        $this->authorize('create-post');
        try {
            $vehicle = Post::findOrFail($id);

            $vehicle->delete();

            return $this->sendResponse([
                'message' => 'Post moved to trash successfully'
            ]);

        } catch (\Exception $e) {
            return $this->sendError(
                'Failed to delete vehicle: ' . $e->getMessage(),
                $e->getCode() ?: 500
            );
        }
    }

    public function makeCertified($id)
    {
        try {
            $this->authorize('make-certified-vehicle');
            $post = Post::findOrFail($id);
            if ($post->certified) {
                return $this->sendResponse([], 'Post is already certified');
            }
            $post->update([
                'certified' => 1,
            ]);

            return $this->sendResponse($post, 'Post successfully made certified');
        } catch (\Exception $e) {
            return $this->sendError(
                'Failed to make certified vehicle: ' . $e->getMessage(),
                $e->getCode() ?: 500
            );
        }
    }

    public function getCertifiedVehicle()
    {
        try {
            $per_page = $requst->per_page ?? 12;
            $post = Post::query()->where('certified', 1)->paginate($per_page);
            return $this->sendResponse($post, 'Certified vehicle retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError(
                'Failed to fetch certified vehicle: ' . $e->getMessage(),
                $e->getCode() ?: 500
            );
        }
    }

    public function makeManageByUs($id)
    {
        try {
            $this->authorize('make-certified-vehicle');
            $post = Post::findOrFail($id);
            if ($post->managed_by_us) {
                return $this->sendResponse([], 'Post is already managed by us');
            }
            $post->update([
                'managed_by_us' => 1,
            ]);

            return $this->sendResponse($post, 'Post successfully made certified');

        } catch (\Exception $e) {
            return $this->sendError(
                'Failed to mange vehicle by us: ' . $e->getMessage(),
                $e->getCode() ?: 500
            );
        }
    }

    public function getManagedByUsVehicle()
    {
        try {
            $per_page = $requst->per_page ?? 12;
            $post = Post::query()->where('managed_by_us', 1)->paginate($per_page);
            return $this->sendResponse($post, 'Managed by us vehicle retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError(
                'Failed to fetch managed by us vehicle: ' . $e->getMessage(),
                $e->getCode() ?: 500
            );
        }
    }

    public function restore($id)
    {
        try {
            $vehicle = Post::onlyTrashed()->findOrFail($id);

            // Authorization check
            $this->authorize('restore', $vehicle);

            $vehicle->restore();

            return $this->sendResponse([
                'vehicle' => $vehicle,
                'message' => 'Post restored successfully'
            ]);

        } catch (\Exception $e) {
            return $this->sendError(
                'Failed to restore vehicle: ' . $e->getMessage(),
                $e->getCode() ?: 500
            );
        }
    }

    /**
     * Permanently delete a vehicle
     */
    public function forceDelete($id)
    {
        try {
            $vehicle = Post::onlyTrashed()->findOrFail($id);

            // Authorization check
            $this->authorize('forceDelete', $vehicle);

            // Delete associated images from storage
            if ($vehicle->images) {
                foreach ($vehicle->images as $image) {
                    Storage::disk('public')->delete($image);
                }
            }

            $vehicle->forceDelete();

            return $this->sendResponse([
                'message' => 'Post permanently deleted'
            ]);

        } catch (\Exception $e) {
            return $this->sendError(
                'Failed to permanently delete vehicle: ' . $e->getMessage(),
                $e->getCode() ?: 500
            );
        }
    }
}
