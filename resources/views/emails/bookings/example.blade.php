@component('mail::layout')
    @slot('header')
        @component('mail::header', ['url' => config('app.url')])
            <img src="" alt="{{ config('app.name') }} Logo" style="max-height: 50px;">
        @endcomponent
    @endslot


    <div style="font-family: Arial, sans-serif; color: #333333; line-height: 1.6;">

        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 10px;">
            Hello {{ $recipientName }}, 🎉
        </h1>

        <p style="font-size: 16px;">
            Thank you for booking with <strong>{{ config('app.name') }}</strong>. We`re delighted to confirm your reservation!
        </p>

      
        <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; margin: 20px 0;">
            <tr>
                <td style="padding: 10px; background-color: #f7f7f7; width: 45%; font-weight: bold;">Booking Reference:</td>
                <td style="padding: 10px; background-color: #f7f7f7;">{{ $booking->booking_reference }}</td>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #ffffff; font-weight: bold;">Package Name:</td>
                <td style="padding: 10px; background-color: #ffffff;">{{ $booking->package->title }}</td>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #f7f7f7; font-weight: bold;">Booked On:</td>
                <td style="padding: 10px; background-color: #f7f7f7;">
                    {{ $booking->created_at->format('F j, Y \\a\\t g:i A') }}
                </td>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #ffffff; font-weight: bold;">Travel Dates:</td>
                <td style="padding: 10px; background-color: #ffffff;">
                    {{ $booking->package->booking_start_date->format('F j, Y') }}
                    &ndash;
                    {{ $booking->package->booking_end_date->format('F j, Y') }}
                </td>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #f7f7f7; font-weight: bold;">Number of Guests:</td>
                <td style="padding: 10px; background-color: #f7f7f7;">{{ $booking->pax_count }}</td>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #ffffff; font-weight: bold;">Total Amount Paid:</td>
                <td style="padding: 10px; background-color: #ffffff;">
                    ${{ number_format($booking->total_price, 2) }}
                </td>
            </tr>
        </table>

        @component('mail::button', ['url' => route('bookings.show', $booking->id), 'color' => 'primary'])
            View Your Booking
        @endcomponent

        <p style="font-size: 16px; margin-top: 30px;">
            If you have any questions or need to make changes, feel free to reply to this email or contact our support team.
        </p>
    </div>


    @slot('subcopy')
        @component('mail::subcopy')
            <p style="font-size: 14px; color: #777777;">
                Need assistance? Email us at
                <a href="mailto:support@{{ config('app.name') }}.com" style="color: #1d72b8; text-decoration: none;">
                    support@{{ config('app.name') }}.com
                </a>
                or call <strong>+1-800-555-TRIP</strong>.
            </p>
        @endcomponent
    @endslot

    @slot('footer')
        @component('mail::footer')
            <p style="font-size: 12px; color: #999999;">
                &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.<br>
                <a href="" style="color: #999999; text-decoration: none;">Privacy Policy</a>
                &nbsp;|&nbsp;
                <a href="" style="color: #999999; text-decoration: none;">Terms of Service</a>
            </p>
        @endcomponent
    @endslot
@endcomponent
