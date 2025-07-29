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
            ['name' => 'Multan', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Quetta', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Sialkot', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Gujranwala', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Bahawalpur', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Sargodha', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Abbottabad', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Mardan', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Hyderabad', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Mingora', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Mirpur', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Jhelum', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Okara', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Dera Ghazi Khan', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

}
