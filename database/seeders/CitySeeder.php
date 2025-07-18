<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        City::insert([
            ['name' => 'Islamabad', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Lahore', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Karachi', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Rawalpindi', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Faisalabad', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Peshawar', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

}
