<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\Post;
use App\Models\User;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $posts = Post::all();
        $users = User::all();

        if ($posts->isEmpty() || $users->isEmpty()) {
            return;
        }

        $reviews = [
            [
                'title' => 'Excellent condition and smooth ride',
                'comment' => 'This Honda Civic exceeded my expectations. The engine runs smoothly, the interior is well-maintained, and the fuel efficiency is impressive. The seller was very honest about the vehicle\'s condition.',
                'rating' => 5
            ],
            [
                'title' => 'Great value for money',
                'comment' => 'Purchased this Toyota Corolla and couldn\'t be happier. The car is in excellent condition for its age, and the price was very reasonable. Highly recommend this seller.',
                'rating' => 4
            ],
            [
                'title' => 'Reliable and fuel efficient',
                'comment' => 'This Suzuki Swift is perfect for city driving. Great fuel economy, easy to park, and very reliable. The seller provided all maintenance records.',
                'rating' => 5
            ],
            [
                'title' => 'Good bike for daily commute',
                'comment' => 'The Honda CG 125 is perfect for daily commuting. Good fuel efficiency and low maintenance costs. The seller was very helpful during the purchase process.',
                'rating' => 4
            ],
            [
                'title' => 'Smooth engine and comfortable ride',
                'comment' => 'This Yamaha YBR 125 offers a smooth ride and good performance. The engine is well-maintained and the bike handles well in traffic.',
                'rating' => 4
            ],
            [
                'title' => 'Excellent family car',
                'comment' => 'The Toyota Hilux is perfect for family use. Spacious interior, good safety features, and reliable performance. The seller was very professional.',
                'rating' => 5
            ],
            [
                'title' => 'Great first car',
                'comment' => 'This Suzuki Swift is ideal for new drivers. Easy to handle, good visibility, and very economical. The seller was patient and answered all my questions.',
                'rating' => 4
            ],
            [
                'title' => 'Reliable motorcycle',
                'comment' => 'The Suzuki GS 150 is a reliable motorcycle with good performance. The seller maintained it well and provided all service records.',
                'rating' => 4
            ]
        ];

        foreach ($reviews as $reviewData) {
            // Get random post and user (different from post owner)
            $post = $posts->random();
            $reviewer = $users->where('id', '!=', $post->user_id)->random();

            Review::create([
                'user_id' => $post->user_id,
                'post_id' => $post->id,
                'reviewer_id' => $reviewer->id,
                'rating' => $reviewData['rating'],
                'title' => $reviewData['title'],
                'comment' => $reviewData['comment'],
                'is_verified' => true
            ]);
        }
    }
} 