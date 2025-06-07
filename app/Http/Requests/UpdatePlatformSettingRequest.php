<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlatformSettingRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'admin_addon_type' => [
                'required',
                'string',
                'in:percentage,fixed'
            ],
            'admin_addon_amount' => [
                'required',
                'numeric',
                'min:0',
                'max:999999.99',
                function ($attribute, $value, $fail) {
                    if ($this->input('admin_addon_type') === 'percentage' && $value > 100) {
                        $fail('The admin addon amount cannot exceed 100% when type is percentage.');
                    }
                },
            ],
            'espees_rate' => [
                'required',
                'numeric',
                'min:0',
                'max:999999.99'
            ],
            'naira_rate' => [
                'required',
                'numeric',
                'min:0',
                'max:999999.99'
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
            'admin_addon_type' => 'admin addon type',
            'admin_addon_amount' => 'admin addon amount',
            'espees_rate' => 'Espees rate',
            'naira_rate' => 'Naira rate',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'admin_addon_type.required' => 'Please select an admin addon type.',
            'admin_addon_type.in' => 'Admin addon type must be either percentage or fixed.',
            'admin_addon_amount.required' => 'Admin addon amount is required.',
            'admin_addon_amount.numeric' => 'Admin addon amount must be a valid number.',
            'admin_addon_amount.min' => 'Admin addon amount cannot be negative.',
            'admin_addon_amount.max' => 'Admin addon amount is too large.',
            'espees_rate.required' => 'Espees rate is required.',
            'espees_rate.numeric' => 'Espees rate must be a valid number.',
            'espees_rate.min' => 'Espees rate cannot be negative.',
            'naira_rate.required' => 'Naira rate is required.',
            'naira_rate.numeric' => 'Naira rate must be a valid number.',
            'naira_rate.min' => 'Naira rate cannot be negative.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Ensure decimal values are properly formatted
        if ($this->has('admin_addon_amount')) {
            $this->merge([
                'admin_addon_amount' => number_format((float) $this->admin_addon_amount, 2, '.', ''),
            ]);
        }

        if ($this->has('espees_rate')) {
            $this->merge([
                'espees_rate' => number_format((float) $this->espees_rate, 2, '.', ''),
            ]);
        }

        if ($this->has('naira_rate')) {
            $this->merge([
                'naira_rate' => number_format((float) $this->naira_rate, 2, '.', ''),
            ]);
        }
    }
}