<?php
use Illuminate\Database\Seeder;
use App\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name'     => 'aldmic',
            'email'    => 'aldmic@example.com',
            'username' => 'aldmic',
            'password' => Hash::make('123abc123'),
        ]);
    }
}