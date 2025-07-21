<?php

namespace App\Http\Controllers\Category;

use App\Classes\StatusEnum;
use App\Http\Controllers\BaseController;
use App\Models\Category;
use App\Models\City;
use App\Models\Make;
use App\Models\VehicleModel;
use App\Models\VehicleRegister;

class CategoryController extends BaseController
{
    public function index()
    {
        try {
            $categories = Category::all();
            return $this->sendResponse($categories, 'Categories fetched successfully.');
        }catch (\Exception $e) {
            return $this->sendError(
                'Failed to fetch categories: ' . $e->getMessage(),
                $e->getCode() ?: 500
            );
        }
    }

    public function getMakes($category_id)
    {
        try {
            $makes = Make::where('category_id', $category_id)->get();

            return $this->sendResponse($makes, 'Makes fetched successfully.');
        } catch (\Exception $e) {
            return $this->sendError(
                'Failed to fetch Makes: ' . $e->getMessage(),
                $e->getCode() ?: 500
            );
        }
    }


    public function getModels($make_id)
    {
        try {
            $models = VehicleModel::where('make_id', $make_id)->get();
            return $this->sendResponse($models, 'Models fetched successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Failed to fetch models: ' . $e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function getVehiclesRegister()
    {
        try {
            $vehicles = VehicleRegister::all();
            return $this->sendResponse($vehicles, 'Vehicle registration fetched successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Failed to fetch vehicle registration: ' . $e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function getCities()
    {
        try {
            $cities = City::all();
            return $this->sendResponse($cities, 'Cities fetched successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Failed to fetch Cities: ' . $e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function getTransmissionType()
    {
        try {
            $transmissionType = StatusEnum::TRANSMISSION_TYPE;
            return $this->sendResponse($transmissionType, 'Transmission type fetched successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Failed to fetch Transmission Type: ' . $e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function getFuelType()
    {
        try {
            $fuelType = StatusEnum::FUEL_TYPE;
            return $this->sendResponse($fuelType, 'Fuel type fetched successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Failed to fetch Fuel type: ' . $e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function getBodyType()
    {
        try {
            $bodyType = StatusEnum::BODY_TYPE;
            return $this->sendResponse($bodyType, 'Body fetched successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Failed to fetch Body type: ' . $e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function getCondition()
    {
        try {
            $condition = StatusEnum::CONDITION;
            return $this->sendResponse($condition, 'Condition fetched successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Failed to fetch Condition: ' . $e->getMessage(), $e->getCode() ?: 500);
        }
    }
}
