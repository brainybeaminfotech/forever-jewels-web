import type { Metadata } from "next";
import { AccountDashboardClient } from "@/components/account";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your Forever Jewels orders, wishlist, addresses, and account settings.",
};

export default function AccountPage() {
  return <AccountDashboardClient />;
}
