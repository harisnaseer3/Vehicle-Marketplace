<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicle_register', function (Blueprint $table) {
            $table->id();
            $table->string('province')->nullable()->comment(' Punjab, Sindh, etc');
            $table->enum('status', ['registered', 'unregistered', 'Applied for']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_register');
    }
};
