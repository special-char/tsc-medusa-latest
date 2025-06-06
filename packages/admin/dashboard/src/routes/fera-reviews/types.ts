type FeraReviewCounts = {
  media: number
  photos: number
  videos: number
}

type FeraCustomerRating = {
  count: number
  average: number
}

type FeraCustomerCounts = {
  reviews: number
  average_rating: number
  media: number
  orders: number | null
}

type FeraCustomer = {
  id: string | null
  display_name: string | null
  is_anonymous: boolean
  display_location: string | null
  avatar_url: string
  default_avatar_url: string
  rating: FeraCustomerRating
  channel: string | null
  is_verified: boolean
  is_from_supplier: boolean
  company_name: string | null
  content_request_state: string | null
  was_content_requested: boolean
  was_content_submitted: boolean
  was_review_submitted: boolean
  was_media_submitted: boolean
  external_id: string | null
  email: string | null
  phone_number: string | null
  name: string | null
  first_name: string | null
  last_name: string | null
  generated_display_name: string | null
  is_name_visible: boolean
  generated_display_location: string | null
  is_location_visible: boolean
  country_code: string | null
  region_name: string | null
  city: string | null
  zip: string | null
  is_test: boolean
  submission_url: string
  counts: FeraCustomerCounts
  notes: string | null
  tags: string[]
  shopper_id: string | null
  channel_code: string
  is_synced: boolean
  import_type_code: string
  unsubscribed: boolean | null
  external_created_at: string | null
  external_updated_at: string | null
  created_at: string
  updated_at: string
}

type FeraMedia = {
  id: string
  subject: string
  is_verified: boolean | null
  is_test: boolean | null
  external_product_id: string | null
  product_id: string | null
  external_customer_id: string | null
  customer_id: string | null
  created_at: string
  updated_at: string
  type: string
  review_id: string
  review_channel_code: string | null
  url: string
  site_front_url: string
  thumbnail_url: string
  processing_state: string
  channel_code: string | null
  caption: string | null
  state: string
  external_order_id: string | null
  order_id: string | null
  submission_id: string | null
}

export type FeraReview = {
  id: string
  subject: string
  is_verified: boolean | null
  is_test: boolean | null
  external_product_id: string | null
  product_id: string | null
  external_customer_id: string | null
  customer_id: string | null
  created_at: string
  updated_at: string
  rating: number
  heading: string
  body: string | null
  is_anonymous: boolean
  channel_code: string | null
  channel_url: string | null
  channel: string | null
  is_from_supplier: boolean | null
  external_id: string | null
  site_front_url: string
  store_reply: string | null
  counts: FeraReviewCounts
  state: string
  external_order_id: string | null
  order_id: string | null
  submission_id: string | null
  remote_ip: string | null
  can_be_edited_by_customer: boolean
  recommended_admin_actions: string[]
  time_left_to_moderate: string | null
  is_synced: boolean
  original_source: string
  is_deletable: boolean
  is_changeable: boolean
  is_imported: boolean
  product: any | null
  customer: FeraCustomer
  media: FeraMedia[]
}

export type FeraReviewsResponse = {
  data: FeraReview[]
  meta: {
    total_count: number
    offset: number
    limit: number
    // page_size: number
    // page_count: number
    // page: number
  }
}
