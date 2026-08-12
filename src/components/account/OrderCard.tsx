"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Download, RotateCw, Truck, X } from "lucide-react";
import { StatusBadge } from "@/components/ui";
import { useCommerce } from "@/hooks/useCommerce";
import type { Address, Order } from "@/types";
import { formatDate, formatPrice } from "@/utils/format";
import { downloadInvoice, getOrderStatusMeta, getOrderTimeline, orderItemCount, orderTotal } from "@/lib/account";
import { cn } from "@/lib/utils";

interface OrderCardProps {
  order: Order;
  address?: Address;
  compact?: boolean;
  onCancel?: (orderId: string) => void;
}

export function OrderCard({ order, address, compact = false, onCancel }: OrderCardProps) {
  const { addToCart } = useCommerce();
  const [expanded, setExpanded] = useState(false);
  const [reordered, setReordered] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const statusMeta = getOrderStatusMeta(order.status);
  const total = orderTotal(order);
  const itemCount = orderItemCount(order);
  const firstItem = order.items[0]!;
  const extraCount = order.items.length - 1;

  function handleReorder() {
    for (const item of order.items) addToCart(item.product, item.quantity);
    setReordered(true);
    setTimeout(() => setReordered(false), 2000);
  }

  function handleDownload() {
    downloadInvoice(order, address);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  }

  if (compact) {
    return (
      <div className="flex items-center gap-4 border border-warm-200 bg-white p-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-warm-100">
          <Image src={firstItem.product.image} alt={firstItem.product.name} fill sizes="56px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">
            {firstItem.product.name}
            {extraCount > 0 && <span className="text-warm-500"> +{extraCount} more</span>}
          </p>
          <p className="text-xs text-warm-500">
            {order.id} &middot; {formatDate(order.placedAt)}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <StatusBadge label={statusMeta.label} tone={statusMeta.tone} />
          <span className="text-sm font-medium text-ink">{formatPrice(total, order.currency)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-warm-200 bg-white transition-shadow duration-300 hover:shadow-luxury">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {order.items.slice(0, 3).map((item, i) => (
              <div
                key={item.product.id}
                style={{ zIndex: 3 - i }}
                className="relative h-16 w-16 shrink-0 overflow-hidden border-2 border-white bg-warm-100"
              >
                <Image src={item.product.image} alt={item.product.name} fill sizes="64px" className="object-cover" />
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-medium text-ink">Order {order.id}</p>
            <p className="mt-0.5 text-xs text-warm-500">
              Placed {formatDate(order.placedAt)} &middot; {itemCount} item{itemCount === 1 ? "" : "s"} &middot; {order.paymentLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1.5">
          <StatusBadge label={statusMeta.label} tone={statusMeta.tone} />
          <span className="text-base font-medium text-ink">{formatPrice(total, order.currency)}</span>
        </div>
      </div>

      {order.status !== "cancelled" && (order.trackingNumber || order.deliveredAt) && (
        <div className="flex items-center gap-2 border-t border-warm-100 bg-warm-50 px-5 py-3 text-xs text-warm-600">
          <Truck size={14} className="shrink-0 text-gold-600" />
          {order.status === "delivered" && order.deliveredAt ? (
            <span>Delivered {formatDate(order.deliveredAt)}</span>
          ) : (
            <span>
              {order.carrier} &middot; Tracking #{order.trackingNumber}
              {order.estimatedDelivery && <> &middot; Est. delivery {formatDate(order.estimatedDelivery)}</>}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-warm-200 px-5 py-3">
        <button
          type="button"
          onClick={handleReorder}
          className="inline-flex items-center gap-1.5 border border-ink px-4 py-2 text-xs uppercase tracking-[0.1em] text-ink transition-colors hover:border-navy hover:bg-navy hover:text-white"
        >
          {reordered ? <Check size={13} /> : <RotateCw size={13} />}
          {reordered ? "Added to Bag" : "Reorder"}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 border border-warm-300 px-4 py-2 text-xs uppercase tracking-[0.1em] text-warm-600 transition-colors hover:border-gold-400 hover:text-ink"
        >
          {downloaded ? <Check size={13} className="text-gold-600" /> : <Download size={13} />}
          Invoice
        </button>

        {order.status === "processing" &&
          onCancel &&
          (confirmingCancel ? (
            <span className="inline-flex items-center gap-2 text-xs text-warm-600">
              Cancel this order?
              <button
                type="button"
                onClick={() => onCancel(order.id)}
                className="font-medium text-red-600 hover:text-red-700"
              >
                Yes
              </button>
              <button type="button" onClick={() => setConfirmingCancel(false)} className="text-warm-500 hover:text-ink">
                No
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingCancel(true)}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] text-warm-500 hover:text-red-600"
            >
              <X size={13} /> Cancel Order
            </button>
          ))}

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="ml-auto inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] text-warm-600 hover:text-gold-600"
        >
          {expanded ? "Hide Details" : "View Details"}
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown size={14} />
          </motion.span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-warm-200"
          >
            <div className="grid grid-cols-1 gap-8 p-5 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-ink">Items</p>
                <div className="flex flex-col gap-3">
                  {order.items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <Link href={`/products/${item.product.slug}`} className="relative h-12 w-12 shrink-0 overflow-hidden bg-warm-100">
                        <Image src={item.product.image} alt={item.product.name} fill sizes="48px" className="object-cover" />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link href={`/products/${item.product.slug}`} className="truncate text-sm text-ink hover:text-gold-600">
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-warm-500">Qty {item.quantity}</p>
                      </div>
                      <span className="shrink-0 text-sm text-ink">{formatPrice(item.unitPrice * item.quantity, order.currency)}</span>
                    </div>
                  ))}
                </div>

                {order.cancelledReason && (
                  <p className="mt-4 border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">{order.cancelledReason}</p>
                )}

                {address && (
                  <div className="mt-5">
                    <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.15em] text-ink">Shipped To</p>
                    <p className="text-xs leading-relaxed text-warm-600">
                      {address.fullName}
                      <br />
                      {address.line1}
                      {address.line2 ? `, ${address.line2}` : ""}
                      <br />
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-ink">Order Status</p>
                <ol className="flex flex-col gap-4">
                  {getOrderTimeline(order).map((step, index) => (
                    <li key={step.label} className="flex items-start gap-3">
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                          step.done ? "border-gold-500 bg-gold-500 text-ink" : "border-warm-300 text-warm-400"
                        )}
                      >
                        {index + 1}
                      </span>
                      <span className="flex flex-col">
                        <span className={cn("text-sm", step.active ? "font-medium text-ink" : step.done ? "text-ink" : "text-warm-400")}>
                          {step.label}
                        </span>
                        {step.date && <span className="text-xs text-warm-500">{formatDate(step.date)}</span>}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
