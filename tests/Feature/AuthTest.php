<?php

namespace Tests\Feature;

use App\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_with_valid_credentials()
    {
        $user = factory(User::class)->create([
            'username' => 'aldmic_test',
            'email' => 'test@example.com',
            'password' => Hash::make('secret12345'),
        ]);

        $response = $this->postJson('/api/login', [
            'username' => 'aldmic_test',
            'password' => 'secret12345',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'locale',
                'message',
                'data' => [
                    'access_token',
                    'token_type',
                ]
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'token_type' => 'bearer',
                ]
            ]);
    }

    public function test_user_cannot_login_with_invalid_password()
    {
        $user = factory(User::class)->create([
            'username' => 'aldmic_test',
            'email' => 'test@example.com',
            'password' => Hash::make('secret12345'),
        ]);

        $response = $this->postJson('/api/login', [
            'username' => 'aldmic_test',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(411)
            ->assertJson([
                'success' => false,
                'data' => [
                    'error' => 'Unauthorized / Invalid Credentials',
                ]
            ]);
    }

    public function test_login_validation_requires_username_and_password()
    {
        $response = $this->postJson('/api/login', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['username', 'password']);
    }
}
