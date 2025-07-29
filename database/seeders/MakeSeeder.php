<?php

namespace Database\Seeders;

use App\Models\Make;
use Illuminate\Database\Seeder;

class MakeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Make::insert([
            // Car Makes
            ['category_id' => 1, 'name' => 'Toyota', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 1, 'name' => 'Honda', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 1, 'name' => 'Suzuki', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 1, 'name' => 'Kia', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 1, 'name' => 'Hyundai', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 1, 'name' => 'Nissan', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 1, 'name' => 'Mazda', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 1, 'name' => 'Chevrolet', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 1, 'name' => 'BMW', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 1, 'name' => 'Mercedes-Benz', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 1, 'name' => 'Audi', 'created_at' => now(), 'updated_at' => now()],

            // Bike Makes
            ['category_id' => 2, 'name' => 'Yamaha', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 2, 'name' => 'Unique', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 2, 'name' => 'Honda', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 2, 'name' => 'Suzuki', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 2, 'name' => 'Super Power', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 2, 'name' => 'Road Prince', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 2, 'name' => 'Kawasaki', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 2, 'name' => 'United', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
