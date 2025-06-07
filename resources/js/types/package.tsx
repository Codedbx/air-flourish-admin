// types.ts
export interface TimeSlot {
  id: number;
  starts_at: string;
  ends_at: string;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  price: string;
  time_slots: TimeSlot[];
}

export interface Package {

  title: string;
  description: string;
  base_price: string;
  location: string;
  agent_addon_price: string;
  agent_price_type: 'fixed' | 'percentage';
  booking_start_date: string;
  booking_end_date: string;
  is_active: boolean;
  is_featured: boolean;
  is_refundable: boolean;
  visibility: 'public' | 'private';
  terms_and_conditions: string;
  cancellation_policy: string;
  flight_from: string;
  flight_to: string;
  airline_name: string;
  booking_class: string;
  hotel_name: string;
  hotel_star_rating: string;
  hotel_checkin: string;
  hotel_checkout: string;
  activities: number[];  
  images: File[];         
  [key: string]: any;     
  // id: number;
  // title: string;
  // description: string;
  // base_price: string;
  // agent_addon_price: string;
  // agent_price_type: string;
  // check_in_time: string;
  // check_out_time: string;
  // booking_start_date: string;
  // booking_end_date: string;
  // is_active: boolean;
  // is_featured: boolean;
  // is_refundable: boolean;
  // terms_and_conditions: string;
  // cancellation_policy: string;
  // flight_from: string;
  // flight_to: string;
  // airline_name: string;
  // booking_class: string;
  // hotel_name: string;
  // hotel_star_rating: string;
  // hotel_checkin: string;
  // hotel_checkout: string;
  // location: string;
  // owner: Owner;
  // visibility: string;
  // activities_count: number;
  // media: Media[];
  // activities: Activity[];
  // created_at: string;
  // updated_at: string;
  
}

interface Owner {
  id: number;
  name: string;
  email: string;
}


interface Media {
  id: number;
  original_url: string;
  thumb_url?: string;
}


export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: {
    active: boolean;
    label: string;
    url: string | null;
  }[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PackageResponse {
  data: Package[];
  meta: PaginationMeta;
}