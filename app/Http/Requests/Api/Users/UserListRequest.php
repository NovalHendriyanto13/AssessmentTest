<?php
namespace App\Http\Requests\Api\Users;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserListRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable'],
            'page' => ['nullable', 'integer'],
            'sortBy' => [
                'nullable',
                Rule::in(['name', 'email', 'created_at'])
            ],
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'page' => $this->page ?? 1,
        ]);
    }
}
