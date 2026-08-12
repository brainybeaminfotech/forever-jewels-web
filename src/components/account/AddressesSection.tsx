"use client";

import { useState, type FormEvent } from "react";
import { Building2, Home, MapPin, Pencil, Plus, Star, Trash2, type LucideIcon } from "lucide-react";
import { Button, Input, Modal } from "@/components/ui";
import type { Address, AddressType } from "@/types";

interface AddressesSectionProps {
  addresses: Address[];
  onChange: (addresses: Address[]) => void;
}

const TYPE_ICON: Record<AddressType, LucideIcon> = { home: Home, work: Building2, other: MapPin };

const EMPTY_FORM: Omit<Address, "id" | "isDefault"> = {
  label: "",
  type: "home",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
};

export function AddressesSection({ addresses, onChange }: AddressesSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(address: Address) {
    setEditingId(address.id);
    setForm(address);
    setModalOpen(true);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setTimeout(() => {
      if (editingId) {
        onChange(addresses.map((a) => (a.id === editingId ? { ...a, ...form } : a)));
      } else {
        const newAddress: Address = { ...form, id: `addr-${Date.now()}`, isDefault: addresses.length === 0 };
        onChange([...addresses, newAddress]);
      }
      setSaving(false);
      setModalOpen(false);
    }, 700);
  }

  function setDefault(id: string) {
    onChange(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
  }

  function remove(id: string) {
    onChange(addresses.filter((a) => a.id !== id));
    setConfirmDeleteId(null);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-ink">Saved Addresses</h2>
          <p className="mt-1 text-sm text-warm-600">Manage the addresses used at checkout.</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={openAdd} className="hidden sm:inline-flex">
          Add Address
        </Button>
      </div>

      <button
        type="button"
        onClick={openAdd}
        className="mb-4 flex w-full items-center justify-center gap-2 border border-dashed border-warm-300 py-3 text-xs uppercase tracking-[0.1em] text-warm-600 hover:border-gold-400 hover:text-ink sm:hidden"
      >
        <Plus size={14} /> Add Address
      </button>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 border border-dashed border-warm-300 px-6 py-16 text-center">
          <MapPin size={28} className="text-warm-400" />
          <p className="text-sm text-warm-500">You haven&apos;t saved any addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => {
            const Icon = TYPE_ICON[address.type];
            const confirming = confirmDeleteId === address.id;
            return (
              <div key={address.id} className="flex flex-col gap-3 border border-warm-200 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-ink">
                    <Icon size={15} className="text-gold-600" />
                    {address.label}
                  </span>
                  {address.isDefault && (
                    <span className="inline-flex items-center gap-1 bg-gold-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-gold-700">
                      <Star size={10} className="fill-gold-600 text-gold-600" /> Default
                    </span>
                  )}
                </div>
                <div className="text-sm leading-relaxed text-warm-600">
                  <p className="text-ink">{address.fullName}</p>
                  <p>
                    {address.line1}
                    {address.line2 ? `, ${address.line2}` : ""}
                  </p>
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                  <p className="mt-1">{address.phone}</p>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-4 border-t border-warm-100 pt-3 text-xs uppercase tracking-[0.1em]">
                  <button
                    type="button"
                    onClick={() => openEdit(address)}
                    className="inline-flex items-center gap-1.5 text-warm-600 hover:text-gold-600"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  {!address.isDefault && (
                    <button
                      type="button"
                      onClick={() => setDefault(address.id)}
                      className="inline-flex items-center gap-1.5 text-warm-600 hover:text-gold-600"
                    >
                      <Star size={12} /> Set Default
                    </button>
                  )}
                  {confirming ? (
                    <span className="inline-flex items-center gap-2 normal-case tracking-normal text-warm-600">
                      Delete?
                      <button
                        type="button"
                        onClick={() => remove(address.id)}
                        className="font-medium text-red-600 hover:text-red-700"
                      >
                        Yes
                      </button>
                      <button type="button" onClick={() => setConfirmDeleteId(null)} className="hover:text-ink">
                        No
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(address.id)}
                      className="ml-auto inline-flex items-center gap-1.5 text-warm-500 hover:text-red-600"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Address" : "Add New Address"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <label className="col-span-2 flex flex-col gap-1.5 sm:col-span-1">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Address Label</span>
              <Input required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Home, Office…" />
            </label>
            <label className="col-span-2 flex flex-col gap-1.5 sm:col-span-1">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Type</span>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as AddressType })}
                className="border-b border-warm-300 bg-transparent py-3 text-sm text-ink outline-none transition-colors duration-300 focus:border-gold-500"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="col-span-2 flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Full Name</span>
              <Input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </label>
            <label className="col-span-2 flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Phone</span>
              <Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </label>
            <label className="col-span-2 flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Address Line 1</span>
              <Input required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
            </label>
            <label className="col-span-2 flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Address Line 2 (optional)</span>
              <Input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">City</span>
              <Input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">State</span>
              <Input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Postal Code</span>
              <Input required value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Country</span>
              <Input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </label>
          </div>
          <Button type="submit" variant="primary" size="md" fullWidth disabled={saving}>
            {saving ? "Saving…" : editingId ? "Save Changes" : "Add Address"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
