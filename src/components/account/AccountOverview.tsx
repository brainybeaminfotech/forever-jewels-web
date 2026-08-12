"use client";

import { motion } from "framer-motion";
import { ArrowRight, Heart, MapPin, Package, type LucideIcon } from "lucide-react";
import { OrderCard } from "./OrderCard";
import { useCountUp } from "@/hooks/useCountUp";
import type { AccountSectionId, CustomerProfile, Order } from "@/types";

interface AccountOverviewProps {
  customer: CustomerProfile;
  orders: Order[];
  wishlistCount: number;
  addressCount: number;
  onNavigate: (section: AccountSectionId) => void;
}

function StatCard({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  onClick: () => void;
}) {
  const { ref, value: animated } = useCountUp(value);
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-start gap-3 border border-warm-200 bg-white p-5 text-left transition-shadow duration-300 hover:shadow-luxury"
    >
      <span className="flex h-9 w-9 items-center justify-center bg-gold-50 text-gold-600">
        <Icon size={17} />
      </span>
      <span ref={ref} className="font-display text-2xl text-ink sm:text-3xl">
        {animated}
      </span>
      <span className="text-xs uppercase tracking-[0.15em] text-warm-500">{label}</span>
    </motion.button>
  );
}

export function AccountOverview({ customer, orders, wishlistCount, addressCount, onNavigate }: AccountOverviewProps) {
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="font-display text-2xl text-ink">Welcome back, {customer.firstName}</h2>
        <p className="mt-1 text-sm text-warm-600">Here&apos;s a snapshot of your Forever Jewels account.</p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard icon={Package} label="Total Orders" value={orders.length} onClick={() => onNavigate("orders")} />
          <StatCard icon={Heart} label="Wishlist Items" value={wishlistCount} onClick={() => onNavigate("wishlist")} />
          <StatCard icon={MapPin} label="Saved Addresses" value={addressCount} onClick={() => onNavigate("addresses")} />
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl text-ink">Recent Orders</h3>
          <button
            type="button"
            onClick={() => onNavigate("orders")}
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.1em] text-warm-600 hover:text-gold-600"
          >
            View All <ArrowRight size={13} />
          </button>
        </div>
        {recentOrders.length > 0 ? (
          <div className="flex flex-col gap-3">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} compact />
            ))}
          </div>
        ) : (
          <p className="text-sm text-warm-500">You haven&apos;t placed any orders yet.</p>
        )}
      </div>
    </div>
  );
}
