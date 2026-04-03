export type BookingStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';
export type LateChargeMode = 'none' | 'pending' | 'finalized';
export type PaymentStatus = 'awaiting_payment' | 'paid';

export interface Booking {
  _id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  carMake: string;
  carModel: string;
  carNumber: string;
  carColor: string;
  trackingNumber: string;
  bookedStartTime: string;
  bookedEndTime: string;
  actualExitTime?: string | null;
  departureTerminal?: string;
  departureFlightNo?: string;
  arrivalTerminal?: string;
  arrivalFlightNo?: string;
  status: BookingStatus;
  paymentStatus?: PaymentStatus;
  stripeSessionId?: string;
  statusLabel?: string;
  canActivate?: boolean;
  canComplete?: boolean;
  canCancel?: boolean;
  isOvertimeRunning?: boolean;
  timeUntilStartHours?: number;
  timeRemainingHours?: number;
  uptimeHours?: number;
  uptimePrice?: number;
  currentTotalPrice?: number;
  lateChargeMode?: LateChargeMode;
  price: number;
  overtimeHours: number;
  overtimePrice: number;
  totalPrice: number;
  pricePerHour: number;
  discountPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface PricingConfig {
  _id: string;
  pricePerHour: number;
  discountRules: { minDays: number; percentage: number }[];
  createdAt: string;
  updatedAt: string;
}

export interface PriceCalculation {
  totalHours: number;
  totalDays: number;
  pricePerHour: number;
  basePrice: number;
  discountPercent: number;
  discountAmount: number;
  finalPrice: number;
}

export interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  upcomingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  overtimeRevenue: number;
  stripeRevenue: number;
  baseRevenue: number;
  todayBookings: number;
  bookingEnabled: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: { field: string; message: string }[];
}

export interface PaginatedResponse<T> {
  bookings: T[];
  total: number;
  page: number;
  totalPages: number;
}
