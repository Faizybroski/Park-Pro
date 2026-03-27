import {
  ApiResponse,
  Booking,
  DashboardStats,
  PaginatedResponse,
  PriceCalculation,
  PricingConfig,
  Slot,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BUSINESS_ID =
  process.env.NEXT_PUBLIC_BUSINESS_ID || "69c58c8616860ff720b40e4c";
class ApiClient {
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("parkpro_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "X-Business-Id": BUSINESS_ID,
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
      // credentials: "include",
    };

    // if (token) {
    //   headers["Authorization"] = `Bearer ${token}`;
    // }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    if (res.headers.get("content-type")?.includes("text/csv")) {
      return (await res.text()) as unknown as T;
    }

    return res.json();
  }

  // Public booking endpoints
  async createBooking(
    data: Record<string, unknown>,
  ): Promise<ApiResponse<Booking>> {
    return this.request("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async trackBooking(trackingNumber: string): Promise<ApiResponse<Booking>> {
    return this.request(`/bookings/${trackingNumber}`);
  }

  async calculatePrice(
    startTime: string,
    endTime: string,
  ): Promise<ApiResponse<PriceCalculation>> {
    return this.request(
      `/bookings/price?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`,
    );
  }

  // Auth
  async login(
    email: string,
    password: string,
  ): Promise<
    ApiResponse<{ token: string; admin: { name: string; email: string } }>
  > {
    return this.request("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request("/admin/logout", {
      method: "POST",
    });
  }

  // Admin endpoints
  async getDashboard(): Promise<ApiResponse<DashboardStats>> {
    return this.request("/admin/dashboard");
  }

  async getBookings(params: {
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set("status", params.status);
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.search) searchParams.set("search", params.search);
    return this.request(`/admin/bookings?${searchParams.toString()}`);
  }

  async updateBookingStatus(
    id: string,
    status: string,
    actualExitTime?: string,
  ): Promise<ApiResponse<Booking>> {
    return this.request(`/admin/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, actualExitTime }),
    });
  }

  async exportBookings(status?: string): Promise<string> {
    const searchParams = status ? `?status=${status}` : "";
    return this.request(`/admin/bookings/export${searchParams}`);
  }

  async getSlots(status?: string): Promise<
    ApiResponse<{
      slots: Slot[];
      stats: { total: number; available: number; occupied: number };
    }>
  > {
    const searchParams = status ? `?status=${status}` : "";
    return this.request(`/admin/slots${searchParams}`);
  }

  async updateSlot(
    id: string,
    status: "available" | "occupied",
  ): Promise<ApiResponse<Slot>> {
    return this.request(`/admin/slots/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async getPricing(): Promise<ApiResponse<PricingConfig>> {
    return this.request("/admin/pricing");
  }

  async updatePricing(data: {
    pricePerHour: number;
    discountRules: { minDays: number; percentage: number }[];
  }): Promise<ApiResponse<PricingConfig>> {
    return this.request("/admin/pricing", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
