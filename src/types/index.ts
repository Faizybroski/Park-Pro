export type BookingStatus = "upcoming" | "active" | "completed" | "cancelled";
export type LateChargeMode = "none" | "pending" | "finalized";
export type PaymentStatus = "awaiting_payment" | "paid";

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
  bookedDays: number;
  overtimeDays: number;
  uptimeDays?: number;
  uptimeHours?: number;
  uptimePrice?: number;
  currentTotalPrice?: number;
  lateChargeMode?: LateChargeMode;
  firstTenDayPricesSnapshot?: number[];
  day11To30Increment?: number;
  day31PlusIncrement?: number;
  price: number;
  overtimePrice: number;
  totalPrice: number;
  pricePerHour?: number;
  discountPercent?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PricingConfig {
  _id: string;
  firstTenDayPrices: number[];
  createdAt: string;
  updatedAt: string;
}

export interface PriceCalculation {
  totalHours: number;
  totalDays: number;
  firstTenDayPrices: number[];
  day11To30Increment: number;
  day31PlusIncrement: number;
  basePrice: number;
  finalPrice: number;
  pricePerHour?: number;
  discountPercent?: number;
  discountAmount?: number;
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
