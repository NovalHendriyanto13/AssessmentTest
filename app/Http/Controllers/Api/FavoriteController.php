<?php

namespace App\Http\Controllers\Api;

use App\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends ApiBaseController
{
    public function index()
    {
        $favorites = auth()->user()->favorites()->latest()->get();
        return $this->_successResponse($favorites);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'imdb_id' => 'required|string',
            'title'   => 'required|string',
            'year'    => 'nullable|string',
            'type'    => 'nullable|string',
            'poster'  => 'nullable|string',
        ]);

        $favorite = auth()->user()->favorites()->updateOrCreate(
            ['imdb_id' => $validated['imdb_id']],
            $validated
        );

        return $this->_successResponse($favorite, 'ID', 'Movie added to favorites');
    }

    public function destroy($imdbId)
    {
        $deleted = auth()->user()->favorites()->where('imdb_id', $imdbId)->delete();

        if ($deleted) {
            return $this->_successResponse(null, 'ID', 'Movie removed from favorites');
        }

        return $this->_errorResponse(null, 404, 'ID', 'Movie not found in favorites');
    }
}
