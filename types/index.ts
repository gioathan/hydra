export interface UserDto {
  id: string;
  email: string;
  role: 'Customer';
  isEmailVerified: boolean;
}

export interface CustomerDto {
  id: string;
  email: string | null;
  phone: string | null;
  locale: string;
  createdAtUtc: string;
  name: string | null;
  pushToken: string | null;
}

export interface VenuePhotoDto {
  id: string;
  googlePlaceId: string | null;
  displayOrder: number;
  photoUrl: string | null;
}

export interface VenueDto {
  id: string;
  name: string;
  address: string;
  capacity: number;
  userId: string;
  venueTypeId: string;
  photos: VenuePhotoDto[];
  averageRating: number;
  ratingCount: number;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl: string | null;
}

export interface PendingRatingDto {
  venueId: string;
  venueName: string;
  bookingId: string;
  bookingEndUtc: string;
}

export interface RateVenueRequest {
  bookingId: string;
  value: number;
}

export interface VenueTypeDto {
  id: string;
  name: string;
  description: string | null;
  displayOrder: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface AvailabilitySlot {
  startUtc: string;
  endUtc: string;
}

export interface AvailabilityResponse {
  venueId: string;
  date: string;
  partySize: number;
  isAvailable: boolean;
  reason: string;
  availableSlots: AvailabilitySlot[];
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Declined' | 'Cancelled';

export interface BookingDto {
  id: string;
  venueId: string;
  customerId: string;
  startUtc: string;
  endUtc: string;
  partySize: number;
  status: BookingStatus;
  venueComment: string | null;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserDto;
  token: string;
  customerId: string | null;
  venueId: null;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface RegisterResponse {
  user: UserDto;
  customer: CustomerDto;
  token: string;
}

export interface CreateBookingRequest {
  venueId: string;
  customerId: string;
  startUtc: string;
  endUtc: string;
  partySize: number;
}

export interface UpdateCustomerRequest {
  email: string | null;
  phone: string | null;
  locale: string;
  name: string | null;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  userId: string;
  code: string;
}

export interface ResendVerificationRequest {
  userId: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}
