"use client";

import { useMemo, useState } from "react";
import { PackageOpen } from "lucide-react";
import { OrderCard } from "./OrderCard";
import type { Address, Order, OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

interface OrdersSectionProps {
  orders: Order[];
  addresses: Address[];
  onCancelOrder: (orderId: string) => void;
}

const FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All Orders" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "out-for-delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
];

export function OrdersSection({ orders, addresses, onCancelOrder }: OrdersSectionProps) {
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const filtered = useMemo(
    () => (filter === "all" ? orders : orders.filter((order) => order.status === filter)),
    [orders, filter]
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="font-display text-2xl text-ink">My Orders</h2>
        <p className="text-sm text-warm-600">Track packages, download invoices, and reorder past favourites.</p>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "shrink-0 whitespace-nowrap border px-4 py-2 text-xs uppercase tracking-[0.1em] transition-colors duration-300",
              filter === f.value
                ? "border-navy bg-navy text-white"
                : "border-warm-200 text-warm-600 hover:border-gold-400 hover:text-ink"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 border border-dashed border-warm-300 px-6 py-16 text-center">
          <PackageOpen size={28} className="text-warm-400" />
          <p className="text-sm text-warm-500">No orders match this filter.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              address={addresses.find((a) => a.id === order.shippingAddressId)}
              onCancel={onCancelOrder}
            />
          ))}
        </div>
      )}
    </div>
  );
}
