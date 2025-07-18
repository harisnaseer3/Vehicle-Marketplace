<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::insert([
            ['name' => 'Cars', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Bikes', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Auto Parts', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
