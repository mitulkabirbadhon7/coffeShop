"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Shield,
  User,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { formatDate } from "@/lib/utils/formatters";
import { updateUserRoleAction } from "@/lib/users/admin-user-actions";
import type { Database } from "@/types/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export function AdminUserTable({
  profiles,
  currentUserId,
}: {
  profiles: ProfileRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [search, setSearch] = React.useState<string>("");
  const [loadingUserId, setLoadingUserId] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const filteredProfiles = React.useMemo(() => {
    if (!search.trim()) return profiles;
    const q = search.toLowerCase();
    return profiles.filter((p) => {
      const name = p.display_name?.toLowerCase() || "";
      const id = p.id.toLowerCase();
      return name.includes(q) || id.includes(q);
    });
  }, [profiles, search]);

  const handleRoleChange = async (targetUser: ProfileRow, newRole: "ADMIN" | "USER") => {
    const actionLabel = newRole === "ADMIN" ? "promote to Administrator" : "demote to Customer";
    const confirmed = confirm(
      `Are you sure you want to ${actionLabel} "${targetUser.display_name || targetUser.id.slice(0, 8)}"?`
    );
    if (!confirmed) return;

    setLoadingUserId(targetUser.id);
    setErrorMessage(null);

    const res = await updateUserRoleAction(targetUser.id, newRole);
    setLoadingUserId(null);

    if (!res.success) {
      setErrorMessage(res.error || "Failed to update user role.");
    } else {
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-[#F87171]/15 border border-[#F87171]/30 text-[#F87171] text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8179]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or UUID..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#231B18] border border-[#5C4A3D]/40 text-xs text-[#F5E6D3] placeholder-[#8A8179]/60 focus:outline-none focus:border-[#D4A373]"
          />
        </div>

        <div className="text-xs text-[#8A8179]">
          Total Registered Profiles:{" "}
          <span className="font-semibold text-[#F5E6D3]">{profiles.length}</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-[#5C4A3D]/40 bg-[#231B18] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#1A1613] text-[#D4A373] text-[11px] uppercase tracking-wider border-b border-[#5C4A3D]/40">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Registered Date</th>
                <th className="px-5 py-4 text-right">Role Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5C4A3D]/30 text-[#F5E6D3]">
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((p) => {
                  const isCurrent = p.id === currentUserId;
                  const isLoading = loadingUserId === p.id;
                  const isAdmin = p.role === "ADMIN";

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-[#2C221E]/60 transition-colors ${
                        isCurrent ? "bg-[#D4A373]/5" : ""
                      }`}
                    >
                      {/* User identity */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#2C221E] border border-[#5C4A3D]/50 flex items-center justify-center text-[#D4A373] shrink-0">
                            {isAdmin ? (
                              <Shield className="w-4 h-4 text-[#D4A373]" />
                            ) : (
                              <User className="w-4 h-4 text-[#8A8179]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-[#F5E6D3] text-xs">
                                {p.display_name || "Unnamed Customer"}
                              </span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#D4A373] text-[#1A1613]">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#8A8179] font-mono block">
                              {p.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Pill */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                            isAdmin
                              ? "bg-[#D4A373]/15 text-[#D4A373] border-[#D4A373]/30"
                              : "bg-[#8A8179]/15 text-[#8A8179] border-[#8A8179]/30"
                          }`}
                        >
                          {p.role}
                        </span>
                      </td>

                      {/* Member Vintage */}
                      <td className="px-4 py-3.5 text-[#8A8179]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
                          <span>{formatDate(p.created_at)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#D4A373]" />
                          ) : isCurrent ? (
                            <span className="text-[10px] text-[#8A8179] italic flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3 text-[#D4A373]" />
                              <span>Self-demotion disabled</span>
                            </span>
                          ) : isAdmin ? (
                            <button
                              type="button"
                              onClick={() => handleRoleChange(p, "USER")}
                              className="px-2.5 py-1 rounded bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30 hover:bg-[#F87171]/25 text-[10px] font-semibold inline-flex items-center gap-1"
                            >
                              <ArrowDownRight className="w-3 h-3" />
                              <span>Demote to Customer</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleRoleChange(p, "ADMIN")}
                              className="px-2.5 py-1 rounded bg-[#D4A373]/15 text-[#D4A373] border border-[#D4A373]/30 hover:bg-[#D4A373]/25 text-[10px] font-semibold inline-flex items-center gap-1"
                            >
                              <ArrowUpRight className="w-3 h-3" />
                              <span>Promote to Admin</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[#8A8179]">
                    No matching users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
