<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'package_id' => ['required', 'integer', 'exists:packages,id'],
            'pax_count' => ['required', 'integer', 'min:1'],
            'guest_first_name' => ['required', 'string', 'max:255'],
            'guest_last_name' => ['required', 'string', 'max:255'],
            'guest_email' => ['required', 'email', 'max:255'],
            'guest_phone' => ['nullable', 'string', 'max:20'],
            'guest_country' => ['nullable', 'string', 'max:100'],
            'guest_city' => ['nullable', 'string', 'max:100'],
            'guest_zip_code' => ['nullable', 'string', 'max:20'],
            'guest_gender' => ['nullable', 'string', 'in:male,female,other'],
            'slots' => ['required', 'array', 'min:1'],
            'slots.*.slot_id' => ['required', 'integer', 'exists:activity_time_slots,id'],
            'slots.*.slot_start' => ['required', 'date_format:Y-m-d H:i:s'],
            'slots.*.slot_end' => ['required', 'date_format:Y-m-d H:i:s'],
            'payment_gateway' => ['nullable', 'string', 'in:stripe,paystack,espees'],
        ];
    }

    public function messages(): array
    {
        return [
            'package_id.required' => 'Please select a package.',
            'package_id.exists' => 'The selected package is invalid.',
            'pax_count.required' => 'Please specify the number of participants.',
            'pax_count.min' => 'The number of participants must be at least 1.',
            'guest_first_name.required' => 'Please enter your first name.',
            'guest_last_name.required' => 'Please enter your last name.',
            'guest_email.required' => 'Please enter your email address.',
            'guest_email.email' => 'Please enter a valid email address.',
            'slots.required' => 'Please select at least one time slot.',
            'slots.*.slot_id.required' => 'Each activity must have a selected time slot.',
            'slots.*.slot_id.exists' => 'One or more selected time slots are invalid.',
            'slots.*.slot_start.required' => 'Start time is required for each slot.',
            'slots.*.slot_end.required' => 'End time is required for each slot.',
        ];
    }
}
