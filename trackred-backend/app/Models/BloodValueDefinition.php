<?php
// Modell für die Definition eines Blutwerts (z. B. Hämoglobin, Ferritin)
// Enthält Referenzbereiche, Standard-Einheit und Umrechnungsfaktoren

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BloodValueDefinition extends Model{
    protected $table = 'blood_value_definitions';

    protected $fillable = [
        'name',
        'unit',
        'reference_min',
        'reference_max',
        'info',
        'conversion_factors', 
    ];

    // Automatisches Parsen von JSON-Spalte in ein Array
    protected $casts = [
        'conversion_factors' => 'array',
    ];

    // Beziehung zu allen gemessenen Werten, die dieser Definition zugeordnet sind
    public function values(){
        return $this->hasMany(BloodTestValue::class, 'blood_value_definition_id');
    }
}