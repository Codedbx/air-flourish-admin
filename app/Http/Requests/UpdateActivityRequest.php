<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateActivityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // return $this->user()->hasRole(['agent', 'admin']);
        return true; // Adjust this based on your authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'location' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'start_time' => 'sometimes|nullable|date',
            'end_time' => 'sometimes|nullable|date|after:start_time',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'time_slots' => 'sometimes|required|array|min:1',
            'time_slots.*.starts_at' => 'sometimes|required|date',
            'time_slots.*.ends_at' => 'sometimes|required|date|after:time_slots.*.starts_at',
            'time_slots.*.capacity' => 'sometimes|required|integer|min:1',
        ];
    }
}