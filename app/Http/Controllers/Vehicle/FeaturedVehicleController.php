<?php

namespace App\Http\Controllers\Vehicle;

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
            $vehicle = Post::where('is_featured', 1)->paginate($perPage);
            return $this->sendResponse($vehicle, 'Featured vehicle list displayed successfully.');
        } catch (\Exception $e)
        {
            return $this->sendError($e->getMessage());
        }
    }
}
