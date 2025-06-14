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
            'time_slots' => 'required|array|min:1',
            'time_slots.*.starts_at' => ['required','date_format:H:i'],
            'time_slots.*.ends_at'   => ['required','date_format:H:i','after:time_slots.*.starts_at'],
        ];
    }
}
