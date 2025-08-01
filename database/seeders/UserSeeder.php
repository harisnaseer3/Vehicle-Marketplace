<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        $admin = User::firstOrCreate([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'phone' => '03441518890',
            'address' => 'ABC, Islamabad',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $admin->assignRole($adminRole);

        $user = User::firstOrCreate([
            'name' => 'User',
            'email' => 'user@user.com',
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'phone' => '03441518891',
            'address' => 'ABC, Islamabad',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $user->assignRole($userRole);
    }
}
