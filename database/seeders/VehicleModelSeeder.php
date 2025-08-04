<?php

namespace Database\Seeders;

use App\Models\VehicleModel;
use Illuminate\Database\Seeder;

class VehicleModelSeeder extends Seeder
{
    public function run(): void
    {
        VehicleModel::insert([
            // Toyota (1)
            ['make_id' => 1, 'name' => 'Corolla', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 1, 'name' => 'Fortuner', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 1, 'name' => 'Yaris', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 1, 'name' => 'Hilux', 'created_at' => now(), 'updated_at' => now()],

            // Honda (2)
            ['make_id' => 2, 'name' => 'Civic', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 2, 'name' => 'City', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 2, 'name' => 'BR-V', 'created_at' => now(), 'updated_at' => now()],

            // Suzuki (3)
            ['make_id' => 3, 'name' => 'Mehran', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 3, 'name' => 'Alto', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 3, 'name' => 'Cultus', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 3, 'name' => 'Wagon R', 'created_at' => now(), 'updated_at' => now()],

            // Kia (4)
            ['make_id' => 4, 'name' => 'Sportage', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 4, 'name' => 'Picanto', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 4, 'name' => 'Sorento', 'created_at' => now(), 'updated_at' => now()],

            // Hyundai (5)
            ['make_id' => 5, 'name' => 'Tucson', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 5, 'name' => 'Elantra', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 5, 'name' => 'Sonata', 'created_at' => now(), 'updated_at' => now()],

            // Nissan (6)
            ['make_id' => 6, 'name' => 'Sunny', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 6, 'name' => 'Note', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 6, 'name' => 'Dayz', 'created_at' => now(), 'updated_at' => now()],

            // Mazda (7)
            ['make_id' => 7, 'name' => 'CX-5', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 7, 'name' => 'Mazda3', 'created_at' => now(), 'updated_at' => now()],

            // Chevrolet (8)
            ['make_id' => 8, 'name' => 'Optra', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 8, 'name' => 'Cruze', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 8, 'name' => 'Spark', 'created_at' => now(), 'updated_at' => now()],

            // BMW (9)
            ['make_id' => 9, 'name' => 'X5', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 9, 'name' => '3 Series', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 9, 'name' => '5 Series', 'created_at' => now(), 'updated_at' => now()],

            // Mercedes-Benz (10)
            ['make_id' => 10, 'name' => 'C-Class', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 10, 'name' => 'E-Class', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 10, 'name' => 'GLA', 'created_at' => now(), 'updated_at' => now()],

            // Audi (11)
            ['make_id' => 11, 'name' => 'A4', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 11, 'name' => 'A6', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 11, 'name' => 'Q5', 'created_at' => now(), 'updated_at' => now()],

            // Yamaha (12)
            ['make_id' => 12, 'name' => 'YBR 125', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 12, 'name' => 'YBZ 125', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 12, 'name' => 'R15 V3', 'created_at' => now(), 'updated_at' => now()],

            // Unique (13)
            ['make_id' => 13, 'name' => 'UD 70', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 13, 'name' => 'UD 100', 'created_at' => now(), 'updated_at' => now()],

            // Honda Bikes (14)
            ['make_id' => 14, 'name' => 'CD 70', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 14, 'name' => 'CG 125', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 14, 'name' => 'CB 150F', 'created_at' => now(), 'updated_at' => now()],

            // Suzuki Bikes (15)
            ['make_id' => 15, 'name' => 'GS 150', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 15, 'name' => 'GR 150', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 15, 'name' => 'GD 110S', 'created_at' => now(), 'updated_at' => now()],

            // Super Power (16)
            ['make_id' => 16, 'name' => 'SP 70', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 16, 'name' => 'SP Deluxe', 'created_at' => now(), 'updated_at' => now()],

            // Road Prince (17)
            ['make_id' => 17, 'name' => 'RP 70', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 17, 'name' => 'Robinson 150', 'created_at' => now(), 'updated_at' => now()],

            // Kawasaki (18)
            ['make_id' => 18, 'name' => 'Ninja 250', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 18, 'name' => 'ZX-6R', 'created_at' => now(), 'updated_at' => now()],

            // United (19)
            ['make_id' => 19, 'name' => 'US 70', 'created_at' => now(), 'updated_at' => now()],
            ['make_id' => 19, 'name' => 'US 125', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
