<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Dealer;
use App\Models\User;

class DealerSeeder extends Seeder
{
    public function run(): void
    {
        $dealers = [
            [
                'name' => 'Motorcycle World',
                'description' => 'Premium vehicle dealership with over 10 years of experience in the automotive industry.',
                'phone' => '+92 300 9876543',
                'email' => 'info@motorcycleworld.com',
                'website' => 'https://motorcycleworld.com',
                'address' => '123 Main Street, Gulberg III',
                'city' => 'Lahore',
                'rating' => 4.9,
                'reviews_count' => 89,
                'is_verified' => true,
                'is_featured' => true,
                'business_hours' => [
                    'monday' => '9:00 AM - 6:00 PM',
                    'tuesday' => '9:00 AM - 6:00 PM',
                    'wednesday' => '9:00 AM - 6:00 PM',
                    'thursday' => '9:00 AM - 6:00 PM',
                    'friday' => '9:00 AM - 6:00 PM',
                    'saturday' => '10:00 AM - 4:00 PM',
                    'sunday' => 'Closed'
                ],
                'services' => ['Sales', 'Service', 'Financing', 'Insurance']
            ],
            [
                'name' => 'Auto Excellence',
                'description' => 'Your trusted partner for quality vehicles and exceptional service.',
                'phone' => '+92 301 1234567',
                'email' => 'contact@autoexcellence.com',
                'website' => 'https://autoexcellence.com',
                'address' => '456 Commercial Area, DHA',
                'city' => 'Karachi',
                'rating' => 4.7,
                'reviews_count' => 156,
                'is_verified' => true,
                'is_featured' => true,
                'business_hours' => [
                    'monday' => '8:00 AM - 7:00 PM',
                    'tuesday' => '8:00 AM - 7:00 PM',
                    'wednesday' => '8:00 AM - 7:00 PM',
                    'thursday' => '8:00 AM - 7:00 PM',
                    'friday' => '8:00 AM - 7:00 PM',
                    'saturday' => '9:00 AM - 5:00 PM',
                    'sunday' => 'Closed'
                ],
                'services' => ['Sales', 'Service', 'Parts', 'Financing']
            ],
            [
                'name' => 'Premium Motors',
                'description' => 'Luxury and premium vehicle specialists with unmatched expertise.',
                'phone' => '+92 302 7654321',
                'email' => 'sales@premiummotors.com',
                'website' => 'https://premiummotors.com',
                'address' => '789 Business District, Blue Area',
                'city' => 'Islamabad',
                'rating' => 4.8,
                'reviews_count' => 234,
                'is_verified' => true,
                'is_featured' => true,
                'business_hours' => [
                    'monday' => '9:00 AM - 6:00 PM',
                    'tuesday' => '9:00 AM - 6:00 PM',
                    'wednesday' => '9:00 AM - 6:00 PM',
                    'thursday' => '9:00 AM - 6:00 PM',
                    'friday' => '9:00 AM - 6:00 PM',
                    'saturday' => '10:00 AM - 4:00 PM',
                    'sunday' => 'Closed'
                ],
                'services' => ['Luxury Sales', 'Premium Service', 'Financing', 'Insurance']
            ]
        ];

        foreach ($dealers as $dealerData) {
            // Create a user for each dealer
            $user = User::create([
                'name' => $dealerData['name'],
                'email' => $dealerData['email'],
                'password' => bcrypt('password'),
                'phone' => $dealerData['phone'],
                'address' => $dealerData['address'],
                'is_fake_user' => true
            ]);

            // Create dealer profile
            Dealer::create([
                'user_id' => $user->id,
                'name' => $dealerData['name'],
                'description' => $dealerData['description'],
                'phone' => $dealerData['phone'],
                'email' => $dealerData['email'],
                'website' => $dealerData['website'],
                'address' => $dealerData['address'],
                'city' => $dealerData['city'],
                'rating' => $dealerData['rating'],
                'reviews_count' => $dealerData['reviews_count'],
                'is_verified' => $dealerData['is_verified'],
                'is_featured' => $dealerData['is_featured'],
                'business_hours' => $dealerData['business_hours'],
                'services' => $dealerData['services']
            ]);
        }
    }
} 