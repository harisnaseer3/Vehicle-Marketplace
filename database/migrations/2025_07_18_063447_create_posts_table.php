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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('city_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('make_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('model_id')->nullable()->constrained('models')->onDelete('set null');
            $table->foreignId('vehicle_registration_id')->nullable()->constrained('vehicle_register')->onDelete('set null');
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->year('year');
            $table->integer('mileage')->nullable();
            $table->string('color')->nullable();
            $table->string('transmission_type')->nullable();
            $table->string('fuel_type')->nullable();
            $table->string('body_type')->nullable();
            $table->string('condition')->nullable();
            $table->string('location')->nullable();
            $table->json('features')->nullable();
            $table->json('images')->nullable();
            $table->integer('is_featured')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
