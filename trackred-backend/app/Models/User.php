<?php
// Modell für registrierte Nutzer
// Verwaltet Login-Daten und ist mit Untersuchungen verknüpft

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable{
    use HasApiTokens, HasFactory, Notifiable;

    // Erlaubte Felder für Massenbearbeitung
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
    ];

    // Felder, die bei JSON-Ausgabe versteckt werden
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Typumwandlungen (z. B. für Datum und Passwort)
    protected function casts(): array{
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
