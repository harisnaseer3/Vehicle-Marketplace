<?php

namespace Database\Seeders;

use App\Models\VehicleModel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VehicleModelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        VehicleModel::insert([
            ['make_id' => 1, 'name' => 'Corolla', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 1, 'name' => 'Fortuner', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 2, 'name' => 'Civic', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 2, 'name' => 'City', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 3, 'name' => 'Mehran', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 3, 'name' => 'Alto', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 4, 'name' => 'Sportage', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 5, 'name' => 'YBR 125', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 6, 'name' => 'Unique UD 70', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
