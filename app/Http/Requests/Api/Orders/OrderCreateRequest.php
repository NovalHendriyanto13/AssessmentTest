<?php
namespace App\Http\Requests\Api\Orders;

use Illuminate\Foundation\Http\FormRequest;

class OrderCreateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer'],
            'name' => ['required'],
            'order_id' => ['required', 'unique:orders,order_id'],
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'created_at' => date('now'),
        ]);
    }
}