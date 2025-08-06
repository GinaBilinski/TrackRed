<?php

namespace App\Http\Controllers;

use App\Models\BloodTest;
use App\Models\BloodTestValue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BloodTestController extends Controller{
    
    // Speichert eine neue Blutuntersuchung mit mehreren Messwerten
    public function store(Request $request){
        $request->validate([
            'date' => 'required|date',
            'doctor' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'values' => 'required|array|min:1',
            'values.*.definition_id' => 'required|integer|exists:blood_value_definitions,id',
            'values.*.measured_value' => 'required|numeric',
            'values.*.unit' => 'required|string',
        ]);

        $test = BloodTest::create([
            'user_id' => Auth::id(),
            'date' => $request->date,
            'doctor' => $request->doctor,
            'location' => $request->location,
            'notes' => $request->notes,
        ]);

        foreach ($request->values as $value) {
            BloodTestValue::create([
                'blood_test_id' => $test->id,
                'blood_value_definition_id' => $value['definition_id'],
                'measured_value' => $value['measured_value'],
                'unit' => $value['unit'],
            ]);
        }
        return response()->json(['message' => 'Blutabnahme gespeichert'], 201);    
    }

    // Löscht eine vorhandene Untersuchung (inkl. Werte)
    public function destroy($id){
    $test = BloodTest::findOrFail($id);
    $test->delete();

    return response()->json(['message' => 'Untersuchung gelöscht']);}

    // Gibt alle Blutuntersuchungen des eingeloggten Nutzers zurück (inkl. zugehöriger Werte)
    public function index(){
    return BloodTest::with(['values.definition'])
        ->where('user_id', Auth::id())
        ->orderBy('date', 'desc')
        ->get();
    }
}
