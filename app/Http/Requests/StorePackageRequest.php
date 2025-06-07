<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePackageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
        //  return $this->user()->hasAnyRole(['admin', 'agent']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    // public function rules(): array
    // {
    //     return [
    //         'title'                 => ['required','string','max:255'],
    //         'description'           => ['required','string'],
    //         'base_price'            => ['required','numeric','min:0'],
    //         'agent_addon_price'     => ['nullable','numeric','min:0'],
    //         'agent_price_type'      => ['required','in:fixed,percentage'],
    //         'booking_start_date'    => ['required','date','before_or_equal:booking_end_date'],
    //         'booking_end_date'      => ['required','date','after_or_equal:booking_start_date'],
    //         'is_active'             => ['sometimes','boolean'],
    //         'is_featured'           => ['sometimes','boolean'],
    //         'is_refundable'         => ['sometimes','boolean'],
    //         'terms_and_conditions'  => ['nullable','string'],
    //         'cancellation_policy'   => ['nullable','string'],
    //         'location'              => ['required','string'],
    //         'visibility'            => ['required','in:public,private,agents_only'],
    //         'flight_from'           => ['nullable','string'],
    //         'flight_to'             => ['nullable','string'],
    //         'airline_name'          => ['nullable','string'],
    //         'booking_class'         => ['nullable','in:economy,premium_economy,business,first'],
    //         'hotel_name'            => ['nullable','string'],
    //         'hotel_star_rating'     => ['nullable','integer','between:1,5'],
    //         'hotel_checkin'         => ['nullable','date','before_or_equal:hotel_checkout'],
    //         'hotel_checkout'        => ['nullable','date','after_or_equal:hotel_checkin'],
    
    //         'activities'            => ['sometimes','array'],
    //         'activities.*'          => ['exists:activities,id'],
    //         'package_images.*'      => ['sometimes','image','max:1028'],
    //     ];
    // }

     public function rules(): array
    {
        return [
            'title'                 => ['required', 'string', 'max:255'],
            'description'           => ['required', 'string'],
            'base_price'            => ['required', 'numeric', 'min:0'],
            'location'              => ['required', 'string', 'max:255'],
            'agent_addon_price'     => ['required', 'numeric', 'min:0'],
            'agent_price_type'      => ['required', 'in:fixed,percentage'],
            'booking_start_date'    => ['nullable', 'date'],
            'booking_end_date'      => ['nullable', 'date', 'after_or_equal:booking_start_date'],
            'is_active'             => ['boolean'],
            'is_featured'           => ['boolean'],
            'is_refundable'         => ['boolean'],
            'visibility'            => ['required', 'in:public,private,agents_only'],
            'terms_and_conditions'  => ['nullable', 'string'],
            'cancellation_policy'   => ['nullable', 'string'],
            'flight_from'           => ['nullable', 'string'],
            'flight_to'             => ['nullable', 'string'],
            'airline_name'          => ['nullable', 'string'],
            'booking_class'         => ['nullable', 'in:economy,premium_economy,business,first'],
            'hotel_name'            => ['nullable', 'string'],
            'hotel_star_rating'     => ['nullable', 'integer', 'between:1,5'],
            'hotel_checkin'         => ['nullable', 'date'],
            'hotel_checkout'        => ['nullable', 'date', 'after_or_equal:hotel_checkin'],
            'activities'            => ['nullable', 'array'],
            'activities.*'          => ['integer', 'exists:activities,id'],
            // Image validation: min 5, max 6, each ≤1MB, must be image
            'images'                => ['required', 'array', 'min:5', 'max:6'],
            'images.*'              => ['image', 'mimes:jpeg,png,webp', 'max:1024'],
        ];
    }

    public function messages(): array
    {
        return [
            'images.required'      => 'You must upload at least 5 images.',
            'images.min'           => 'A minimum of 5 images is required.',
            'images.max'           => 'You may upload no more than 6 images.',
            'images.*.image'       => 'Each file must be a valid image.',
            'images.*.mimes'       => 'Allowed image types: jpeg, png, webp.',
            'images.*.max'         => 'Each image must be ≤ 1MB.',
        ];
    }
}
