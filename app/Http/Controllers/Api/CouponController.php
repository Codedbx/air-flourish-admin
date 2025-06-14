<?php

namespace App\Http\Controllers\Api;

use App\Models\Coupon;
use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CouponController extends Controller
{

    public function validateCoupon(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'code'       => ['required','string'],
            'package_id' => ['required','integer','exists:packages,id'],
            'pax_count'  => ['required','integer','min:1'],
        ]);

        $package = Package::findOrFail($payload['package_id']);
        $coupon  = Coupon::where('code', $payload['code'])->first();

        if (! $coupon || ! $coupon->isValidFor($package)) {
            return response()->json([
                'valid'   => false,
                'message' => 'Coupon is invalid or not applicable.',
            ], 422);
        }

        $baseTotal = $package->total_price * $payload['pax_count'];
        $discount = $coupon->discount_type === 'fixed'
            ? min($coupon->discount_value, $baseTotal)
            : ($coupon->discount_value / 100) * $baseTotal;

        return response()->json([
            'valid'           => true,
            'discount_amount' => round($discount, 2),
            'new_total'       => round($baseTotal - $discount, 2),
        ]);
    }
}
