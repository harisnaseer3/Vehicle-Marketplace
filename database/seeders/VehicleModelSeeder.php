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
            // Toyota
            ['make_id' => 1, 'name' => 'Corolla', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 1, 'name' => 'Fortuner', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 1, 'name' => 'Yaris', 'created_at' => now(), 'updated_at' => now()],

            // Honda (Car)
            ['make_id' => 2, 'name' => 'Civic', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 2, 'name' => 'City', 'created_at' => now(), 'updated_at' => now()],

            // Suzuki (Car)
            ['make_id' => 3, 'name' => 'Mehran', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 3, 'name' => 'Alto', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 3, 'name' => 'Cultus', 'created_at' => now(), 'updated_at' => now()],

            // Kia
            ['make_id' => 4, 'name' => 'Sportage', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 4, 'name' => 'Picanto', 'created_at' => now(), 'updated_at' => now()],

            // Hyundai
            ['make_id' => 5, 'name' => 'Tucson', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 5, 'name' => 'Elantra', 'created_at' => now(), 'updated_at' => now()],

            // Nissan
            ['make_id' => 6, 'name' => 'Sunny', 'created_at' => now(), 'updated_at' => now()],

            // Mazda
            ['make_id' => 7, 'name' => 'CX-5', 'created_at' => now(), 'updated_at' => now()],

            // Chevrolet
            ['make_id' => 8, 'name' => 'Optra', 'created_at' => now(), 'updated_at' => now()],

            // BMW
            ['make_id' => 9, 'name' => 'X5', 'created_at' => now(), 'updated_at' => now()],

            // Mercedes-Benz
            ['make_id' => 10, 'name' => 'C-Class', 'created_at' => now(), 'updated_at' => now()],

            // Audi
            ['make_id' => 11, 'name' => 'A4', 'created_at' => now(), 'updated_at' => now()],

            // Yamaha (Bike)
            ['make_id' => 12, 'name' => 'YBR 125', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 12, 'name' => 'YBZ 125', 'created_at' => now(), 'updated_at' => now()],

            // Unique
            ['make_id' => 13, 'name' => 'UD 70', 'created_at' => now(), 'updated_at' => now()],

            // Honda (Bike)
            ['make_id' => 14, 'name' => 'CD 70', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 14, 'name' => 'CG 125', 'created_at' => now(), 'updated_at' => now()],

            // Suzuki (Bike)
            ['make_id' => 15, 'name' => 'GS 150', 'created_at' => now(), 'updated_at' => now()],

            // Super Power
            ['make_id' => 16, 'name' => 'SP 70', 'created_at' => now(), 'updated_at' => now()],

            // Road Prince
            ['make_id' => 17, 'name' => 'RP 70', 'created_at' => now(), 'updated_at' => now()],

            // Kawasaki
            ['make_id' => 18, 'name' => 'Ninja 250', 'created_at' => now(), 'updated_at' => now()],

            // United
            ['make_id' => 19, 'name' => 'US 70', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
