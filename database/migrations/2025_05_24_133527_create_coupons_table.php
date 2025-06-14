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
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->enum('discount_type', ['fixed', 'percentage']);
            $table->decimal('discount_value', 10, 2);
            $table->date('expires_at')->nullable();
            $table->foreignId('owner_id')->constrained('users');
            $table->unsignedInteger('max_uses')->nullable();
            $table->boolean('is_global')->default(false)
                  ->comment('If true, applies to ALL packages owned by owner_id');
            $table->boolean('is_active')
                  ->default(true)
                  ->comment('Only active coupons can be used');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
