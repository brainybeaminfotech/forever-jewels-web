"use client";

import { useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import { isRemoteImage } from "@/lib/images";
import { PackageX, Plus, RotateCcw } from "lucide-react";
import { Button, Modal, StatusBadge } from "@/components/ui";
import { getReturnStatusMeta } from "@/lib/account";
import type { Order, ReturnRequest } from "@/types";
import { formatDate, formatPrice } from "@/utils/format";

interface ReturnsSectionProps {
  returns: ReturnRequest[];
  orders: Order[];
  onChange: (returns: ReturnRequest[]) => void;
}

const POLICY_POINTS = [
  "Returns are accepted within 30 days of delivery, in original, unworn condition.",
  "Items must include their original packaging, authentication card, and certification (if applicable).",
  "Custom and engraved pieces are final sale and not eligible for return.",
  "Approved refunds are issued to your original payment method within 5–7 business days.",
];

export function ReturnsSection({ returns, orders, onChange }: ReturnsSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const eligibleItems = useMemo(
    () =>
      orders
        .filter((order) => order.status === "delivered")
        .flatMap((order) => order.items.map((item) => ({ order, item }))),
    [orders]
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const match = eligibleItems.find(({ order, item }) => `${order.id}::${item.product.id}` === selectedItem);
    if (!match) return;
    setSaving(true);
    setTimeout(() => {
      const newReturn: ReturnRequest = {
        id: `RET-${Math.floor(10000 + Math.random() * 89999)}`,
        orderId: match.order.id,
        product: match.item.product,
        reason,
        status: "requested",
        requestedAt: new Date().toISOString().slice(0, 10),
        refundAmount: match.item.unitPrice * match.item.quantity,
        currency: match.order.currency,
      };
      onChange([newReturn, ...returns]);
      setSaving(false);
      setModalOpen(false);
      setSelectedItem("");
      setReason("");
    }, 700);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-ink">Returns & Refunds</h2>
          <p className="mt-1 text-sm text-warm-600">Track return requests and start new ones.</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={() => setModalOpen(true)}
          disabled={eligibleItems.length === 0}
          className="hidden sm:inline-flex"
        >
          Start a Return
        </Button>
      </div>

      <div className="mb-6 border border-warm-200 bg-warm-50 p-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-ink">Return Policy</p>
        <ul className="flex flex-col gap-2">
          {POLICY_POINTS.map((point) => (
            <li key={point} className="flex items-start gap-2.5 text-sm text-warm-600">
              <span className="mt-2 h-1 w-1 shrink-0 bg-gold-500" />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {returns.length === 0 ? (
        <div className="flex flex-col items-center gap-3 border border-dashed border-warm-300 px-6 py-16 text-center">
          <RotateCcw size={28} className="text-warm-400" />
          <p className="text-sm text-warm-500">You have no return requests.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {returns.map((request) => {
            const statusMeta = getReturnStatusMeta(request.status);
            return (
              <div key={request.id} className="flex flex-col gap-4 border border-warm-200 bg-white p-5 sm:flex-row sm:items-center">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-warm-100">
                  <Image src={request.product.image} unoptimized={isRemoteImage(request.product.image)} alt={request.product.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{request.product.name}</p>
                  <p className="mt-0.5 text-xs text-warm-500">
                    {request.id} &middot; From order {request.orderId} &middot; Requested {formatDate(request.requestedAt)}
                  </p>
                  <p className="mt-1 text-xs text-warm-600">{request.reason}</p>
                </div>
                <div className="flex shrink-0 flex-col items-start gap-1.5 sm:items-end">
                  <StatusBadge label={statusMeta.label} tone={statusMeta.tone} />
                  <span className="text-sm font-medium text-ink">{formatPrice(request.refundAmount, request.currency)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        disabled={eligibleItems.length === 0}
        className="mt-4 flex w-full items-center justify-center gap-2 border border-dashed border-warm-300 py-3 text-xs uppercase tracking-[0.1em] text-warm-600 hover:border-gold-400 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50 sm:hidden"
      >
        <Plus size={14} /> Start a Return
      </button>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Start a Return"
        description="Select the item and let us know why it's coming back."
      >
        {eligibleItems.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <PackageX size={24} className="text-warm-400" />
            <p className="text-sm text-warm-500">You don&apos;t have any delivered items eligible for return right now.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Item</span>
              <select
                required
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="border-b border-warm-300 bg-transparent py-3 text-sm text-ink outline-none transition-colors duration-300 focus:border-gold-500"
              >
                <option value="" disabled>
                  Select an item…
                </option>
                {eligibleItems.map(({ order, item }) => (
                  <option key={`${order.id}::${item.product.id}`} value={`${order.id}::${item.product.id}`}>
                    {item.product.name} — Order {order.id}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Reason for Return</span>
              <textarea
                required
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell us what happened…"
                className="w-full resize-none border-b border-warm-300 bg-transparent py-3 text-sm text-ink outline-none transition-colors duration-300 placeholder:text-warm-400 focus:border-gold-500"
              />
            </label>
            <Button type="submit" variant="primary" size="md" fullWidth disabled={saving}>
              {saving ? "Submitting…" : "Submit Return Request"}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
