<?php

// namespace App\Http\Requests\Settings;

// use App\Models\User;
// use Illuminate\Contracts\Validation\ValidationRule;
// use Illuminate\Foundation\Http\FormRequest;
// use Illuminate\Validation\Rule;

// class ProfileUpdateRequest extends FormRequest
// {
//     /**
//      * Get the validation rules that apply to the request.
//      *
//      * @return array<string, ValidationRule|array<mixed>|string>
//      */
//     public function rules(): array
//     {
//         return [
//             'name' => ['required', 'string', 'max:255'],

//             'email' => [
//                 'required',
//                 'string',
//                 'lowercase',
//                 'email',
//                 'max:255',
//                 Rule::unique(User::class)->ignore($this->user()->id),
//             ],
//         ];
//     }
// }


namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Personal Information
            'name' => [
                'required', 
                'string', 
                'max:255'
            ],
            
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            
            'phone' => [
                'nullable',
                'string',
                'max:20',
                'regex:/^[\+]?[0-9\s\-\(\)]+$/'
            ],

            // Business Information
            'business_name' => [
                'nullable',
                'string',
                'max:255'
            ],
            
            'cac_reg_no' => [
                'nullable',
                'string',
                'max:50'
            ],
            
            'address' => [
                'nullable',
                'string',
                'max:500'
            ],
            
            'city' => [
                'nullable',
                'string',
                'max:100'
            ],
            
            'state' => [
                'nullable',
                'string',
                'max:100'
            ],
            
            'country' => [
                'nullable',
                'string',
                'max:100'
            ],
            
            'zip_code' => [
                'nullable',
                'string',
                'max:20'
            ],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'full name',
            'email' => 'email address',
            'phone' => 'phone number',
            'business_name' => 'business name',
            'cac_reg_no' => 'CAC registration number',
            'address' => 'business address',
            'city' => 'city',
            'state' => 'state',
            'country' => 'country',
            'zip_code' => 'ZIP/postal code',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'phone.regex' => 'The phone number format is invalid.',
        ];
    }
}