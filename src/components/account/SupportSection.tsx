"use client";

import { useState, type FormEvent } from "react";
import { Mail, MessageSquareText } from "lucide-react";
import { Accordion, Button, Input } from "@/components/ui";
import { CONTACT_ACTIONS, SITE } from "@/constants/site";

const FAQS = [
  {
    id: "track-order",
    question: "How do I track my order?",
    answer:
      "Open My Orders from your account dashboard and select any order marked Shipped or Out for Delivery to view live carrier tracking and the estimated delivery date.",
  },
  {
    id: "return-policy",
    question: "What is your return policy?",
    answer:
      "Most pieces can be returned within 30 days of delivery in original, unworn condition with the original packaging and certification. Start a request from the Returns & Refunds tab.",
  },
  {
    id: "resize-ring",
    question: "How do I resize my ring?",
    answer:
      "Complimentary resizing is included within 60 days of delivery. Reach out through Support with your order number and we'll arrange collection and return shipping.",
  },
  {
    id: "certification",
    question: "How can I verify my diamond's certification?",
    answer:
      "Every certified diamond ships with an independent grading report. The certificate number and issuing lab are listed on your order detail page, and most reports can be verified directly on the lab's website.",
  },
  {
    id: "international-shipping",
    question: "Do you offer international shipping?",
    answer:
      "Yes — we ship to over 30 countries with fully insured, signature-required delivery. Duties and taxes are calculated at checkout so there are no surprises on arrival.",
  },
  {
    id: "payment-plans",
    question: "Do you offer payment plans?",
    answer: "Select 0% APR financing is available at checkout on qualifying purchases, letting you split your order into monthly instalments.",
  },
];

export function SupportSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const form = event.currentTarget;
    setTimeout(() => {
      setStatus("success");
      form.reset();
    }, 900);
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="font-display text-2xl text-ink">Support & Help</h2>
        <p className="mt-1 text-sm text-warm-600">We&apos;re here to help, every step of the way.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <a
          href={CONTACT_ACTIONS.email}
          className="flex flex-col gap-3 border border-warm-200 bg-white p-5 transition-colors duration-300 hover:border-gold-400"
        >
          <span className="flex h-10 w-10 items-center justify-center bg-gold-50 text-gold-600">
            <Mail size={17} />
          </span>
          <div>
            <p className="text-sm font-medium text-ink">Email Us</p>
            <p className="mt-0.5 text-xs text-warm-500">{SITE.email}</p>
            <p className="text-xs text-warm-500">{SITE.hours}</p>
          </div>
        </a>
      </div>

      <div className="border border-warm-200 bg-white p-6">
        <h3 className="flex items-center gap-2 font-display text-lg text-ink">
          <MessageSquareText size={17} className="text-gold-600" /> Send Us a Message
        </h3>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Subject</span>
            <Input required placeholder="Order #FJ-100482 tracking question" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Message</span>
            <textarea
              required
              rows={4}
              placeholder="How can we help?"
              className="w-full resize-none border-b border-warm-300 bg-transparent py-3 text-sm text-ink outline-none transition-colors duration-300 placeholder:text-warm-400 focus:border-gold-500"
            />
          </label>
          <Button type="submit" variant="primary" size="md" disabled={status === "loading"} className="self-start">
            {status === "loading" ? "Sending…" : "Send Message"}
          </Button>
          {status === "success" && <p className="text-sm text-gold-700">Thank you — our team will respond within 24 hours.</p>}
        </form>
      </div>

      <div>
        <h3 className="mb-4 font-display text-lg text-ink">Frequently Asked Questions</h3>
        <div className="border border-warm-200 bg-white px-6">
          <Accordion items={FAQS} />
        </div>
      </div>
    </div>
  );
}
