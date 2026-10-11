"use client";

import * as React from "react";
import {
  Star,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Search,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import {
  createTestimonialAction,
  updateTestimonialAction,
  toggleTestimonialPublishAction,
  deleteTestimonialAction,
  reorderTestimonialsAction,
} from "@/lib/testimonials/admin-testimonial-actions";
import type { Database } from "@/types/database.types";

type TestimonialRow = Database["public"]["Tables"]["testimonials"]["Row"];

interface AdminTestimonialsManagerProps {
  initialTestimonials: TestimonialRow[];
}

export function AdminTestimonialsManager({
  initialTestimonials,
}: AdminTestimonialsManagerProps) {
  const [testimonials, setTestimonials] =
    React.useState<TestimonialRow[]>(initialTestimonials);
  const [filter, setFilter] = React.useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
  const [search, setSearch] = React.useState<string>("");

  // Modal states
  const [modalMode, setModalMode] = React.useState<"CREATE" | "EDIT" | null>(null);
  const [activeItem, setActiveItem] = React.useState<TestimonialRow | null>(null);

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  // Form inputs
  const [name, setName] = React.useState("");
  const [quote, setQuote] = React.useState("");
  const [roleOrContext, setRoleOrContext] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState<number>(0);
  const [isPublished, setIsPublished] = React.useState<boolean>(true);

  // Loading & feedback
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Open Create Modal
  const openCreateModal = () => {
    setName("");
    setQuote("");
    setRoleOrContext("");
    setSortOrder(testimonials.length + 1);
    setIsPublished(true);
    setActiveItem(null);
    setModalMode("CREATE");
  };

  // Open Edit Modal
  const openEditModal = (item: TestimonialRow) => {
    setName(item.name);
    setQuote(item.quote);
    setRoleOrContext(item.role_or_context || "");
    setSortOrder(item.sort_order);
    setIsPublished(item.is_published);
    setActiveItem(item);
    setModalMode("EDIT");
  };

  // Close Modal
  const closeModal = () => {
    setModalMode(null);
    setActiveItem(null);
  };

  // Save Modal Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const payload = {
      name,
      quote,
      role_or_context: roleOrContext || null,
      sort_order: Number(sortOrder) || 0,
      is_published: isPublished,
    };

    if (modalMode === "CREATE") {
      const res = await createTestimonialAction(payload);
      setSubmitting(false);

      if ("error" in res) {
        setFeedback({ type: "error", message: res.error });
      } else {
        setFeedback({ type: "success", message: res.message });
        closeModal();
        // Optimistic refresh
        const newItem: TestimonialRow = {
          id: res.testimonialId || crypto.randomUUID(),
          name,
          quote,
          role_or_context: roleOrContext || null,
          sort_order: Number(sortOrder) || 0,
          is_published: isPublished,
          image_path: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setTestimonials((prev) => [...prev, newItem].sort((a, b) => a.sort_order - b.sort_order));
      }
    } else if (modalMode === "EDIT" && activeItem) {
      const res = await updateTestimonialAction(activeItem.id, payload);
      setSubmitting(false);

      if ("error" in res) {
        setFeedback({ type: "error", message: res.error });
      } else {
        setFeedback({ type: "success", message: res.message });
        closeModal();
        setTestimonials((prev) =>
          prev
            .map((item) =>
              item.id === activeItem.id
                ? {
                    ...item,
                    name,
                    quote,
                    role_or_context: roleOrContext || null,
                    sort_order: Number(sortOrder) || 0,
                    is_published: isPublished,
                    updated_at: new Date().toISOString(),
                  }
                : item
            )
            .sort((a, b) => a.sort_order - b.sort_order)
        );
      }
    }
  };

  // Toggle Published
  const handleTogglePublished = async (item: TestimonialRow) => {
    setActionLoadingId(item.id);
    const nextStatus = !item.is_published;
    const res = await toggleTestimonialPublishAction(item.id, nextStatus);
    setActionLoadingId(null);

    if ("error" in res) {
      setFeedback({ type: "error", message: res.error });
    } else {
      setFeedback({ type: "success", message: res.message });
      setTestimonials((prev) =>
        prev.map((t) => (t.id === item.id ? { ...t, is_published: nextStatus } : t))
      );
    }
  };

  // Reorder Item (Swap with neighbor)
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;

    const copy = [...testimonials];
    const current = copy[index];
    const target = copy[targetIndex];

    // Swap sort orders
    const tempOrder = current.sort_order;
    current.sort_order = target.sort_order;
    target.sort_order = tempOrder;

    copy[index] = target;
    copy[targetIndex] = current;

    setTestimonials(copy);

    await reorderTestimonialsAction([
      { id: current.id, sort_order: current.sort_order },
      { id: target.id, sort_order: target.sort_order },
    ]);
  };

  // Delete Item
  const handleDelete = async (id: string) => {
    setActionLoadingId(id);
    const res = await deleteTestimonialAction(id);
    setActionLoadingId(null);
    setDeleteConfirmId(null);

    if ("error" in res) {
      setFeedback({ type: "error", message: res.error });
    } else {
      setFeedback({ type: "success", message: res.message });
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Filtered and searched list
  const filtered = React.useMemo(() => {
    return testimonials.filter((t) => {
      const matchesFilter =
        filter === "ALL" ||
        (filter === "PUBLISHED" && t.is_published) ||
        (filter === "DRAFT" && !t.is_published);

      const matchesSearch =
        !search.trim() ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.quote.toLowerCase().includes(search.toLowerCase()) ||
        (t.role_or_context && t.role_or_context.toLowerCase().includes(search.toLowerCase()));

      return matchesFilter && matchesSearch;
    });
  }, [testimonials, filter, search]);

  return (
    <div className="space-y-6">
      {/* Header & New Testimonial CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F5E6D3]">
            Guest Testimonials &amp; Reviews
          </h1>
          <p className="text-xs sm:text-sm text-[#F5E6D3]/60 font-sans">
            Curate customer reviews displayed on the homepage with safe outputs and custom ordering.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#D4A373] text-[#1A1613] hover:bg-[#C29263] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
            feedback.type === "success"
              ? "bg-[#4ADE80]/10 border-[#4ADE80]/30 text-[#4ADE80]"
              : "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Search & Tabs Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-[#231B18] p-1 rounded-xl border border-[#5C4A3D]/40 text-xs">
          {(["ALL", "PUBLISHED", "DRAFT"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg transition-colors capitalize ${
                filter === tab
                  ? "bg-[#D4A373] text-[#1A1613] font-semibold"
                  : "text-[#F5E6D3]/70 hover:text-[#F5E6D3]"
              }`}
            >
              {tab.toLowerCase()}
              <span className="ml-1.5 opacity-60 text-[10px]">
                ({tab === "ALL"
                  ? testimonials.length
                  : tab === "PUBLISHED"
                  ? testimonials.filter((t) => t.is_published).length
                  : testimonials.filter((t) => !t.is_published).length})
              </span>
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#8A8179] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reviews by guest name or quote..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#231B18] border border-[#5C4A3D]/40 text-xs text-[#F5E6D3] placeholder-[#8A8179] focus:outline-none focus:border-[#D4A373]"
          />
        </div>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((item, index) => {
            const isActing = actionLoadingId === item.id;
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#231B18] border border-[#5C4A3D]/40 flex flex-col justify-between space-y-4 hover:border-[#D4A373]/50 transition-colors"
              >
                <div className="space-y-3">
                  {/* Top Bar: Stars, Publish Status, Reorder buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#D4A373]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#D4A373]" />
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(item)}
                        disabled={isActing}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors inline-flex items-center gap-1 ${
                          item.is_published
                            ? "bg-[#4ADE80]/15 text-[#4ADE80] border-[#4ADE80]/30 hover:bg-[#4ADE80]/25"
                            : "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30 hover:bg-[#F59E0B]/25"
                        }`}
                      >
                        {item.is_published ? (
                          <>
                            <Eye className="w-2.5 h-2.5" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-2.5 h-2.5" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center rounded-lg bg-[#2C221E] border border-[#5C4A3D]/30 p-0.5">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMove(index, "up")}
                          className="p-1 hover:text-[#D4A373] text-[#8A8179] disabled:opacity-30 disabled:hover:text-[#8A8179]"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={index === filtered.length - 1}
                          onClick={() => handleMove(index, "down")}
                          className="p-1 hover:text-[#D4A373] text-[#8A8179] disabled:opacity-30 disabled:hover:text-[#8A8179]"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-xs text-[#F5E6D3]/90 italic leading-relaxed line-clamp-4">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Author Info & Actions */}
                <div className="pt-3 border-t border-[#5C4A3D]/30 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="font-serif font-bold text-xs text-[#F5E6D3] truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-[#8A8179] truncate">
                      {item.role_or_context || "Verified Guest"} • #{item.sort_order}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg text-[#F5E6D3]/70 hover:text-[#D4A373] hover:bg-[#2C221E] transition-colors"
                      title="Edit review"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-1.5 rounded-lg text-[#F5E6D3]/70 hover:text-[#EF4444] hover:bg-[#2C221E] transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-xs text-[#8A8179] rounded-2xl bg-[#231B18] border border-[#5C4A3D]/40">
            No testimonials found matching your filter criteria.
          </div>
        )}
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-xl bg-[#2C221E] border border-[#5C4A3D]/40 text-xs text-[#8A8179] flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#D4A373] shrink-0" />
        <span>
          Customer reviews are sanitized to block XSS and malicious scripts before rendering on the public storefront.
        </span>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#231B18] border border-[#5C4A3D] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#5C4A3D]/40 pb-3">
              <h2 className="font-serif font-bold text-lg text-[#F5E6D3]">
                {modalMode === "CREATE" ? "Add Guest Testimonial" : "Edit Testimonial"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 rounded-lg text-[#8A8179] hover:text-[#F5E6D3] hover:bg-[#2C221E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#F5E6D3]">
                  Guest Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nusrat Jahan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#2C221E] border border-[#5C4A3D]/40 text-xs text-[#F5E6D3] placeholder-[#8A8179] focus:outline-none focus:border-[#D4A373]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#F5E6D3]">
                  Role or Context
                </label>
                <input
                  type="text"
                  placeholder="e.g. Food Critic, Regular Guest"
                  value={roleOrContext}
                  onChange={(e) => setRoleOrContext(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#2C221E] border border-[#5C4A3D]/40 text-xs text-[#F5E6D3] placeholder-[#8A8179] focus:outline-none focus:border-[#D4A373]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-[#F5E6D3]">Review Quote *</label>
                  <span className="text-[10px] text-[#8A8179]">{quote.length}/500</span>
                </div>
                <textarea
                  rows={4}
                  required
                  maxLength={500}
                  placeholder="Share the guest's authentic impression of the roastery..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#2C221E] border border-[#5C4A3D]/40 text-xs text-[#F5E6D3] placeholder-[#8A8179] focus:outline-none focus:border-[#D4A373] resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#F5E6D3]">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={1000}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#2C221E] border border-[#5C4A3D]/40 text-xs text-[#F5E6D3] focus:outline-none focus:border-[#D4A373]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded border-[#5C4A3D] text-[#D4A373] focus:ring-[#D4A373] bg-[#2C221E]"
                  />
                  <label htmlFor="is_published" className="text-xs text-[#F5E6D3] cursor-pointer">
                    Publish immediately
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#5C4A3D]/40">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs text-[#F5E6D3]/70 hover:bg-[#2C221E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#D4A373] text-[#1A1613] hover:bg-[#C29263] transition-colors disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{modalMode === "CREATE" ? "Create Testimonial" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#231B18] border border-[#EF4444]/40 p-6 space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif font-bold text-sm text-[#F5E6D3]">
                Delete Testimonial?
              </h3>
              <p className="text-xs text-[#8A8179]">
                This will permanently delete this review from the database.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#F5E6D3]/70 hover:bg-[#2C221E]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoadingId === deleteConfirmId}
                onClick={() => handleDelete(deleteConfirmId)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#EF4444] text-white hover:bg-[#DC2626] transition-colors"
              >
                {actionLoadingId === deleteConfirmId && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
