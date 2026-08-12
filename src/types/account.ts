import type { Product } from "./product";

export interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  memberSince: string;
}

export type OrderStatus = "processing" | "shipped" | "out-for-delivery" | "delivered" | "cancelled" | "returned";

export interface OrderItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface OrderTrackingEvent {
  label: string;
  date: string;
  done: boolean;
}

export interface Order {
  id: string;
  placedAt: string;
  status: OrderStatus;
  items: OrderItem[];
  currency: string;
  paymentLabel: string;
  shippingAddressId: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  cancelledReason?: string;
}

export type AddressType = "home" | "work" | "other";

export interface Address {
  id: string;
  label: string;
  type: AddressType;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export type ReturnStatus = "requested" | "approved" | "rejected" | "refunded";

export interface ReturnRequest {
  id: string;
  orderId: string;
  product: Product;
  reason: string;
  status: ReturnStatus;
  requestedAt: string;
  resolvedAt?: string;
  refundAmount: number;
  currency: string;
}

export interface NotificationPrefs {
  email: {
    orderUpdates: boolean;
    promotions: boolean;
    priceDrop: boolean;
    backInStock: boolean;
    newsletter: boolean;
  };
}

export type AccountSectionId =
  | "overview"
  | "orders"
  | "addresses"
  | "wishlist"
  | "security"
  | "notifications"
  | "support"
  | "returns"
  | "settings";
