<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Air Flourish - Travel Package Receipt</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background-color: #f9f9f9;
            padding: 20px;
            color: #333;
            font-size: 14px;
            line-height: 1.4;
        }

        .receipt-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #fef7f2 0%, #fdf5f0 100%);
            color: #333;
            padding: 30px;
            text-align: center;
            border-bottom: 1px solid #f0f0f0;
        }

        .logo {
            max-width: 150px;
            max-height: 80px;
            margin-bottom: 15px;
        }

        .airline-logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }

        .receipt-title {
            font-size: 18px;
            font-weight: 300;
            color: #666;
        }

        .content {
            padding: 30px;
        }

        .confirmation-badge {
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 20px;
            font-weight: bold;
        }

        .booking-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f8f8f8;
        }

        .booking-ref, .booking-date {
            text-align: left;
        }

        .booking-date {
            text-align: right;
        }

        .label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
            font-weight: normal;
        }

        .value {
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }

        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 8px;
        }

        .guest-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }

        .guest-item {
            margin-bottom: 15px;
        }

        .package-section {
            border: 1px solid #f0f0f0;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            background: #fefefe;
        }

        .package-title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
        }

        .package-description {
            color: #666;
            margin-bottom: 15px;
            line-height: 1.4;
        }

        .package-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 15px;
        }

        .package-detail-item {
            background: white;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #f0f0f0;
            text-align: center;
        }

        .pricing-section {
            background: linear-gradient(135deg, #fefcfa 0%, #fdfaf7 100%);
            border: 1px solid #f0f0f0;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .price-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            color: #333;
            padding: 5px 0;
        }

        .price-row.discount {
            color: #059669;
        }

        .price-row.total {
            font-weight: bold;
            font-size: 18px;
            border-top: 2px solid #d0d0d0;
            padding-top: 15px;
            margin-top: 15px;
            color: #333;
        }

        .important-info {
            background: linear-gradient(135deg, #fefcfa 0%, #fdfaf7 100%);
            border: 2px solid #f0f0f0;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 20px;
        }

        .info-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
        }

        .info-text {
            font-size: 14px;
            color: #333;
            line-height: 1.6;
        }

        .footer {
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #ff9a66 0%, #ffb380 100%);
            color: white;
            font-size: 12px;
        }

        /* Ensure proper page breaks for PDF */
        .page-break {
            page-break-after: always;
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .receipt-container {
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="header">
            @if(file_exists(public_path('images/logo.png')))
                <img src="{{ public_path('images/logo.png') }}" alt="Company Logo" class="logo">
            @endif
            
            <div class="airline-logo">
                {{ config('app.name', 'Air Fourish') }}
            </div>
            <div class="receipt-title">Travel Package Receipt</div>
        </div>

        <div class="content">
            <div class="confirmation-badge">
                ✅ Payment Confirmed - Your booking is confirmed!
            </div>

            <div class="booking-info">
                <div class="booking-ref">
                    <div class="label">Booking Reference</div>
                    <div class="value">{{ $booking->booking_reference }}</div>
                </div>
                <div class="booking-date">
                    <div class="label">Booking Date</div>
                    <div class="value">{{ $booking->created_at->format('F d, Y') }}</div>
                </div>
            </div>

            <div class="guest-section">
                <div class="section-title">Guest Information</div>
                <div class="guest-grid">
                    <div class="guest-item">
                        <div class="label">Guest Name</div>
                        <div class="value">{{ $booking->guest_first_name }} {{ $booking->guest_last_name }}</div>
                    </div>
                    <div class="guest-item">
                        <div class="label">Email Address</div>
                        <div class="value">{{ $booking->guest_email }}</div>
                    </div>
                    <div class="guest-item">
                        <div class="label">Phone Number</div>
                        <div class="value">{{ $booking->guest_phone ?? 'Not provided' }}</div>
                    </div>
                    <div class="guest-item">
                        <div class="label">Location</div>
                        <div class="value">{{ $booking->guest_city ?? 'N/A' }}, {{ $booking->guest_country ?? 'N/A' }}</div>
                    </div>
                </div>
            </div>

            <div class="package-section">
                <div class="section-title">Package Details</div>
                
                <div class="package-title">{{ $booking->package->title }}</div>
                
                @if($booking->package->description)
                <div class="package-description">
                    {{ $booking->package->description }}
                </div>
                @endif

                <div class="package-details">
                    <div class="package-detail-item">
                        <div class="label">Number of Guests</div>
                        <div class="value">{{ $booking->pax_count }} {{ Str::plural('Person', $booking->pax_count) }}</div>
                    </div>
                    <div class="package-detail-item">
                        <div class="label">Package Price (Per Person)</div>
                        <div class="value">${{ number_format($booking->base_price, 2) }}</div>
                    </div>
                    @if($booking->package->hotel_checkin && $booking->package->hotel_checkout)
                    <div class="package-detail-item">
                        <div class="label">Check-in Date</div>
                        <div class="value">{{ $booking->package->hotel_checkin->format('M d, Y') }}</div>
                    </div>
                    <div class="package-detail-item">
                        <div class="label">Check-out Date</div>
                        <div class="value">{{ $booking->package->hotel_checkout->format('M d, Y') }}</div>
                    </div>
                    @elseif($booking->package->booking_start_date && $booking->package->booking_end_date)
                    <div class="package-detail-item">
                        <div class="label">Start Date</div>
                        <div class="value">{{ $booking->package->booking_start_date->format('M d, Y') }}</div>
                    </div>
                    <div class="package-detail-item">
                        <div class="label">End Date</div>
                        <div class="value">{{ $booking->package->booking_end_date->format('M d, Y') }}</div>
                    </div>
                    @endif
                </div>
            </div>

            <div class="pricing-section">
                <div class="section-title">Payment Breakdown</div>
                <div class="price-row">
                    <span>Package Base Price ({{ $booking->pax_count }} {{ Str::plural('person', $booking->pax_count) }})</span>
                    <span>${{ number_format($booking->base_price * $booking->pax_count, 2) }}</span>
                </div>
                
                @if($booking->activities_total > 0)
                <div class="price-row">
                    <span>Activities</span>
                    <span>${{ number_format($booking->activities_total, 2) }}</span>
                </div>
                @endif

                @if($booking->computed_agent_addon > 0)
                <div class="price-row">
                    <span>Agent Fee</span>
                    <span>${{ number_format($booking->computed_agent_addon, 2) }}</span>
                </div>
                @endif

                @if($booking->computed_admin_addon > 0)
                <div class="price-row">
                    <span>Service Fee</span>
                    <span>${{ number_format($booking->computed_admin_addon, 2) }}</span>
                </div>
                @endif

                @if($booking->discount_amount > 0)
                <div class="price-row discount">
                    <span>Discount Applied</span>
                    <span>-${{ number_format($booking->discount_amount, 2) }}</span>
                </div>
                @endif

                <div class="price-row total">
                    <span>Total Amount Paid</span>
                    <span>${{ number_format($booking->total_price, 2) }}</span>
                </div>
            </div>

            <div class="important-info">
                <div class="info-title">Important Information</div>
                <div class="info-text">
                    • Your booking is confirmed and payment has been processed<br>
                    • You will receive a detailed itinerary closer to your travel date<br>
                    • Please ensure all travel documents are valid<br>
                    • Contact us if you need to make any changes to your booking<br>
                    • Refund policy applies as per terms and conditions<br>
                    • Keep this receipt for your records
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Thank you for choosing {{ config('app.name', 'Air Flourish') }} | 24/7 Customer Service</p>
            <p>This is an electronic receipt | Booking Reference: {{ $booking->booking_reference }}</p>
            <p>Generated on: {{ now()->format('F d, Y \a\t g:i A') }}</p>
        </div>
    </div>
</body>
</html>