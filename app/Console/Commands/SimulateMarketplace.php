<?php

namespace App\Console\Commands;

use App\Classes\StatusEnum;
use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Make;
use App\Models\VehicleModel;
use App\Models\City;
use App\Models\Post;
use App\Models\PostSale;

class SimulateMarketplace extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:simulate-marketplace';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Simulates fake marketplace activity: posts and sales';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->simulatePost();
        $this->simulateBuy();
        $this->info("Marketplace simulation run completed.");
    }

    private function simulatePost()
    {
        $fakeUser = User::where('is_fake_user', 1)->inRandomOrder()->first();
        $make = Make::inRandomOrder()->first();
        $model = VehicleModel::where('make_id', $make->id)->inRandomOrder()->first();
        $city = City::inRandomOrder()->first();

        $features = ['ABS', 'Sunroof', 'Navigation', 'Alloy Rims', 'Bluetooth', 'Backup Camera'];
        $locations = ['hv-13', 'phase-5', 'phase-8', 'blue-area', 'bahria', 'saddar'];
        $images = [
            'images/vehicles/sample1.jpg',
            'images/vehicles/sample2.jpg',
            'images/vehicles/sample3.jpg',
            'images/vehicles/sample4.jpg',
            'images/vehicles/sample5.jpg'
        ];

        Post::create([
            'user_id' => $fakeUser->id,
            'title' => "{$make->name} {$model->name} for Sale",
            'description' => "Clean and well-maintained {$make->name} {$model->name}.",
            'price' => rand(500000, 4000000),
            'category_id' => $make->category_id,
            'make_id' => $make->id,
            'model_id' => $model->id,
            'year' => rand(2005, 2023),
            'mileage' => rand(10000, 150000),
            'color' => ['red', 'blue', 'white', 'gray', 'black'][rand(0, 4)],
            'transmission_type' => ['automatic', 'manual'][rand(0, 1)],
            'fuel_type' => ['petrol', 'diesel', 'hybrid', 'electric'][rand(0, 3)],
            'body_type' => ['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'wagon', 'van', 'pickup', 'truck'][rand(0, 8)],
            'condition' => ['new', 'used'][rand(0, 1)],
            'city_id' => $city->id,
            'location' => $locations[array_rand($locations)],
            'vehicle_registration_id' => rand(1, 2),
            'features' => array_slice($features, 0, rand(1, count($features))),
            'images' => array_slice($images, 0, rand(1, 4)),
            'certified' => rand(0, 1),
            'managed_by_us' => rand(0, 1),
            'is_featured' => rand(0, 1),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->info("Simulated post created by {$fakeUser->name}");
    }

    private function simulateBuy()
    {
        // Only pick posts that haven't been sold yet
        $unsoldPost = Post::whereDoesntHave('sold')->inRandomOrder()->first();
        if (!$unsoldPost) return;

        $buyer = User::where('is_fake_user', 1)
            ->where('id', '!=', $unsoldPost->user_id)
            ->inRandomOrder()
            ->first();

        if (!$buyer) return;

        PostSale::create([
            'post_id' => $unsoldPost->id,
            'buyer_id' => $buyer->id,
            'sold_at' => now(),
            'status' => StatusEnum::SOLD
        ]);

        // Update the post's status
        $unsoldPost->update([
            'status' => StatusEnum::SOLD
        ]);

        $this->info("Simulated vehicle sold: Post #{$unsoldPost->id} by {$unsoldPost->user->name} to {$buyer->name}");
    }
}
