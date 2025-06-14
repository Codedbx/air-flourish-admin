<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;

class LocationController extends Controller
{
    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:2'
        ]);

        $apiKey = config('services.locationiq.key');
        $response = Http::get('https://api.locationiq.com/v1/autocomplete', [
            'key' => $apiKey,
            'q' => $request->q,
            'limit' => 5,
            'dedupe' => 1,
            'tag' => 'place:city,place:town'
        ]);

        $suggestions = [];

        if ($response->successful()) {
            $suggestions = collect($response->json())->map(function ($item) {
                return [
                    'city' => $item['address']['city'] ?? 
                              $item['address']['town'] ?? 
                              $item['address']['village'] ?? 
                              $item['address']['county'] ?? 
                              '',
                    'country' => $item['address']['country'] ?? '',
                    'display' => $this->formatLocation($item['address'])
                ];
            })
            ->filter(fn($loc) => !empty($loc['city']) && !empty($loc['country']))
            ->values()
            ->toArray();
        }

        return response()->json($suggestions);
    }

    private function formatLocation(array $address): string
    {
        $city = $address['city'] ?? 
                $address['town'] ?? 
                $address['village'] ?? 
                $address['county'] ?? 
                '';
                
        $country = $address['country'] ?? '';
        
        return $city && $country ? "$city, $country" : '';
    }
}