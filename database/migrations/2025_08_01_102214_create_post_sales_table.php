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
        Schema::create('post_sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->onDelete('cascade');

            // Make sure it's nullable BEFORE setting foreign key rule
            $table->foreignId('buyer_id')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');

            $table->timestamp('sold_at')->nullable();
            $table->string('status')->default('sold');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_sales');
    }
};
