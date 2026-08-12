import {
  PackageSearch,
  Truck,
  PackageCheck,
  PackageX,
  RotateCcw,
  LayoutDashboard,
  Package,
  MapPin,
  Heart,
  ShieldCheck,
  Bell,
  LifeBuoy,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { Address, AccountSectionId, Order, OrderStatus, ReturnStatus } from "@/types";
import { formatDate, formatPrice } from "@/utils/format";

export interface AccountSectionMeta {
  id: AccountSectionId;
  label: string;
  icon: LucideIcon;
}

export const ACCOUNT_SECTIONS: AccountSectionMeta[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "support", label: "Support & Help", icon: LifeBuoy },
  { id: "returns", label: "Returns & Refunds", icon: RotateCcw },
  { id: "settings", label: "Settings", icon: Settings },
];

export type StatusTone = "success" | "info" | "processing" | "danger" | "neutral";

export interface StatusMeta {
  label: string;
  tone: StatusTone;
  icon: LucideIcon;
}

const ORDER_STATUS_META: Record<OrderStatus, StatusMeta> = {
  processing: { label: "Processing", tone: "processing", icon: PackageSearch },
  shipped: { label: "Shipped", tone: "info", icon: Truck },
  "out-for-delivery": { label: "Out for Delivery", tone: "info", icon: Truck },
  delivered: { label: "Delivered", tone: "success", icon: PackageCheck },
  cancelled: { label: "Cancelled", tone: "danger", icon: PackageX },
  returned: { label: "Returned", tone: "neutral", icon: RotateCcw },
};

export function getOrderStatusMeta(status: OrderStatus): StatusMeta {
  return ORDER_STATUS_META[status];
}

const RETURN_STATUS_META: Record<ReturnStatus, StatusMeta> = {
  requested: { label: "Requested", tone: "processing", icon: PackageSearch },
  approved: { label: "Approved", tone: "info", icon: PackageCheck },
  rejected: { label: "Rejected", tone: "danger", icon: PackageX },
  refunded: { label: "Refunded", tone: "success", icon: PackageCheck },
};

export function getReturnStatusMeta(status: ReturnStatus): StatusMeta {
  return RETURN_STATUS_META[status];
}

export function orderItemCount(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function orderTotal(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export interface OrderTimelineStep {
  label: string;
  date?: string;
  done: boolean;
  active: boolean;
}

const FORWARD_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "processing", label: "Order Placed" },
  { key: "shipped", label: "Shipped" },
  { key: "out-for-delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];
const FORWARD_ORDER: OrderStatus[] = FORWARD_STEPS.map((s) => s.key);

export function getOrderTimeline(order: Order): OrderTimelineStep[] {
  if (order.status === "cancelled") {
    return [
      { label: "Order Placed", date: order.placedAt, done: true, active: false },
      { label: "Cancelled", done: true, active: true },
    ];
  }
  if (order.status === "returned") {
    return [
      { label: "Order Placed", date: order.placedAt, done: true, active: false },
      { label: "Delivered", done: true, active: false },
      { label: "Returned & Refunded", done: true, active: true },
    ];
  }

  const currentIndex = FORWARD_ORDER.indexOf(order.status);
  return FORWARD_STEPS.map((step, index) => ({
    label: step.label,
    date: index === 0 ? order.placedAt : index === FORWARD_STEPS.length - 1 ? order.deliveredAt : undefined,
    done: index <= currentIndex,
    active: index === currentIndex,
  }));
}

export function buildInvoiceText(order: Order, address?: Address): string {
  const lines = [
    "FOREVER JEWELS",
    "-----------------------------------",
    `Invoice for Order ${order.id}`,
    `Placed: ${formatDate(order.placedAt)}`,
    `Payment Method: ${order.paymentLabel}`,
    "",
    "Items",
    "-----------------------------------",
    ...order.items.map(
      (item) => `${item.quantity} x ${item.product.name}${" ".repeat(2)}${formatPrice(item.unitPrice * item.quantity, order.currency)}`
    ),
    "-----------------------------------",
    `Total: ${formatPrice(orderTotal(order), order.currency)}`,
    "",
  ];

  if (address) {
    lines.push(
      "Shipping Address",
      "-----------------------------------",
      address.fullName,
      `${address.line1}${address.line2 ? `, ${address.line2}` : ""}`,
      `${address.city}, ${address.state} ${address.postalCode}`,
      address.country,
      ""
    );
  }

  lines.push("Thank you for shopping with Forever Jewels.");
  return lines.join("\n");
}

export function downloadInvoice(order: Order, address?: Address) {
  const blob = new Blob([buildInvoiceText(order, address)], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `forever-jewels-invoice-${order.id}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

