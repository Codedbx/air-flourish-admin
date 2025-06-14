<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\Package;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CouponController extends Controller
{
    use AuthorizesRequests;

        /**
     * Display a listing of coupons.
     */
    public function index(Request $request)
    {
        // Policy check: viewAny
        $this->authorize('viewAny', Coupon::class);

        $user       = $request->user();
        $canViewAll = $user->can('view all coupons');

        // Gather filters
        $filters = $request->only('search');

        // Base query with relationship & counts
        $query = Coupon::withCount(['packages', 'bookings'])
                    ->with('owner');

        if ($canViewAll) {
            // No additional scope
        } elseif ($user->can('view own coupons')) {
            $query->where('owner_id', $user->id);
        } else {
            abort(403);
        }

        // Apply search filter
        if (!empty($filters['search'])) {
            $query->where('code', 'like', "%{$filters['search']}%" );
        }

        // Paginate
        $paginator = $query->orderByDesc('created_at')
                        ->paginate(10)
                        ->withQueryString();

        $raw = $paginator->toArray();

        // Map to frontend shape
        $data = array_map(fn($c) => [
            'id'             => $c['id'],
            'code'           => $c['code'],
            'discount_type'  => $c['discount_type'],
            'discount_value' => $c['discount_value'],
            'expires_at'     => $c['expires_at'],
            'is_global'      => $c['is_global'],
            'is_active'      => $c['is_active'],
            'package_count'  => $c['packages_count'],
            'uses_count'     => $c['bookings_count'],
            'created_at'     => $c['created_at'],
            // Only populated if canViewAll
            'owner_name'     => $c['owner']['name'] ?? null,
        ], $raw['data']);

        return Inertia::render('coupons/index', [
            'filters'    => $filters,
            'coupons'    => [
                'data' => $data,
                'links'=> $raw['links'],
                'meta' => [
                    'current_page' => $raw['current_page'],
                    'last_page'    => $raw['last_page'],
                    'per_page'     => $raw['per_page'],
                    'total'        => $raw['total'],
                ],
            ],
            'canViewAll' => $canViewAll,
        ]);
    }


    /**
     * GET /coupons/create
     * Show the “Create Coupon” form.
     */
    public function create()
    {
        $this->authorize('create', Coupon::class);

        $packages = Package::where('owner_id', Auth::id())
            ->select('id', 'title')
            ->get();

        return Inertia::render('coupons/create', [
            'packages' => $packages,
        ]);
    }

    /**
     * POST /coupons
     * Validate & persist a new coupon.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Coupon::class);
        $data = $request->validate([
            'code'            => ['required','string','unique:coupons,code'],
            'discount_type'   => ['required','in:fixed,percentage'],
            'discount_value'  => ['required','numeric','min:0'],
            'expires_at'      => ['nullable','date','after_or_equal:today'],
            'max_uses'        => ['nullable','integer','min:1'],
            'is_global'       => ['required','boolean'],
            'is_active'   => ['required','boolean'], 
            'package_ids'     => ['array','exists:packages,id'],
        ]);

        $coupon = Coupon::create([
            'code'            => Str::upper($data['code']),
            'discount_type'   => $data['discount_type'],
            'discount_value'  => $data['discount_value'],
            'expires_at'      => $data['expires_at'] ?? null,
            'max_uses'        => $data['max_uses'] ?? null,
            'is_global'       => $data['is_global'],
            'is_active'  => $data['is_active'], 
            'owner_id'        => Auth::id(),
        ]);

        // if not global, attach only the selected packages
        if (! $data['is_global']) {
            $coupon->packages()->sync($data['package_ids']);
        }

        return redirect()->route('coupons.index')
                         ->with('success', 'Coupon created successfully.');
    }

    public function toggleActive(Coupon $coupon): RedirectResponse
    {
        $this->authorize('update', $coupon);
        
        if ($coupon->owner_id !== Auth::id()) {
            abort(403);
        }

        $coupon->is_active = ! $coupon->is_active;
        $coupon->save();

        return back()->with('success', 'Coupon status updated.');
    }
}
