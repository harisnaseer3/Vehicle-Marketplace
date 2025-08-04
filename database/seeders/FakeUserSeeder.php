<?php

namespace Database\Seeders;

use Faker\Factory;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Str;

class FakeUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Factory::create('ur_PK'); // Urdu/Pakistan locale

        for ($i = 1; $i <= 100; $i++) {
            User::create([
                'name' => $faker->name(),
                'email' => $faker->unique()->safeEmail(),
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
                'phone' => '03' . rand(10000000, 99999999), // 03XX-XXXXXXX format
                'address' => $faker->city(),
                'is_fake_user' => 1,
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
