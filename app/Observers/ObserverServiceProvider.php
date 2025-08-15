<?php

namespace App\Observers;

use App\Models\Deal;
use Illuminate\Support\ServiceProvider;

class ObserverServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Deal::observe(DealObserver::class);
    }
}
