<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller{

    // Registrierung eines neuen Benutzers
    public function register(Request $request){
        $request->validate([
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'first_name' => $request->first_name ?? '',
            'last_name' => $request->last_name ?? '',
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json($user, 201);
    }

    // Login – gibt Access-Token zurück
    public function login(Request $request){
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Falsche Zugangsdaten.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    // Gibt die aktuell eingeloggte Benutzerinfo zurück
    public function user(Request $request){
        return response()->json($request->user());
    }

    // Logout – löscht alle aktiven Tokens des Nutzers
    public function logout(Request $request){
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Erfolgreich ausgeloggt.']);
    }
}
