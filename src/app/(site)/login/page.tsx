import type { Metadata } from "next";
import { AuthLayout, LoginForm } from "@/components/auth";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Forever Jewels account to view your wishlist, orders, and saved designs.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      image={IMAGES.handcrafted.primary}
      eyebrow="Welcome Back"
      heading="Your story with Forever Jewels continues here."
      quote="Every piece we craft carries a promise — sign in to pick up where your journey left off, from saved favourites to past orders."
    >
      <LoginForm />
    </AuthLayout>
  );
}
