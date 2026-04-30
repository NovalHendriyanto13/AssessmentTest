<?php
namespace App\Http\Controllers\Api\Users;

use App\Http\Controllers\Api\ApiBaseController;
use Illuminate\Support\Facades\Hash;
// Requests and DTO
use App\Http\Requests\Api\Users\UserListRequest;
use App\Http\DTO\Api\Users\UserListDTO;
use App\Http\Requests\Api\Users\UserCreateRequest;
// Models
use App\Repositories\Users\UserRepository;
use App\Models\User;
// Job
use App\Jobs\CreateUserMailJob;

class UserController extends ApiBaseController
{
    public function index(UserListRequest $request)
    {
        $fetch = UserRepository::index($request);
        $data = $fetch->paginate(10);
        
        $collections = UserListDTO::fromPaginator($data, 'users');

        return $this->successResponse($collections->toArray());
    }

    public function create(UserCreateRequest $request)
    {
        $data = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        if (!$data) {
            return $this->errorResponse(500, 'Failed to store data');
        }
        
        // put queue here
        CreateUserMailJob::dispatch($data)->onQueue('newUserSendEmail');
        
        return $this->successResponse($data);
    }

    public function detail(int $id)
    {
        $data = UserRepository::detail($id);

        if (!$data) {
            return $this->errorResponse(500, 'No Data user found');
        }

        return $this->successResponse($data);
    }
}