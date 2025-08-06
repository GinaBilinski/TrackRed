<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BloodValueDefinition;

// Gibt alle verfügbaren Blutwert-Definitionen zurück
class BloodValueDefinitionController extends Controller
{
    public function index(){
        return response()->json(BloodValueDefinition::all());
    }
}
