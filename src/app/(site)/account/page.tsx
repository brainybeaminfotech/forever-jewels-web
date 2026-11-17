import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AccountDashboardClient } from "@/components/account";
import { AUTH_TOKEN } from "@utils/constants";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your Forever Jewels orders, wishlist, addresses, and account settings.",
};

export default async function AccountPage() {
  // Same cookie `getToken()` reads. The login form doesn't set it yet, so every visitor is sent to /login
  // and the dashboard's mock data stays hidden until real auth exists.
  if (!(await cookies()).get(AUTH_TOKEN)?.value) redirect("/login");

  return <AccountDashboardClient />;
}
