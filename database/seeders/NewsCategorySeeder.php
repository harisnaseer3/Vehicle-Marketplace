<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\NewsCategory;
use Illuminate\Support\Str;

class NewsCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Cars',
                'slug' => 'cars',
                'description' => 'Latest news and updates about cars and automobiles',
                'color' => '#3B82F6',
                'sort_order' => 1
            ],
            [
                'name' => 'Bikes',
                'slug' => 'bikes',
                'description' => 'Motorcycle news and industry updates',
                'color' => '#EF4444',
                'sort_order' => 2
            ],
            [
                'name' => 'Industry',
                'slug' => 'industry',
                'description' => 'Automotive industry news and trends',
                'color' => '#10B981',
                'sort_order' => 3
            ],
            [
                'name' => 'Technology',
                'slug' => 'technology',
                'description' => 'Latest automotive technology and innovations',
                'color' => '#8B5CF6',
                'sort_order' => 4
            ],
            [
                'name' => 'Reviews',
                'slug' => 'reviews',
                'description' => 'Vehicle reviews and comparisons',
                'color' => '#F59E0B',
                'sort_order' => 5
            ],
            [
                'name' => 'Tips & Advice',
                'slug' => 'tips-advice',
                'description' => 'Car maintenance tips and buying advice',
                'color' => '#06B6D4',
                'sort_order' => 6
            ]
        ];

        foreach ($categories as $category) {
            NewsCategory::create($category);
        }
    }
} 