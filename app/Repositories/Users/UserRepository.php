<?php
namespace App\Repositories\Users;

use App\Models\User;

class UserRepository
{
    public static function index($request)
    {
        return User::query()
            ->with('orders')
            ->select([
                'id', 'email', 'name', 'role', 'created_at'
            ])
            ->where('active', true)
            ->when(!empty($request->search), function($query) use ($request) {
                return $query->where(function($q) use ($request) {
                    return $q->orWhere('name', 'like', '%'.$request->search.'%')
                    ->orWhere('email', 'like', '%'.$request->search.'%');
                });
            })
            ->when(!empty($request->sortBy), function($query) use ($request) {
                return $query->orderBy($request->sortBy);
            })
            ->when(empty($request->sortBy), function($query) use ($request) {
                return $query->orderBy('created_at');
            });
    }

    public static function detail(int $id)
    {
        return User::query()
            ->select([
                'id', 'email', 'name', 'role', 'created_at'
            ])
            ->where('id', $id)
            ->first();
    }
}