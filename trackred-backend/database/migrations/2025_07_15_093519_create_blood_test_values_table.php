<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('blood_test_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blood_test_id')->constrained()->onDelete('cascade');
            $table->foreignId('blood_value_definition_id')->constrained()->onDelete('cascade');
            $table->decimal('measured_value', 8, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blood_test_values');
    }
};
