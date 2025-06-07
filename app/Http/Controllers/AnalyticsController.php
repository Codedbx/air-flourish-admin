<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index()
    {
        // 1) Metrics (unchanged)
        $metrics = Cache::remember('analytics:metrics', now()->addMinute(), function () {
            $totalBookings     = Booking::count();
            $totalPayments     = Payment::sum('amount');
            $completedBookings = Booking::where('status', 'completed')->count();
            $uniqueVisitors    = Booking::whereNotNull('user_id')
                                        ->distinct('user_id')
                                        ->count('user_id');
            return [
                'total_bookings'     => $totalBookings,
                'total_payments'     => $totalPayments,
                'completed_bookings' => $completedBookings,
                'unique_visitors'    => $uniqueVisitors,
            ];
        });

        // 2) Weekly Payments (last 6 weeks)
        $weeklyPayments = Cache::remember('analytics:payments_by_week', now()->addMinute(), function () {
            $startDate = Carbon::now()->startOfWeek()->subWeeks(5);
            $endDate   = Carbon::now()->endOfWeek();

            $raw = Payment::selectRaw("
                    YEAR(created_at) AS year,
                    WEEK(created_at, 1) AS week_number,
                    SUM(amount)     AS total_amount
                ")
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('year', 'week_number')
                ->orderBy('year')
                ->orderBy('week_number')
                ->get();

            $chartData = [];
            $cursor = $startDate->copy();
            for ($i = 0; $i < 6; $i++) {
                $weekStart = $cursor->copy()->startOfWeek();
                $weekEnd   = $cursor->copy()->endOfWeek();
                $label     = $weekStart->format('M j') . '–' . $weekEnd->format('M j');
                $chartData[] = [
                    'period' => $label,
                    'total'  => 0.00,
                ];
                $cursor->addWeek();
            }

            foreach ($raw as $row) {
                $weekStart = Carbon::now()
                    ->setISODate($row->year, $row->week_number)
                    ->startOfWeek();
                $weekEnd   = (clone $weekStart)->endOfWeek();
                $label     = $weekStart->format('M j') . '–' . $weekEnd->format('M j');
                foreach ($chartData as $idx => $entry) {
                    if ($entry['period'] === $label) {
                        $chartData[$idx]['total'] = (float)$row->total_amount;
                        break;
                    }
                }
            }

            return $chartData;
        });

        $yMaxWeekly = Cache::remember('analytics:payments_ymax_week', now()->addMinute(), function () use ($weeklyPayments) {
            $maxTotal = collect($weeklyPayments)->pluck('total')->max();
            if ($maxTotal <= 0) {
                return 1000;
            }
            return (ceil($maxTotal / 1000)) * 1000;
        });

        // 3) Monthly Payments (last 6 months)
        $monthlyPayments = Cache::remember('analytics:payments_by_month', now()->addMinute(), function () {
            $startDate = Carbon::now()->firstOfMonth()->subMonths(5);
            $endDate   = Carbon::now()->endOfMonth();

            $raw = Payment::selectRaw("
                    YEAR(created_at)  AS year,
                    MONTH(created_at) AS month,
                    SUM(amount)       AS total_amount
                ")
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get();

            $chartData = [];
            $cursor = $startDate->copy();
            for ($i = 0; $i < 6; $i++) {
                $chartData[] = [
                    'period' => $cursor->format('M'),
                    'total'  => 0.00,
                ];
                $cursor->addMonth();
            }

            foreach ($raw as $row) {
                $label = Carbon::create((int)$row->year, (int)$row->month, 1)->format('M');
                foreach ($chartData as $idx => $entry) {
                    if ($entry['period'] === $label) {
                        $chartData[$idx]['total'] = (float)$row->total_amount;
                        break;
                    }
                }
            }

            return $chartData;
        });

        $yMaxMonthly = Cache::remember('analytics:payments_ymax_month', now()->addMinute(), function () use ($monthlyPayments) {
            $maxTotal = collect($monthlyPayments)->pluck('total')->max();
            if ($maxTotal <= 0) {
                return 1000;
            }
            return (ceil($maxTotal / 1000)) * 1000;
        });

        // 4) Yearly Payments (last 5 years)
        $currentYear = Carbon::now()->year;
        $startYear   = $currentYear - 4;

        $yearlyPayments = Cache::remember('analytics:payments_by_year', now()->addMinute(), function () use ($startYear, $currentYear) {
            $raw = Payment::selectRaw("
                    YEAR(created_at) AS year,
                    SUM(amount)     AS total_amount
                ")
                ->whereBetween('created_at', [
                    Carbon::create($startYear, 1, 1, 0, 0, 0),
                    Carbon::create($currentYear, 12, 31, 23, 59, 59),
                ])
                ->groupBy('year')
                ->orderBy('year')
                ->get();

            $chartData = [];
            for ($y = $startYear; $y <= $currentYear; $y++) {
                $chartData[] = [
                    'period' => (string)$y,
                    'total'  => 0.00,
                ];
            }

            foreach ($raw as $row) {
                $label = (string)$row->year;
                foreach ($chartData as $idx => $entry) {
                    if ($entry['period'] === $label) {
                        $chartData[$idx]['total'] = (float)$row->total_amount;
                        break;
                    }
                }
            }

            return $chartData;
        });

        $yMaxYearly = Cache::remember('analytics:payments_ymax_year', now()->addMinute(), function () use ($yearlyPayments) {
            $maxTotal = collect($yearlyPayments)->pluck('total')->max();
            if ($maxTotal <= 0) {
                return 1000;
            }
            return (ceil($maxTotal / 1000)) * 1000;
        });

        // 5) Booking by Location: top 4 countries + Other
        $bookingsByCountry = Cache::remember('analytics:bookings_by_country', now()->addMinute(), function () {
            $topFour = Booking::selectRaw('
                    COALESCE(guest_country, "Unknown") AS country,
                    COUNT(*)                               AS count
                ')
                ->groupBy('country')
                ->orderByDesc('count')
                ->take(4)
                ->get();

            $topNames = $topFour->pluck('country')->toArray();
            $otherCount = Booking::selectRaw('COUNT(*) AS count')
                ->whereNotIn(DB::raw('COALESCE(guest_country, "Unknown")'), $topNames)
                ->value('count');

            $result = $topFour
                ->map(fn($r) => [
                    'country' => $r->country,
                    'count'   => $r->count,
                ])
                ->toArray();

            if ($otherCount > 0) {
                $result[] = [
                    'country' => 'Other',
                    'count'   => $otherCount,
                ];
            }

            return $result;
        });

        // 6) Upcoming bookings & recent payments (unchanged)
        $upcomingBookings = Cache::remember('analytics:upcoming_bookings', now()->addMinute(), function () {
            return Booking::with(['user', 'package'])
                ->whereNotIn('status', ['cancelled', 'rejected'])
                ->orderByDesc('created_at')
                ->take(10)
                ->get()
                ->map(fn($b) => [
                    'id'                    => $b->id,
                    'booking_reference'     => $b->booking_reference,
                    'guest_name'            => $b->guest_first_name . ' ' . $b->guest_last_name,
                    'package_title'         => optional($b->package)->title,
                    'created_at_human'      => $b->created_at->diffForHumans(),
                    'status'                => $b->status,
                    'total_price_formatted' => number_format($b->total_price, 2),
                ])->all();
        });

        $recentPayments = Cache::remember('analytics:recent_payments', now()->addMinute(), function () {
            return Payment::with('booking')
                ->orderByDesc('created_at')
                ->take(5)
                ->get()
                ->map(fn($p) => [
                    'id'                 => $p->id,
                    'amount_formatted'   => number_format($p->amount, 2),
                    'gateway'            => $p->gateway,
                    'status'             => $p->status,
                    'booking_reference'  => optional($p->booking)->booking_reference,
                    'created_at_human'   => $p->created_at->diffForHumans(),
                ])->all();
        });

        // 7) Render to Inertia
        return Inertia::render('dashboard',[
            'metrics'            => $metrics,
            'weeklyPayments'     => $weeklyPayments,
            'yMaxWeekly'         => $yMaxWeekly,
            'monthlyPayments'    => $monthlyPayments,
            'yMaxMonthly'        => $yMaxMonthly,
            'yearlyPayments'     => $yearlyPayments,
            'yMaxYearly'         => $yMaxYearly,
            'bookingsByCountry'  => $bookingsByCountry,
            'upcomingBookings'   => $upcomingBookings,
            'recentPayments'     => $recentPayments,
        ]);
    }
}