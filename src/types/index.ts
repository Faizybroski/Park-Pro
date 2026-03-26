export interface Booking {
  _id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  carMake: string;
  carModel: string;
  carNumber: string;
  carColor: string;
  slotId: string;
  slotNumber: number;
  trackingNumber: string;
  bookedStartTime: string;
  bookedEndTime: string;
  actualExitTime?: string;
  departureTerminal?: string;
  departureFlightNo?: string;
  arrivalTerminal?: string;
  arrivalFlightNo?: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  price: number;
  overtimeHours: number;
  overtimePrice: number;
  totalPrice: number;
  pricePerHour: number;
  discountPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Slot {
  _id: string;
  slotNumber: number;
  status: 'available' | 'occupied';
  currentBookingId?: Booking | null;
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
  todayBookings: number;
  slots: {
    total: number;
    available: number;
    occupied: number;
  };
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
