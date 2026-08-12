"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProfileHeader } from "./ProfileHeader";
import { AccountNav } from "./AccountNav";
import { AccountOverview } from "./AccountOverview";
import { OrdersSection } from "./OrdersSection";
import { AddressesSection } from "./AddressesSection";
import { WishlistSection } from "./WishlistSection";
import { SecuritySection } from "./SecuritySection";
import { NotificationsSection } from "./NotificationsSection";
import { SupportSection } from "./SupportSection";
import { ReturnsSection } from "./ReturnsSection";
import { SettingsSection } from "./SettingsSection";
import {
  CURRENT_CUSTOMER,
  DEFAULT_NOTIFICATION_PREFS,
  MOCK_ADDRESSES,
  MOCK_ORDERS,
  MOCK_RETURNS,
  MOCK_WISHLIST_PRODUCTS,
} from "@/data/account";
import type { AccountSectionId } from "@/types";

export function AccountDashboardClient() {
  const [activeSection, setActiveSection] = useState<AccountSectionId>("overview");
  const [customer, setCustomer] = useState(CURRENT_CUSTOMER);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [wishlistItems, setWishlistItems] = useState(MOCK_WISHLIST_PRODUCTS);
  const [notificationPrefs, setNotificationPrefs] = useState(DEFAULT_NOTIFICATION_PREFS);
  const [returns, setReturns] = useState(MOCK_RETURNS);

  function handleCancelOrder(orderId: string) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: "cancelled" as const, cancelledReason: "Cancelled by you before processing" }
          : order
      )
    );
  }

  function handleNavigate(section: AccountSectionId) {
    setActiveSection(section);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto max-w-360 px-5 pt-36 pb-20 sm:px-8 sm:pt-40 lg:px-12 lg:pt-52">
      <ProfileHeader customer={customer} onEditProfile={() => handleNavigate("settings")} />

      <div className="mt-8 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-10">
        <AccountNav active={activeSection} onChange={handleNavigate} />

        <main className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeSection === "overview" && (
                <AccountOverview
                  customer={customer}
                  orders={orders}
                  wishlistCount={wishlistItems.length}
                  addressCount={addresses.length}
                  onNavigate={handleNavigate}
                />
              )}
              {activeSection === "orders" && (
                <OrdersSection orders={orders} addresses={addresses} onCancelOrder={handleCancelOrder} />
              )}
              {activeSection === "addresses" && <AddressesSection addresses={addresses} onChange={setAddresses} />}
              {activeSection === "wishlist" && <WishlistSection items={wishlistItems} onChange={setWishlistItems} />}
              {activeSection === "security" && <SecuritySection />}
              {activeSection === "notifications" && (
                <NotificationsSection prefs={notificationPrefs} onChange={setNotificationPrefs} />
              )}
              {activeSection === "support" && <SupportSection />}
              {activeSection === "returns" && (
                <ReturnsSection returns={returns} orders={orders} onChange={setReturns} />
              )}
              {activeSection === "settings" && <SettingsSection customer={customer} onChange={setCustomer} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
