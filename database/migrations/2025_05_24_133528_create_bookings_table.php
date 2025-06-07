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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_reference')->unique();
            
            // Guest information (user_id is optional)
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('guest_first_name');
            $table->string('guest_last_name');
            $table->string('guest_full_name')->virtualAs('CONCAT(guest_first_name, " ", guest_last_name)');
            $table->string('guest_email');
            $table->string('guest_phone')->nullable();
            $table->string('guest_country')->nullable();
            $table->text('guest_city')->nullable(); 
            $table->text('guest_zip_code')->nullable();
            $table->text('guest_gender')->nullable();

            
            // Package and pricing
            $table->foreignId('package_id')->constrained()->onDelete('cascade');
            $table->integer('pax_count');
            
            // Computed pricing breakdown
            $table->decimal('base_price', 10, 2);
            $table->decimal('activities_total', 10, 2);
            $table->decimal('computed_agent_addon', 10, 2);
            $table->decimal('computed_admin_addon', 10, 2);
            $table->decimal('total_price_per_person', 10, 2);
            $table->decimal('total_price', 10, 2);
            
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');

            $table->json('snapshots')->require();

            $table->string('access_token')->nullable()->unique();
            $table->timestamp('access_token_expires_at')->nullable();

            $table->timestamps();
            
            $table->index(['guest_email', 'status']);
            $table->index('package_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
