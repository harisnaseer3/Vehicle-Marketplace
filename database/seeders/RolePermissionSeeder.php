<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        //create roles
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $moderator = Role::firstOrCreate(['name' => 'moderator']);
        $seller = Role::firstOrCreate(['name' => 'seller']);
        $buyer = Role::firstOrCreate(['name' => 'buyer']);
        $dealer = Role::firstOrCreate(['name' => 'dealer']);
        $guest = Role::firstOrCreate(['name' => 'guest']);
        $user = Role::firstOrCreate(['name' => 'user']);

        // Create permissions
        $permissions = [
            // Admin Permissions

            'home',
            'dashboard',
            'manage-users',
            'suspend-users',

            //listings
            'create-listings',
            'edit-own-listings',
            'delete-own-listings',
            'manage-listings',
            'approve-listings',
            'delete-listings',
            'view-messages',
            'manage-roles',

            // Buyer
            'make-offer',
            'send-messages',
            'favorite-vehicle',

            //vehicle
            'delete-vehicle',
            'approve-vehicle',
            'show-vehicle',
            'reject-vehicle',


            //Dealer (inherits seller)
            'create-multiple-listings',
            'access-dealer-panel',
            'promote-listing',

        ];

        // Create all permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Sync all permissions with admin role
        $admin->givePermissionTo(Permission::all());

        // Assign specific permissions to moderator
        $moderatorPermission = [
            'suspend-users',
            'approve-listings',

        ];
        $moderator->givePermissionTo($moderatorPermission);

        // Assign specific permissions to seller
        $seller->syncPermissions([
            'create-listings',
            'edit-own-listings',
            'delete-own-listings',
            'view-messages',
        ]);

        // Assign specific permissions to buyer
        $buyer->syncPermissions([
            'make-offer',
            'send-messages',
            'favorite-vehicle',
        ]);

        // Assign specific permissions to dealer
        $dealer->syncPermissions([
            'create-multiple-listings',
            'access-dealer-panel',
            'promote-listing',
        ]);

        // Assign specific permissions to guest
        $guest->syncPermissions([]);

        // Assign specific permissions to user
        $user->syncPermissions([]);
    }
}
