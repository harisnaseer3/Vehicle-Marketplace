<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VehicleRegisterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('vehicle_register')->insert([
            ['province' => 'Punjab', 'status' => 'Registered', 'created_at' => now(), 'updated_at' => now()],
            ['province' => 'Sindh', 'status' => 'Registered', 'created_at' => now(), 'updated_at' => now()],
            ['province' => 'Khyber PakhtunKhwa', 'status' => 'Registered', 'created_at' => now(), 'updated_at' => now()],
            ['province' => 'Balochistan', 'status' => 'Registered', 'created_at' => now(), 'updated_at' => now()],
            ['province' => null, 'status' => 'Unregistered', 'created_at' => now(), 'updated_at' => now()],
            ['province' => null, 'status' => 'Applied for', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
