'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Crown, Star, X, Zap } from "lucide-react";
import { Button } from "../ui/button";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
  usageCount: number;
  usageLimit: number;
}

const PaymentModal = ({
  isOpen,
  onClose,
  onUpgrade,
  usageCount,
  usageLimit,
}: PaymentModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md glass rounded-2xl p-6 border border-card-border shadow-glow-primary"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                <Crown className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Upgrade to Pro
              </h2>
              <p className="text-muted-foreground">
                You've used {usageCount}/{usageLimit} free uploads
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-6">
              {[
                { icon: Check, title: "Unlimited Uploads", desc: "No more usage limits" },
                { icon: Zap, title: "Priority Processing", desc: "Faster AI processing" },
                { icon: Star, title: "Premium Effects", desc: "Access to advanced AI tools" },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="bg-muted/50 rounded-xl p-4 mb-6 text-center">
              <p className="text-sm text-muted-foreground">Pro Plan</p>
              <div className="flex justify-center items-center space-x-2">
                <span className="text-3xl font-bold text-foreground">$19</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={onUpgrade ?? handleUpgrade}
                disabled={isLoading}
                className="w-full bg-gradient-primary text-primary-foreground"
              >
                {isLoading ? "Processing..." : "Start Pro Plan"}
              </Button>

              <Button variant="outline" onClick={onClose} className="w-full">
                Maybe Later
              </Button>
            </div>

                {/* Footer */}
            <p className="text-xs text-muted-foreground text-center mt-4">
              By upgrading, you agree to our Terms & Privacy Policy
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
