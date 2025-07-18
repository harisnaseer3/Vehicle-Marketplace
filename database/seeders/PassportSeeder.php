<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class PassportSeeder extends Seeder
{
    public function run()
    {
        // Delete old clients
        DB::table('oauth_clients')->truncate();

        // Re-install passport (keys + clients)
        Artisan::call('passport:install', ['--force' => true]);
    }
}
