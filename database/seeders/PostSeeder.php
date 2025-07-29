<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $featuresList = ['ABS', 'Sunroof', 'Navigation', 'Alloy Rims', 'Bluetooth', 'Backup Camera'];

        for ($i = 1; $i <= 10; $i++) {
            Post::create([
                'user_id' => 2, // Make sure this user exists
                'title' => "Sample Vehicle Post $i",
                'description' => "This is the description for vehicle post number $i.",
                'price' => rand(500000, 3000000),
                'category_id' => rand(1, 3), // Assuming 1 = Cars, 2 = Bikes, 3 = Auto Parts
                'make_id' => rand(1, 19),
                'model_id' => rand(1, 28),
                'year' => rand(2005, 2024),
                'mileage' => rand(10000, 150000),
                'color' => ['red', 'blue', 'white', 'gray'][rand(0, 3)],
                'transmission_type' => ['automatic', 'manual'][rand(0, 1)],
                'fuel_type' => ['petrol', 'diesel', 'hybrid', 'electric'][rand(0, 3)],
                'body_type' => ['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'wagon', 'van', 'pickup', 'truck',][rand(0, 7)],
                'condition' => ['new', 'used'][rand(0, 1)],
                'city_id' => rand(1, 20), // Assuming 6 cities
                'location' => ['hv-13', 'phase-5', 'phase-8', 'blue-area', 'bahria', 'sadar'][rand(0, 5)],
                'vehicle_registration_id' => rand(1, 6), // 1 = registered, 2 = unregistered
                'features' => array_slice($featuresList, 0, rand(1, count($featuresList))),
                'images' => ['images/vehicles/sample1.jpg', 'images/vehicles/sample2.jpg'],
                'certified' => rand(0, 1),
                'managed_by_us' => rand(0, 1),
                'is_featured' => rand(0, 1),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
