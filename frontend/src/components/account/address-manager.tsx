"use client";

import * as React from "react";
import { MapPin, Plus, Trash2, CheckCircle2, Star, AlertCircle, X } from "lucide-react";
import {
  createAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/lib/account/actions";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database.types";

type AddressRow = Database["public"]["Tables"]["addresses"]["Row"];

export interface AddressManagerProps {
  initialAddresses: AddressRow[];
}

export function AddressManager({ initialAddresses }: AddressManagerProps) {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activeActionId, setActiveActionId] = React.useState<string | null>(null);

  // Form states
  const [label, setLabel] = React.useState("Home");
  const [recipientName, setRecipientName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [line1, setLine1] = React.useState("");
  const [line2, setLine2] = React.useState("");
  const [city, setCity] = React.useState("Dhaka");
  const [postalCode, setPostalCode] = React.useState("");
  const [isDefault, setIsDefault] = React.useState(false);

  const [feedback, setFeedback] = React.useState<{
    success?: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await createAddressAction({
        label,
        recipient_name: recipientName,
        phone,
        line1,
        line2,
        city,
        postal_code: postalCode,
        country: "Bangladesh",
        is_default: isDefault,
      });

      setFeedback(res);
      if (res.success) {
        setShowAddForm(false);
        setRecipientName("");
        setPhone("");
        setLine1("");
        setLine2("");
        setPostalCode("");
        setIsDefault(false);
      }
    } catch {
      setFeedback({ success: false, error: "Failed to create address." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this address?")) return;
    setActiveActionId(id);
    setFeedback(null);
    try {
      const res = await deleteAddressAction(id);
      setFeedback(res);
    } catch {
      setFeedback({ success: false, error: "Failed to delete address." });
    } finally {
      setActiveActionId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    setActiveActionId(id);
    setFeedback(null);
    try {
      const res = await setDefaultAddressAction(id);
      setFeedback(res);
    } catch {
      setFeedback({ success: false, error: "Failed to update default address." });
    } finally {
      setActiveActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Add Trigger */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2C221E]">
            Saved Pickup Locations
          </h2>
          <p className="text-xs text-[#5C4A3D] font-sans">
            Manage your personal addresses for quick checkout and invoice generation.
          </p>
        </div>

        {!showAddForm && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="border-[#2C221E] text-[#2C221E] hover:bg-[#2C221E] hover:text-[#FDFBF7] rounded-md h-9 px-4 text-xs font-medium inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Address</span>
          </Button>
        )}
      </div>

      {/* Global Feedback Banner */}
      {feedback?.success && (
        <div
          role="alert"
          className="p-3 rounded-md bg-[#4ADE80]/15 border border-[#4ADE80]/30 text-[#4ADE80] text-xs flex items-center gap-2 animate-fade-in"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {feedback?.error && (
        <div
          role="alert"
          className="p-3 rounded-md bg-[#F87171]/15 border border-[#F87171]/30 text-[#F87171] text-xs flex items-center gap-2 animate-fade-in"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{feedback.error}</span>
        </div>
      )}

      {/* Add Address Form Modal / Inline Box */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-lg bg-[#F4F1EA] border border-[#8A8179]/30 space-y-4 animate-fade-in"
          noValidate
        >
          <div className="flex items-center justify-between border-b border-[#8A8179]/20 pb-3">
            <h3 className="font-serif text-lg font-bold text-[#2C221E]">
              Add New Address
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-[#8A8179] hover:text-[#2C221E] p-1"
              aria-label="Cancel adding address"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-left">
              <label className="block text-[11px] font-medium text-[#2C221E] uppercase">
                Label (e.g. Home, Office) *
              </label>
              <input
                type="text"
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Home"
                className="w-full h-10 px-3 rounded-md bg-[#FDFBF7] border border-[#8A8179]/30 text-xs text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="block text-[11px] font-medium text-[#2C221E] uppercase">
                Recipient Name *
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Full Name"
                className="w-full h-10 px-3 rounded-md bg-[#FDFBF7] border border-[#8A8179]/30 text-xs text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="block text-[11px] font-medium text-[#2C221E] uppercase">
                Contact Phone *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1711 000000"
                className="w-full h-10 px-3 rounded-md bg-[#FDFBF7] border border-[#8A8179]/30 text-xs text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="block text-[11px] font-medium text-[#2C221E] uppercase">
                City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Dhaka"
                className="w-full h-10 px-3 rounded-md bg-[#FDFBF7] border border-[#8A8179]/30 text-xs text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
              />
            </div>

            <div className="space-y-1 text-left sm:col-span-2">
              <label className="block text-[11px] font-medium text-[#2C221E] uppercase">
                Street Address (Line 1) *
              </label>
              <input
                type="text"
                required
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                placeholder="House 12, Road 11, Block D, Banani"
                className="w-full h-10 px-3 rounded-md bg-[#FDFBF7] border border-[#8A8179]/30 text-xs text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="block text-[11px] font-medium text-[#2C221E] uppercase">
                Apartment / Suite (Optional)
              </label>
              <input
                type="text"
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                placeholder="Apt 4B"
                className="w-full h-10 px-3 rounded-md bg-[#FDFBF7] border border-[#8A8179]/30 text-xs text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="block text-[11px] font-medium text-[#2C221E] uppercase">
                Postal Code *
              </label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="1213"
                className="w-full h-10 px-3 rounded-md bg-[#FDFBF7] border border-[#8A8179]/30 text-xs text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#5C4A3D] select-none pt-2">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded text-[#D4A373] focus:ring-[#D4A373] w-3.5 h-3.5"
            />
            <span>Set as default primary address</span>
          </label>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              className="bg-[#2C221E] text-[#FDFBF7] hover:text-[#1A1613] rounded-md text-xs font-medium h-10 px-5"
            >
              <span>Save Address</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAddForm(false)}
              className="text-[#5C4A3D] hover:text-[#2C221E] text-xs h-10"
            >
              <span>Cancel</span>
            </Button>
          </div>
        </form>
      )}

      {/* Address Cards List */}
      {initialAddresses.length === 0 && !showAddForm ? (
        <div className="p-12 text-center rounded-lg border border-[#8A8179]/20 bg-[#F4F1EA] space-y-3">
          <MapPin className="w-8 h-8 text-[#8A8179] mx-auto" />
          <h3 className="font-serif text-base font-bold text-[#2C221E]">
            No Saved Addresses
          </h3>
          <p className="text-xs text-[#5C4A3D] max-w-sm mx-auto">
            You haven&apos;t saved any pickup or billing addresses yet. Add one to expedite future orders.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="border-[#2C221E] text-[#2C221E] hover:bg-[#2C221E] hover:text-[#FDFBF7] rounded-md text-xs"
          >
            <span>Add First Address</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {initialAddresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-5 rounded-lg border transition-all flex flex-col justify-between ${
                addr.is_default
                  ? "bg-[#FAEDCD]/30 border-[#D4A373] shadow-sm"
                  : "bg-[#FDFBF7] border-[#8A8179]/20 hover:border-[#8A8179]/40"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-[#2C221E]">
                      {addr.label}
                    </span>
                    {addr.is_default && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#D4A373] text-[#1A1613]">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>Default</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id)}
                    disabled={activeActionId === addr.id}
                    className="text-[#8A8179] hover:text-[#F87171] p-1 transition-colors"
                    aria-label={`Delete ${addr.label} address`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-0.5 text-xs text-[#5C4A3D] font-sans">
                  <p className="font-medium text-[#2C221E]">{addr.recipient_name}</p>
                  <p>{addr.line1}</p>
                  {addr.line2 && <p>{addr.line2}</p>}
                  <p>
                    {addr.city} {addr.postal_code}, {addr.country}
                  </p>
                  <p className="pt-1 text-[#8A8179]">{addr.phone}</p>
                </div>
              </div>

              {!addr.is_default && (
                <div className="pt-4 mt-4 border-t border-[#8A8179]/15">
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr.id)}
                    disabled={activeActionId === addr.id}
                    className="text-xs text-[#D4A373] hover:text-[#2C221E] font-medium transition-colors"
                  >
                    Set as default address
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
