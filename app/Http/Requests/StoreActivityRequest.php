<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreActivityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
        // return $this->user()->hasAnyRole(['admin', 'agent']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
       return [
            'title' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'start_time' => 'nullable|date',
            'end_time' => 'nullable|date|after:start_time',
            'time_slots' => 'required|array|min:1',
            'time_slots.*.starts_at' => 'required|date',
            'time_slots.*.ends_at' => 'required|date|after:time_slots.*.starts_at',
        ];
    }
}
