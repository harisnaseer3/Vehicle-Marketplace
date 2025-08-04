<?php

namespace Database\Seeders;

use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\VehicleModel;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

//        User::factory()->create([
//            'name' => 'Test User',
//            'email' => 'test@example.com',
//        ]);

        $this->call([
//            PassportSeeder::class,
            UserSeeder::class,
            FakeUserSeeder::class,
            RolePermissionSeeder::class,
            CitySeeder::class,
            CategorySeeder::class,
            MakeSeeder::class,
            VehicleModelSeeder::class,
            VehicleRegisterSeeder::class,
            PostSeeder::class,
            DealerSeeder::class,
            NewsCategorySeeder::class,
            NewsArticleSeeder::class,
            ReviewSeeder::class,
        ]);
    }
}
