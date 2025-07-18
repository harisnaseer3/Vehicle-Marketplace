<?php

namespace Database\Seeders;

use App\Models\Make;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MakeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Make::insert([
            ['category_id' => 1, 'name' => 'Toyota', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 1, 'name' => 'Honda', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 1, 'name' => 'Suzuki', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 1, 'name' => 'Kia', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 2, 'name' => 'Yamaha', 'created_at' => now(), 'updated_at' => now()], // for bikes
            ['category_id' => 2, 'name' => 'Unique', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
