<?php
// Hauptseeder für die Datenbank
// Führt beim Ausführen von `php artisan db:seed` die angegebenen Seeder aus

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder{
    public function run(): void{
        $this->call([
            BloodValueDefinitionsTableSeeder::class, 
        ]);
    }
}
