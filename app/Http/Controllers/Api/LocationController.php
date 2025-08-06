<?php

// namespace App\Http\Controllers\Api;

// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Http;
// use App\Http\Controllers\Controller;

// class LocationController extends Controller
// {
//     public function search(Request $request)
//     {
//         $request->validate([
//             'q' => 'required|string|min:2'
//         ]);

//         $apiKey = config('services.locationiq.key');
//         $response = Http::get('https://api.locationiq.com/v1/autocomplete', [
//             'key' => $apiKey,
//             'q' => $request->q,
//             'limit' => 5,
//             'dedupe' => 1,
//             'tag' => 'place:city,place:town'
//         ]);

//         $suggestions = [];

//         if ($response->successful()) {
//             $suggestions = collect($response->json())->map(function ($item) {
//                 return [
//                     'city' => $item['address']['city'] ?? 
//                               $item['address']['town'] ?? 
//                               $item['address']['village'] ?? 
//                               $item['address']['county'] ?? 
//                               '',
//                     'country' => $item['address']['country'] ?? '',
//                     'display' => $this->formatLocation($item['address'])
//                 ];
//             })
//             ->filter(fn($loc) => !empty($loc['city']) && !empty($loc['country']))
//             ->values()
//             ->toArray();
//         }

//         return response()->json($suggestions);
//     }

//     private function formatLocation(array $address): string
//     {
//         $city = $address['city'] ?? 
//                 $address['town'] ?? 
//                 $address['village'] ?? 
//                 $address['county'] ?? 
//                 '';
                
//         $country = $address['country'] ?? '';
        
//         return $city && $country ? "$city, $country" : '';
//     }
// }


namespace App\Http\Controllers\Api;

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

        $apiKey = config('services.google.key');
        $response = Http::get('https://maps.googleapis.com/maps/api/place/autocomplete/json', [
            'input' => $request->q,
            'types' => '(cities)',
            'key' => $apiKey,
            'language' => 'en',
        ]);

        $suggestions = [];

        if ($response->successful()) {
            $predictions = $response->json('predictions');
            
            foreach ($predictions as $prediction) {
                $placeId = $prediction['place_id'];
                $details = $this->getPlaceDetails($placeId, $apiKey);
                
                if ($details) {
                    $city = $this->extractCity($details);
                    $country = $this->extractCountry($details);
                    
                    if ($city && $country) {
                        $suggestions[] = [
                            'city' => $city,
                            'country' => $country,
                            'display' => $this->formatLocation($city, $country)
                        ];
                    }
                }
                
                if (count($suggestions) >= 5) break;
            }
        }

        return response()->json($suggestions);
    }

    private function getPlaceDetails($placeId, $apiKey)
    {
        $response = Http::get('https://maps.googleapis.com/maps/api/place/details/json', [
            'place_id' => $placeId,
            'fields' => 'address_component',
            'key' => $apiKey,
            'language' => 'en',
        ]);

        return $response->successful() ? $response->json('result') : null;
    }

    private function extractCity($details)
    {
        foreach ($details['address_components'] as $component) {
            if (in_array('locality', $component['types'])) {
                return $component['long_name'];
            }
        }
        return null;
    }

    private function extractCountry($details)
    {
        foreach ($details['address_components'] as $component) {
            if (in_array('country', $component['types'])) {
                return $component['long_name'];
            }
        }
        return null;
    }

    private function formatLocation($city, $country)
    {
        return $city && $country ? "$city, $country" : '';
    }
}