<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
 public function up(): void
    {
        Schema::table('blood_value_definitions', function (Blueprint $table) {
            $table->json('allowed_units')->nullable();
            $table->json('conversion_factors')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('blood_value_definitions', function (Blueprint $table) {
            $table->dropColumn('allowed_units');
            $table->dropColumn('conversion_factors');
        });
    }
};
