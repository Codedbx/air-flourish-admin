<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePackageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;

    }

    public function rules(): array
    {
        return [
            'title'                 => ['sometimes', 'required', 'string', 'max:255'],
            'description'           => ['sometimes', 'required', 'string'],
            'base_price'            => ['sometimes', 'required', 'numeric', 'min:0'],
            'location'              => ['sometimes', 'required', 'string', 'max:255'],
            'agent_addon_price'     => ['sometimes', 'required', 'numeric', 'min:0'],
            'agent_price_type'      => ['sometimes', 'required', 'in:fixed,percentage'],
            'booking_start_date'    => ['nullable', 'date'],
            'booking_end_date'      => ['nullable', 'date', 'after_or_equal:booking_start_date'],
            'is_active'             => ['boolean'],
            'is_featured'           => ['boolean'],
            'is_refundable'         => ['boolean'],
            'visibility'            => ['sometimes', 'required', 'in:public,private,agents_only'],
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
            'activities'            => ['sometimes', 'required', 'array'],
            'activities.*'          => ['integer', 'exists:activities,id'],
            'images'                => ['sometimes', 'required', 'array'],
            'images.*'              => ['image', 'mimes:jpeg,png,webp', 'max:1024'],

            'deleted_image_ids'     => ['sometimes','array'],
            'deleted_image_ids.*'   => ['integer','exists:media,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'images.*.image'       => 'Each file must be a valid image.',
            'images.*.mimes'       => 'Allowed image types: jpeg, png, webp.',
            'images.*.max'         => 'Each image must be ≤ 1MB.',
            'images.max'           => 'You may upload no more than 6 new images.',
            'deleted_image_ids.*.exists'=> 'Invalid media ID provided for deletion.',
        ];
    }
}
