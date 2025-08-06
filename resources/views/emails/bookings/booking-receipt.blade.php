<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Receipt - {{ $booking->booking_reference }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #fef7f2 0%, #fdf5f0 100%);
            color: #333;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
        }
        .success-badge {
            background: #10b981;
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 20px;
            font-weight: bold;
        }
        .booking-details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 5px 0;
        }
        .detail-row:last-child {
            margin-bottom: 0;
        }
        .label {
            font-weight: bold;
            color: #666;
        }
        .value {
            color: #333;
        }
        .download-section {
            background: #e3f2fd;
            border: 2px solid #2196f3;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
        }
        .download-button {
            display: inline-block;
            background: #2196f3;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 10px 0;
        }
        .download-button:hover {
            background: #1976d2;
        }
        .footer {
            background: #333;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 14px;
        }
        .footer a {
            color: #66b3ff;
            text-decoration: none;
        }
        .important-info {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
        }
        .important-info h3 {
            margin-top: 0;
            color: #8b6f00;
        }
        .important-info p {
            margin-bottom: 0;
            color: #8b6f00;
        }
    </style>
</head>
<body>
    <div class="container">
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
            <div class="success-badge">
                ✅ Payment Confirmed - Your booking is confirmed!
            </div>

            <p>Dear {{ $booking->guest_first_name }} {{ $booking->guest_last_name }},</p>
            
            <p>Thank you for your booking! Your payment has been successfully processed and your travel package is confirmed.</p>

            <div class="booking-details">
                <h3 style="margin-top: 0; color: #333;">Booking Details</h3>
                
                <div class="detail-row">
                    <span class="label">Booking Reference:</span>
                    <span class="value">{{ $booking->booking_reference }}</span>
                </div>
                
                <div class="detail-row">
                    <span class="label">Package:</span>
                    <span class="value">{{ $booking->package->title }}</span>
                </div>
                
                <div class="detail-row">
                    <span class="label">Number of Guests:</span>
                    <span class="value">{{ $booking->pax_count }} {{ Str::plural('person', $booking->pax_count) }}</span>
                </div>
                
                <div class="detail-row">
                    <span class="label">Total Amount Paid:</span>
                    <span class="value">${{ number_format($booking->total_price, 2) }}</span>
                </div>
                
                <div class="detail-row">
                    <span class="label">Booking Date:</span>
                    <span class="value">{{ $booking->created_at->format('F d, Y') }}</span>
                </div>
            </div>

            <div class="download-section">
                <h3 style="margin-top: 0; color: #1976d2;">📄 Your Receipt</h3>
                <p>Your detailed receipt is attached to this email and also available for download:</p>
                
                <a href="{{ $downloadUrl }}" class="download-button">
                    📥 Download Receipt PDF
                </a>
                
                <p style="font-size: 14px; color: #666; margin-top: 15px;">
                    <strong>Note:</strong> This download link is valid for 5 days and allows up to 5 downloads.
                </p>
            </div>

            <div class="important-info">
                <h3>Important Information</h3>
                <p>
                    • Your booking is confirmed and payment has been processed<br>
                    • You will receive a detailed itinerary closer to your travel date<br>
                    • Please ensure all travel documents are valid<br>
                    • Contact us if you need to make any changes to your booking
                </p>
            </div>

            <p>If you have any questions or need assistance, please don't hesitate to contact our customer service team.</p>
            
            <p>We look forward to providing you with an amazing travel experience!</p>
            
            <p>Best regards,<br>
            <strong>{{ config('app.name', 'Air Flourish') }} Team</strong></p>
        </div>

        <div class="footer">
            <p><strong>{{ config('app.name', 'Air Flourish') }}</strong></p>
            <p>24/7 Customer Service | <a href="mailto:{{ config('mail.support_address', 'support@example.com') }}">{{ config('mail.support_address', 'support@example.com') }}</a></p>
            <p>This is an automated email. Please do not reply to this message.</p>
            <p style="font-size: 12px; margin-top: 15px;">
                Booking Reference: {{ $booking->booking_reference }} | Generated: {{ now()->format('F d, Y \a\t g:i A') }}
            </p>
        </div>
    </div>
</body>
</html>