<?php

namespace Tests\Feature;

use App\User;
use App\Favorite;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MovieAndFavoriteTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = factory(User::class)->create([
            'username' => 'testuser',
        ]);
    }

    private function getHeaders()
    {
        $token = auth()->login($this->user);
        return [
            'Authorization' => 'Bearer ' . $token,
        ];
    }

    public function test_user_can_add_movie_to_favorites()
    {
        $response = $this->withHeaders($this->getHeaders())
            ->postJson('/api/favorites', [
                'imdb_id' => 'tt0111161',
                'title' => 'The Shawshank Redemption',
                'year' => '1994',
                'type' => 'movie',
                'poster' => 'https://image.com/poster.jpg',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Movie added to favorites',
            ]);

        $this->assertDatabaseHas('favorites', [
            'user_id' => $this->user->id,
            'imdb_id' => 'tt0111161',
            'title' => 'The Shawshank Redemption',
        ]);
    }

    public function test_user_can_list_favorites()
    {
        factory(User::class)->create(); // other user
        
        Favorite::create([
            'user_id' => $this->user->id,
            'imdb_id' => 'tt0111161',
            'title' => 'The Shawshank Redemption',
            'year' => '1994',
            'type' => 'movie',
            'poster' => 'https://image.com/poster.jpg',
        ]);

        $response = $this->withHeaders($this->getHeaders())
            ->getJson('/api/favorites');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment([
                'imdb_id' => 'tt0111161',
                'title' => 'The Shawshank Redemption',
            ]);
    }

    public function test_user_can_remove_movie_from_favorites()
    {
        Favorite::create([
            'user_id' => $this->user->id,
            'imdb_id' => 'tt0111161',
            'title' => 'The Shawshank Redemption',
            'year' => '1994',
            'type' => 'movie',
            'poster' => 'https://image.com/poster.jpg',
        ]);

        $response = $this->withHeaders($this->getHeaders())
            ->deleteJson('/api/favorites/tt0111161');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Movie removed from favorites',
            ]);

        $this->assertDatabaseMissing('favorites', [
            'user_id' => $this->user->id,
            'imdb_id' => 'tt0111161',
        ]);
    }

    public function test_unauthenticated_user_cannot_access_favorites()
    {
        $response = $this->getJson('/api/favorites');
        $response->assertStatus(401);
    }
}
