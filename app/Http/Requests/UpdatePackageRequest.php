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

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    // public function rules(): array
    // {
    //     return [
    //         'title'                 => ['sometimes','required','string','max:255'],
    //         'description'           => ['sometimes','required','string'],
    //         'base_price'            => ['sometimes','required','numeric','min:0'],
    //         'agent_addon_price'     => ['sometimes','nullable','numeric','min:0'],
    //         'agent_price_type'      => ['sometimes','required','in:fixed,percentage'],
    //         'booking_start_date'    => ['sometimes','required','date','before_or_equal:booking_end_date'],
    //         'booking_end_date'      => ['sometimes','required','date','after_or_equal:booking_start_date'],
    //         'is_active'             => ['sometimes','boolean'],
    //         'is_featured'           => ['sometimes','boolean'],
    //         'is_refundable'         => ['sometimes','boolean'],
    //         'terms_and_conditions'  => ['sometimes','nullable','string'],
    //         'cancellation_policy'   => ['sometimes','nullable','string'],
    //         'location'              => ['sometimes','required','string'],
    //         'visibility'            => ['sometimes','required','in:public,private,agents_only'],
    //         'flight_from'           => ['sometimes','nullable','string'],
    //         'flight_to'             => ['sometimes','nullable','string'],
    //         'airline_name'          => ['sometimes','nullable','string'],
    //         'booking_class'         => ['sometimes','nullable','in:economy,premium_economy,business,first'],
    //         'hotel_name'            => ['sometimes','nullable','string'],
    //         'hotel_star_rating'     => ['sometimes','nullable','integer','between:1,5'],
    //         'hotel_checkin'         => ['sometimes','nullable','date','before_or_equal:hotel_checkout'],
    //         'hotel_checkout'        => ['sometimes','nullable','date','after_or_equal:hotel_checkin'],
         
    //         'activities'            => ['sometimes','array'],
    //         'activities.*'          => ['exists:activities,id'],
    //         'package_images.*'      => ['sometimes','image','max:5120'],
    //         'delete_media'          => ['sometimes','array'],
    //         'delete_media.*'        => ['exists:media,id'],
    //     ];
    // }

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
            'images'                => ['sometimes', 'required', 'array', 'min:0', 'max:6'],
            'images.*'              => ['image', 'mimes:jpeg,png,webp', 'max:1024'],
            // IDs to delete (existing media)
            'delete_media'          => ['nullable', 'array'],
            'delete_media.*'        => ['integer', 'exists:media,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'images.*.image'       => 'Each file must be a valid image.',
            'images.*.mimes'       => 'Allowed image types: jpeg, png, webp.',
            'images.*.max'         => 'Each image must be ≤ 1MB.',
            'images.max'           => 'You may upload no more than 6 new images.',
            'delete_media.*.exists'=> 'Invalid media ID provided for deletion.',
        ];
    }
}
