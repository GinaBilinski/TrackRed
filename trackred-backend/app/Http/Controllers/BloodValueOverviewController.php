<?php

// Controller für die Übersicht aller Blutwerte eines Nutzers
// Liefert alle Definitionen + alle dazugehörigen Werte mit Metadaten
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\BloodValueDefinition;

class BloodValueOverviewController extends Controller{
    public function index(){
    $userId = Auth::id();

    // Alle Blutwert-Definitionen laden, inklusive ihrer Werte
    $definitions = BloodValueDefinition::with(['values.bloodTest' => function ($query) use ($userId) {
        $query->where('user_id', $userId);
    }])->get();

    // Werte nach Datum sortieren und strukturieren
    $result = $definitions->map(function ($def) {
    $values = $def->values
        ->filter(function ($val) {
            return $val->bloodTest !== null;
        })
        ->map(function ($val) {
            return [
                'measured_value' => $val->measured_value,
                'unit' => $val->unit,
                'date' => $val->bloodTest->date,
                'doctor' => $val->bloodTest->doctor,
                'location' => $val->bloodTest->location,
                'blood_test_id' => $val->bloodTest->id,
            ];
        })
        ->sortByDesc('date')
        ->values();

        return [
            'id' => $def->id,
            'name' => $def->name,
            'unit' => $def->unit,
            'reference_min' => $def->reference_min,
            'reference_max' => $def->reference_max,
            'info' => $def->info,
            'conversion_factors' => $def->conversion_factors, 
            'values' => $values,
            'latest_value' => $values->first()['measured_value'] ?? null,
            'latest_date' => $values->first()['date'] ?? null,
        ];
    });
    // Rückgabe aller strukturierten Blutwerte als JSON
    return response()->json($result->values()); 
    }
}
