<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Model implements AuthenticatableContract, JWTSubject
{
    use Authenticatable;

    protected $fillable = ['name', 'email', 'password'];
    protected $hidden = ['password'];

    // 🔹 Required methods for JWTSubject
    public function getJWTIdentifier()
    {
        return $this->getKey(); // typically the primary key
    }

    public function getJWTCustomClaims()
    {
        return []; // add custom claims if needed
    }
}
