"use client";

import { useState, type FormEvent } from "react";
import { Save, UserCog } from "lucide-react";
import { Button, Input } from "@/components/ui";
import type { CustomerProfile } from "@/types";

interface SettingsSectionProps {
  customer: CustomerProfile;
  onChange: (customer: CustomerProfile) => void;
}

export function SettingsSection({ customer, onChange }: SettingsSectionProps) {
  const [form, setForm] = useState({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    dob: "1994-06-12",
    gender: "female",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setTimeout(() => {
      onChange({ ...customer, firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone });
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2500);
    }, 800);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-2xl text-ink">Account Settings</h2>
        <p className="mt-1 text-sm text-warm-600">Update your personal details and preferences.</p>
      </div>

      <div className="border border-warm-200 bg-white p-6">
        <h3 className="flex items-center gap-2 font-display text-lg text-ink">
          <UserCog size={17} className="text-gold-600" /> Personal Information
        </h3>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">First Name</span>
              <Input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Last Name</span>
              <Input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Email Address</span>
              <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Phone Number</span>
              <Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Date of Birth</span>
              <Input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Gender</span>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="border-b border-warm-300 bg-transparent py-3 text-sm text-ink outline-none transition-colors duration-300 focus:border-gold-500"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </label>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<Save size={14} />}
            disabled={status === "loading"}
            className="self-start"
          >
            {status === "loading" ? "Saving…" : "Save Changes"}
          </Button>
          {status === "success" && <p className="text-sm text-gold-700">Your profile has been updated.</p>}
        </form>
      </div>
    </div>
  );
}
