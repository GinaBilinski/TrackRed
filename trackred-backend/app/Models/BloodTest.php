<?php
// Modell für eine Blutuntersuchung
// Enthält Metadaten (Datum, Arzt, Ort) und Beziehung zum Benutzer und zu den Werten

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BloodTest extends Model{
    use HasFactory;

    // Erlaubte Felder für Bearbeitung
    protected $fillable = [
        'user_id',
        'date',
        'doctor',
        'location',
        'notes',
    ];

    // Beziehung zur User-Tabelle (jede Untersuchung gehört zu einem User)
    public function user(){
        return $this->belongsTo(User::class);
    }

    // Beziehung zu den gemessenen Einzelwerten (BloodTestValues)
    public function values(){
        return $this->hasMany(BloodTestValue::class);
    }
}
