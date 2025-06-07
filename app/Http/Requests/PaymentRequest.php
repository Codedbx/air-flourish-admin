<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // 'gateway' => 'required|in:stripe,paystack',
            // 'customer_data' => 'required|array',
            // 'customer_data.email' => 'required|email',
            // 'customer_data.name' => 'required|string',
            'reference' => ['required', 'string', 'max:255'],
            'gateway' => ['required', 'string', 'in:stripe,paystack,espees'],
            'return_url' => ['required', 'string'],
            'cancel_url' => ['required', 'string'],
        ];
    }
}
