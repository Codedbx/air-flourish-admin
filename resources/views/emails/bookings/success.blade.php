<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Travel Package Receipt</title>
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
        }

        .receipt-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
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

        .booking-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f8f8f8;
        }

        .booking-ref {
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
        }

        .value {
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }

        .passenger-section {
            margin-bottom: 30px;
        }

        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 8px;
        }

        .passenger-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }

        .flight-section {
            margin-bottom: 30px;
        }

        .flight-route {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: linear-gradient(135deg, #fefcfa 0%, #fdfaf7 100%);
            border: 1px solid #f0f0f0;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .airport {
            text-align: center;
            flex: 1;
        }

        .airport-code {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }

        .airport-name {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }

        .flight-arrow {
            flex: 0 0 60px;
            text-align: center;
            color: #666;
            font-size: 20px;
            font-weight: bold;
        }

        .flight-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }

        .detail-item {
            text-align: center;
            padding: 15px;
            background: #fff;
            border: 2px solid #f5f5f5;
            border-radius: 6px;
            transition: all 0.3s ease;
        }

        .detail-item:hover {
            border-color: #d0d0d0;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .detail-item .value {
            color: #333;
            font-weight: bold;
        }

        .package-section {
            border: 1px solid #f0f0f0;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            background: #fefefe;
        }

        .package-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .package-title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
        }

        .package-price {
            font-size: 24px;
            font-weight: bold;
            color: #ff9a66;
        }

        .package-description {
            color: #666;
            font-size: 14px;
            margin-bottom: 15px;
            line-height: 1.4;
        }

        .package-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }

        .package-detail-item {
            background: white;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #f0f0f0;
            text-align: center;
        }

        .activities-section {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #f0f0f0;
        }

        .activity-item {
            background: white;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #f0f0f0;
            margin-bottom: 10px;
        }

        .activity-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }

        .activity-details {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #666;
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
            line-height: 1.4;
        }

        .footer {
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #ff9a66 0%, #ffb380 100%);
            color: white;
            font-size: 12px;
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

        @media (max-width: 768px) {
            .booking-info {
                flex-direction: column;
                gap: 15px;
            }
            
            .passenger-grid {
                grid-template-columns: 1fr;
            }
            
            .flight-details, .package-details {
                grid-template-columns: 1fr;
            }
            
            .package-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .receipt-container {
                box-shadow: none;
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="header">
            <div class="airline-logo">
                {{ config('app.name', 'Travel Airways') }}
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

            <div class="passenger-section">
                <div class="section-title">Guest Information</div>
                <div class="passenger-grid">
                    <div>
                        <div class="label">Guest Name</div>
                        <div class="value">{{ $booking->guest_first_name }} {{ $booking->guest_last_name }}</div>
                    </div>
                    <div>
                        <div class="label">Email Address</div>
                        <div class="value">{{ $booking->guest_email }}</div>
                    </div>
                    <div>
                        <div class="label">Phone Number</div>
                        <div class="value">{{ $booking->guest_phone }}</div>
                    </div>
                    <div>
                        <div class="label">Location</div>
                        <div class="value">{{ $booking->guest_city }}, {{ $booking->guest_country }}</div>
                    </div>
                </div>
            </div>

            <div class="flight-section">
                <div class="section-title">Package Details</div>
                
                <div class="package-section">
                    <div class="package-header">
                        <div class="package-title">{{ $booking->package->title }}</div>
                        <div class="package-price">${{ number_format($booking->base_price, 2) }}</div>
                    </div>
                    
                    @if($booking->package->description)
                    <div class="package-description">
                        {{ $booking->package->description }}
                    </div>
                    @endif

                    <div class="package-details">
                        <div class="package-detail-item">
                            <div class="label">Location</div>
                            <div class="value">{{ $booking->package->location ?? 'N/A' }}</div>
                        </div>
                        <div class="package-detail-item">
                            <div class="label">Duration</div>
                            <div class="value">{{ $booking->package->duration ?? 'N/A' }}</div>
                        </div>
                        <div class="package-detail-item">
                            <div class="label">Travel Dates</div>
                            <div class="value">
                                @if($booking->package->booking_start_date && $booking->package->booking_end_date)
                                    {{ $booking->package->booking_start_date->format('M d') }} - {{ $booking->package->booking_end_date->format('M d, Y') }}
                                @else
                                    Contact for dates
                                @endif
                            </div>
                        </div>
                        <div class="package-detail-item">
                            <div class="label">Number of Guests</div>
                            <div class="value">{{ $booking->pax_count }} {{ Str::plural('Person', $booking->pax_count) }}</div>
                        </div>
                    </div>
                    
                    @if($booking->activities_total > 0)
                    <div class="activities-section">
                        <div class="info-title">Additional Activities</div>
                        <div class="activity-item">
                            <div class="activity-title">Selected Activities</div>
                            <div class="activity-details">
                                <span>Total Activities Cost</span>
                                <span>${{ number_format($booking->activities_total, 2) }}</span>
                            </div>
                        </div>
                    </div>
                    @endif
                </div>
            </div>

            <div class="pricing-section">
                <div class="section-title">Fare Breakdown</div>
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
                <div class="price-row" style="color: #059669;">
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

            @if($booking->package->booking_start_date && $booking->package->booking_start_date->isFuture())
            <div class="important-info" style="border-color: #3b82f6; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);">
                <div class="info-title" style="color: #1d4ed8;">Next Steps</div>
                <div class="info-text" style="color: #1e40af;">
                    • We'll send you a detailed itinerary 7 days before your travel date<br>
                    • Check your email regularly for important updates<br>
                    • Contact our support team if you have any questions<br>
                    • Download our mobile app for easy access to your booking details
                </div>
            </div>
            @endif
        </div>

        <div class="footer">
            <p>Thank you for choosing {{ config('app.name', 'Travel Airways') }} | 24/7 Customer Service</p>
            <p>This is an electronic receipt | Booking Reference: {{ $booking->booking_reference }}</p>
        </div>
    </div>
</body>
</html>