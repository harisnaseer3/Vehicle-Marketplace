<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('app'); // your app.blade.php file
})->where('any', '.*');
