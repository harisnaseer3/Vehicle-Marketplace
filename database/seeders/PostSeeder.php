<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Post;
use App\Models\User;
use App\Models\VehicleModel;
use App\Models\Make;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fakeUserIds = User::where('is_fake_user', true)->pluck('id')->toArray();
        $cityIds = City::pluck('id')->toArray();

        // Using your specific sample images
        $imagePool = [
            'images/vehicles/sample1.jpg',
            'images/vehicles/sample2.jpg',
            'images/vehicles/sample3.jpg',
            'images/vehicles/sample4.jpg',
            'images/vehicles/sample5.jpg',
        ];

        // Organized features by category
        $featuresList = [
            'safety' => ['ABS', 'Airbags', 'Parking Sensors', 'Backup Camera'],
            'comfort' => ['Climate Control', 'Cruise Control', 'Rear AC Vents', 'Sunroof'],
            'tech' => ['Navigation', 'Bluetooth', 'Touchscreen Display'],
            'interior' => ['Leather Seats', 'Power Windows', 'Keyless Entry'],
            'exterior' => ['Alloy Rims', 'Power Steering']
        ];

        // Pakistani-specific color names
        $colors = [
            'White Pearl', 'Silver Metallic', 'Solid Black', 'Graphite Gray',
            'Sapphire Blue', 'Ruby Red', 'Mocha Brown', 'Golden Sand'
        ];

        // Enhanced location mapping
        $locations = [
            'Karachi' => ['DHA Phase 1-8', 'Clifton Block 5', 'Gulshan-e-Iqbal', 'North Nazimabad', 'Malir Cantt'],
            'Lahore' => ['DHA Phase 1-6', 'Gulberg Main Boulevard', 'Model Town A-Block', 'Johar Town', 'Cantt'],
            'Islamabad' => ['F-7 Markaz', 'F-8/4', 'G-9/1', 'G-10/4', 'DHA Phase 2'],
            'Rawalpindi' => ['Bahria Town Phase 7', 'Satellite Town', 'Westridge', 'Raja Bazaar'],
            'Faisalabad' => ['D-Type Colony', 'Madina Town F-Block', 'Peoples Colony No.1', 'Jinnah Colony']
        ];

        for ($i = 1; $i <= 100; $i++) {
            $makeId = rand(1, 19);
            $modelIds = VehicleModel::where('make_id', $makeId)->pluck('id')->toArray();

            if (empty($modelIds)) {
                continue;
            }

            $cityId = $cityIds[array_rand($cityIds)];
            $cityName = City::find($cityId)->name;
            $cityAreas = $locations[$cityName] ?? ['Main Boulevard', 'Commercial Area'];

            // Generate images - always at least one, max 3 unique images
            $selectedImages = [];
            $selectedImages[] = $imagePool[array_rand($imagePool)];
            if (rand(0, 1)) {
                $newImage = $imagePool[array_rand($imagePool)];
                if (!in_array($newImage, $selectedImages)) {
                    $selectedImages[] = $newImage;
                }
            }
            if (rand(0, 1)) {
                $newImage = $imagePool[array_rand($imagePool)];
                if (!in_array($newImage, $selectedImages) && count($selectedImages) < 3) {
                    $selectedImages[] = $newImage;
                }
            }

            // Generate features - at least 2 from different categories
            $selectedFeatures = [];
            $categories = array_keys($featuresList);
            shuffle($categories);

            foreach (array_slice($categories, 0, rand(2, 4)) as $category) {
                $feature = $featuresList[$category][array_rand($featuresList[$category])];
                if (!in_array($feature, $selectedFeatures)) {
                    $selectedFeatures[] = $feature;
                }
            }

            Post::create([
                'user_id' => $fakeUserIds[array_rand($fakeUserIds)],
                'title' => $this->generatePostTitle($makeId, $modelIds[array_rand($modelIds)]),
                'description' => $this->generatePostDescription(),
                'price' => $this->generateRealisticPrice($makeId),
                'category_id' => rand(1, 3),
                'make_id' => $makeId,
                'model_id' => $modelIds[array_rand($modelIds)],
                'year' => $this->generateYear(),
                'mileage' => $this->generateMileage(),
                'color' => $colors[array_rand($colors)],
                'transmission_type' => $this->getTransmissionType(),
                'fuel_type' => $this->getFuelType(),
                'body_type' => $this->getBodyType(),
                'condition' => $this->getCondition(),
                'city_id' => $cityId,
                'location' => $cityAreas[array_rand($cityAreas)],
                'vehicle_registration_id' => rand(1, 2),
                'features' => $selectedFeatures,
                'images' => $selectedImages,
                'certified' => rand(0, 1),
                'managed_by_us' => rand(0, 1),
                'is_featured' => rand(0, 1),
                'created_at' => now()->subDays(rand(0, 30)), // Posts from last 30 days
                'updated_at' => now(),
            ]);
        }
    }

    protected function generatePostTitle($makeId, $modelId): string
    {
        $make = Make::find($makeId)->name;
        $model = VehicleModel::find($modelId)->name;
        $year = rand(2015, 2023);

        $templates = [
            "{$year} {$make} {$model} | Well Maintained | Clean History",
            "Immaculate {$make} {$model} - Low Mileage - Original Owner",
            "Genuine {$make} {$model} for Sale in Excellent Condition",
            "Certified {$make} {$model} | Full Options | Warranty",
            "Urgent Sale: {$year} {$make} {$model} - Bargain Price"
        ];

        return $templates[array_rand($templates)];
    }

    protected function generatePostDescription(): string
    {
        $descriptions = [
            "This vehicle has been meticulously maintained with complete service records from authorized dealership. Never involved in any accident, original paint with no touch-ups. All features are in perfect working condition. Serious inquiries only.",
            "Low mileage vehicle owned by a careful owner. Always garaged and serviced on time. No mechanical issues, AC blows ice cold. All original parts with no modifications. Price slightly negotiable for genuine buyers.",
            "Rare opportunity to own this well-maintained vehicle. Full service history available. Single owner, non-smoker, no pets. All electronics functioning perfectly. Inspection and test drive welcome.",
            "Excellent condition vehicle with no hidden faults. Recent complete service including all fluids and filters changed. Interior is spotless with no stains or odors. Competitive pricing for quick sale.",
            "Well-cared-for vehicle with all maintenance up to date. Never used for commercial purposes. All accessories included. Available for immediate sale to serious buyer only."
        ];

        return $descriptions[array_rand($descriptions)];
    }

    protected function generateRealisticPrice($makeId): int
    {
        $make = Make::find($makeId)->name;

        // Base prices for popular Pakistani makes
        $priceRanges = [
            'Toyota' => ['Corolla' => [2500000, 4500000], 'Hilux' => [6000000, 10000000]],
            'Honda' => ['Civic' => [3000000, 5500000], 'City' => [2000000, 4000000]],
            'Suzuki' => ['Mehran' => [800000, 1500000], 'Cultus' => [1500000, 2500000]],
            'default' => [1200000, 3500000]
        ];

        $model = VehicleModel::where('make_id', $makeId)->inRandomOrder()->first();

        if (isset($priceRanges[$make][$model->name])) {
            $range = $priceRanges[$make][$model->name];
        } else {
            $range = $priceRanges['default'];
        }

        return rand($range[0], $range[1]);
    }

    protected function generateYear(): int
    {
        // Weighted towards newer years
        $years = array_merge(
            range(2020, 2023), // 40% chance
            range(2015, 2019), // 35% chance
            range(2005, 2014)  // 25% chance
        );

        return $years[array_rand($years)];
    }

    protected function generateMileage(): int
    {
        // Mileage based on vehicle age (simulated)
        $base = rand(5000, 15000); // Annual mileage
        $age = 2023 - $this->generateYear();
        return $base * max(1, $age); // At least 1 year
    }

    protected function getTransmissionType(): string
    {
        // 60% automatic, 40% manual in Pakistan
        return (rand(1, 10) <= 6) ? 'automatic' : 'manual';
    }

    protected function getFuelType(): string
    {
        // Pakistani market distribution
        $types = [
            'petrol', 'petrol', 'petrol', // 60%
            'diesel', 'diesel',           // 30%
            'hybrid',                     // 7%
            'electric'                    // 3%
        ];

        return $types[array_rand($types)];
    }

    protected function getBodyType(): string
    {
        // Common body types in Pakistan
        $types = [
            'sedan', 'sedan', 'sedan',
            'suv', 'suv',
            'hatchback',
            'pickup',
            'van',
            'coupe'
        ];

        return $types[array_rand($types)];
    }

    protected function getCondition(): string
    {
        // 80% used, 20% new in Pakistani market
        return (rand(1, 10) <= 2) ? 'new' : 'used';
    }
}
