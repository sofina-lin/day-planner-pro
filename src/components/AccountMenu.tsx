import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  FileText,
  Shield,
  LogOut,
  Trash2,
  ChevronRight,
  X,
  Settings,
  Bell,
  HelpCircle,
} from "lucide-react";

interface AccountMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: User, label: "Profile", description: "View and edit your profile" },
  { icon: Bell, label: "Notifications", description: "Manage notification preferences" },
  { icon: Settings, label: "Preferences", description: "App settings and themes" },
  { icon: FileText, label: "Terms & Conditions", description: "Read our terms of service", dividerAfter: true },
  { icon: Shield, label: "Privacy Policy", description: "How we handle your data" },
  { icon: HelpCircle, label: "Help & Support", description: "FAQs and contact us", dividerAfter: true },
  { icon: LogOut, label: "Log Out", description: "Sign out of your account", variant: "default" as const },
  { icon: Trash2, label: "Delete Account", description: "Permanently remove your account", variant: "destructive" as const },
];

const AccountMenu = ({ isOpen, onClose }: AccountMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/40"
            onClick={onClose}
          />

          {/* Slide-up sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[80] rounded-t-3xl bg-card shadow-2xl"
            style={{ maxHeight: "85vh" }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">My Account</p>
                  <p className="text-xs text-muted-foreground">user@example.com</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-muted">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Menu items */}
            <div className="overflow-y-auto px-3 pb-8" style={{ maxHeight: "calc(85vh - 100px)" }}>
              {menuItems.map((item) => (
                <div key={item.label}>
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-muted transition-colors ${
                      item.variant === "destructive" ? "text-destructive" : "text-foreground"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        item.variant === "destructive"
                          ? "bg-destructive/10"
                          : "bg-muted"
                      }`}
                    >
                      <item.icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground">{item.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                  {item.dividerAfter && (
                    <div className="mx-4 my-1 border-t border-border" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AccountMenu;
