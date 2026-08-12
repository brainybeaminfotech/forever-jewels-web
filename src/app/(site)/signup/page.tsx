import type { Metadata } from "next";
import { AuthLayout, SignupForm } from "@/components/auth";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a Forever Jewels account for early access to new collections, order tracking, and a saved wishlist.",
};

export default function SignupPage() {
  return (
    <AuthLayout
      image={IMAGES.collections[1]}
      eyebrow="Join Forever Jewels"
      heading="Begin your forever, beautifully."
      quote="Create an account for early access to new collections, effortless order tracking, and a wishlist that's always within reach."
    >
      <SignupForm />
    </AuthLayout>
  );
}
