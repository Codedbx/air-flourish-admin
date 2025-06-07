<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f8fafc;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #1d72b8 0%, #2563eb 100%);
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
        }
        
        .confirmation-message {
            font-size: 16px;
            color: #059669;
            font-weight: 600;
            margin-bottom: 32px;
            padding: 16px;
            background-color: #ecfdf5;
            border-left: 4px solid #059669;
            border-radius: 0 8px 8px 0;
        }
        
        .booking-details {
            background-color: #f9fafb;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 32px;
            border: 1px solid #e5e7eb;
        }
        
        .booking-details table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .booking-details tr:nth-child(even) {
            background-color: #ffffff;
        }
        
        .booking-details td {
            padding: 16px 20px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .booking-details tr:last-child td {
            border-bottom: none;
        }
        
        .booking-details .label {
            font-weight: 600;
            color: #374151;
            width: 35%;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .booking-details .value {
            color: #1f2937;
            font-size: 16px;
            font-weight: 500;
        }
        
        .total-row {
            background-color: #1d72b8 !important;
            color: #ffffff !important;
        }
        
        .total-row .label,
        .total-row .value {
            color: #ffffff !important;
            font-weight: 700;
            font-size: 16px;
        }
        
        .cta-section {
            text-align: center;
            margin: 32px 0;
        }
        
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #1d72b8 0%, #2563eb 100%);
            color: #ffffff;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s ease;
            box-shadow: 0 4px 12px rgba(29, 114, 184, 0.3);
        }
        
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(29, 114, 184, 0.4);
        }
        
        .support-text {
            font-size: 14px;
            color: #6b7280;
            text-align: center;
            margin-top: 24px;
            padding: 20px;
            background-color: #f9fafb;
            border-radius: 8px;
        }
        
        .footer {
            background-color: #1f2937;
            color: #9ca3af;
            text-align: center;
            padding: 24px 30px;
            font-size: 12px;
        }
        
        .footer a {
            color: #60a5fa;
            text-decoration: none;
        }
        
        /* Mobile responsiveness */
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                box-shadow: none;
            }
            
            .header,
            .content {
                padding: 24px 20px;
            }
            
            .greeting {
                font-size: 20px;
            }
            
            .booking-details td {
                padding: 12px 16px;
            }
            
            .booking-details .label {
                font-size: 12px;
            }
            
            .booking-details .value {
                font-size: 14px;
            }
            
            .button {
                padding: 14px 24px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>{{ config('app.name') }}</h1>
        </div>
        
        <div class="content">
            <h2 class="greeting">Hello {{ $recipientName }},</h2>
            
            <div class="confirmation-message">
                ✅ Your booking has been confirmed!
            </div>
            
            <div class="booking-details">
                <table>
                    <tr>
                        <td class="label">Reference</td>
                        <td class="value">{{ $booking->booking_reference }}</td>
                    </tr>
                    <tr>
                        <td class="label">Package</td>
                        <td class="value">{{ $booking->package->title }}</td>
                    </tr>
                    <tr>
                        <td class="label">Booked On</td>
                        <td class="value">{{ $booking->created_at->format('F j, Y \\a\\t g:i A') }}</td>
                    </tr>
                    <tr>
                        <td class="label">Travel Dates</td>
                        <td class="value">
                            {{ $booking->package->booking_start_date->format('F j, Y') }} – 
                            {{ $booking->package->booking_end_date->format('F j, Y') }}
                        </td>
                    </tr>
                    <tr>
                        <td class="label">Guests</td>
                        <td class="value">{{ $booking->pax_count }}</td>
                    </tr>
                    <tr class="total-row">
                        <td class="label">Total Paid</td>
                        <td class="value">${{ number_format($booking->total_price, 2) }}</td>
                    </tr>
                </table>
            </div>
            
            <div class="cta-section">
                <a href="http://localhost:5174/" class="button">
                    View Your Booking
                </a>
            </div>
            
            <div class="support-text">
                <strong>Need help?</strong><br>
                If you have any questions about your booking, simply reply to this email or contact our support team.
            </div>
        </div>
        
        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </div>
    </div>
</body>
</html>