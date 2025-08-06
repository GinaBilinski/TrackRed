<?php
// Modell für einen gemessenen Einzelwert innerhalb einer Blutuntersuchung
// Verknüpft eine Untersuchung mit einer Wertedefinition und speichert den gemessenen Wert
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BloodTestValue extends Model{
    use HasFactory;

    protected $fillable = [
        'blood_test_id',
        'blood_value_definition_id',
        'measured_value',
        'unit',
    ];

    // Beziehung zur übergeordneten Blutuntersuchung
    public function bloodTest(){
        return $this->belongsTo(BloodTest::class);
    }

    // Beziehung zur Wertedefinition (z. B. Hämoglobin, Ferritin etc.)
    public function definition(){
        return $this->belongsTo(BloodValueDefinition::class, 'blood_value_definition_id');
    }
}
