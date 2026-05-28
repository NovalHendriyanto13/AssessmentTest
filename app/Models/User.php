<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Casts\Attribute;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    protected function canEdit(): Attribute
    {
        return Attribute::make(
            get: function() {
                $canEdit = false;
        
                $authUser = auth('api')->user();
                $authUserRole = trim(strtolower($authUser->role));

                if ($authUserRole == 'administrator') {
                    $canEdit = true;
                } else if ($authUserRole == 'manager') {
                    if (trim(strtolower($this->role)) == 'user') {
                        $canEdit = true;
                    }
                } else {
                    if ($this->email === $authUser->email) {
                        $canEdit = true;
                    }
                }
                return $canEdit;
            }
        );
    }
}
