"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { FadeIn } from "@/components/animations";

const SUBJECTS = ["General Enquiry", "Bespoke Commission", "Order & Delivery", "Repairs & Servicing", "Careers"];

/**
 * There is no backend to post to, so this validates and shows a confirmation state
 * rather than pretending to send. Wire `onSubmit` to a real endpoint when one exists.
 */
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <FadeIn direction="up" className="border border-warm-200 bg-white p-10 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center bg-gold-500 text-ink">
          <Check size={22} />
        </span>
        <p className="mt-6 font-display text-2xl text-ink">Thank you — we have your message.</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-warm-600">
          One of our client advisors will reply within one business day. For anything urgent, call us and ask for the
          atelier directly.
        </p>
        <Button variant="outline" className="mt-8" onClick={() => setSubmitted(false)}>
          Send Another Message
        </Button>
      </FadeIn>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-warm-200 bg-white p-8 sm:p-10">
      <p className="font-display text-2xl text-ink sm:text-3xl">Send us a message</p>
      <p className="mt-3 text-sm leading-relaxed text-warm-600">
        Fields marked with an asterisk are required. We reply within one business day.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="text-xs uppercase tracking-[0.2em] text-warm-500">
            Full Name *
          </label>
          <Input id="contact-name" name="name" required autoComplete="name" placeholder="Jane Doe" />
        </div>
        <div>
          <label htmlFor="contact-email" className="text-xs uppercase tracking-[0.2em] text-warm-500">
            Email *
          </label>
          <Input id="contact-email" name="email" type="email" required autoComplete="email" placeholder="jane@example.com" />
        </div>
        <div>
          <label htmlFor="contact-phone" className="text-xs uppercase tracking-[0.2em] text-warm-500">
            Phone
          </label>
          <Input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="+1 917 302 9312" />
        </div>
        <div>
          <label htmlFor="contact-subject" className="text-xs uppercase tracking-[0.2em] text-warm-500">
            Subject *
          </label>
          <select
            id="contact-subject"
            name="subject"
            required
            defaultValue={SUBJECTS[0]}
            className="w-full border-b border-warm-300 bg-transparent py-3 text-sm text-ink outline-none transition-colors duration-300 focus:border-gold-500"
          >
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="contact-message" className="text-xs uppercase tracking-[0.2em] text-warm-500">
          Message *
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Tell us what you have in mind…"
          className="w-full resize-none border-b border-warm-300 bg-transparent py-3 text-sm text-ink outline-none transition-colors duration-300 placeholder:text-warm-400 focus:border-gold-500"
        />
      </div>

      <Button type="submit" className="mt-8" fullWidth>
        Send Message
      </Button>
    </form>
  );
}
