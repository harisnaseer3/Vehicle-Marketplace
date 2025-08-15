<?php

namespace App\Providers;

use App\Models\Deal;
use App\Observers\DealObserver;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Filesystem\Filesystem;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind('files', function () {
            return new Filesystem;
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

//        Inertia::share([
//            'auth' => [
//                'user' => fn () => Auth::user(),
//            ],
//        ]);
        Deal::observe(DealObserver::class);
    }
}
