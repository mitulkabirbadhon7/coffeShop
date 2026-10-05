"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Star,
  Coffee,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { formatCurrencyBDT } from "@/lib/utils/formatters";
import {
  toggleProductAvailabilityAction,
  toggleProductFeaturedAction,
  softDeleteProductAction,
  restoreProductAction,
} from "@/lib/products/admin-actions";
import { ProductModal } from "./product-modal";
import type { Database } from "@/types/database.types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type CategoryRow = Database["public"]["Tables"]["product_categories"]["Row"];

export interface AdminProductTableProps {
  initialProducts: ProductRow[];
  categories: CategoryRow[];
}

export function AdminProductTable({
  initialProducts,
  categories,
}: AdminProductTableProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState<string>("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [showDeleted, setShowDeleted] = React.useState<boolean>(false);

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [editingProduct, setEditingProduct] = React.useState<ProductRow | null>(null);
  const [actionLoadingId, setActionLoadingId] = React.useState<string | null>(null);

  const categoryMap = React.useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  // Filter products based on search, category, and soft-delete state
  const filteredProducts = React.useMemo(() => {
    return initialProducts.filter((p) => {
      const isDeleted = p.deleted_at !== null;
      if (showDeleted ? !isDeleted : isDeleted) {
        return false;
      }

      if (selectedCategory !== "all" && p.category_id !== selectedCategory) {
        return false;
      }

      if (search.trim()) {
        const query = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(query) ||
          p.slug.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [initialProducts, search, selectedCategory, showDeleted]);

  const handleToggleAvailability = async (product: ProductRow) => {
    setActionLoadingId(product.id);
    await toggleProductAvailabilityAction(product.id, !product.is_available);
    setActionLoadingId(null);
    router.refresh();
  };

  const handleToggleFeatured = async (product: ProductRow) => {
    setActionLoadingId(product.id);
    await toggleProductFeaturedAction(product.id, !product.is_featured);
    setActionLoadingId(null);
    router.refresh();
  };

  const handleSoftDelete = async (product: ProductRow) => {
    if (!confirm(`Are you sure you want to soft delete "${product.name}"? It will be hidden from the public catalog.`)) {
      return;
    }
    setActionLoadingId(product.id);
    await softDeleteProductAction(product.id);
    setActionLoadingId(null);
    router.refresh();
  };

  const handleRestore = async (product: ProductRow) => {
    setActionLoadingId(product.id);
    await restoreProductAction(product.id);
    setActionLoadingId(null);
    router.refresh();
  };

  const handleEdit = (product: ProductRow) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8179]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or slug..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#231B18] border border-[#5C4A3D]/40 text-xs text-[#F5E6D3] placeholder-[#8A8179]/60 focus:outline-none focus:border-[#D4A373]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#231B18] border border-[#5C4A3D]/40 text-xs text-[#F5E6D3] focus:outline-none focus:border-[#D4A373]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Show Deleted Toggle */}
          <button
            type="button"
            onClick={() => setShowDeleted(!showDeleted)}
            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
              showDeleted
                ? "bg-[#F87171]/20 border-[#F87171]/50 text-[#F87171]"
                : "bg-[#231B18] border-[#5C4A3D]/40 text-[#8A8179] hover:text-[#F5E6D3]"
            }`}
          >
            {showDeleted ? "Showing Deleted" : "Active Items"}
          </button>

          {/* Add Product Button */}
          <button
            type="button"
            onClick={handleCreate}
            className="px-4 py-2 rounded-lg bg-[#D4A373] text-[#1A1613] text-xs font-semibold hover:bg-[#C28E5C] transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Roast / Product</span>
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="rounded-2xl border border-[#5C4A3D]/40 bg-[#231B18] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#1A1613] text-[#D4A373] text-[11px] uppercase tracking-wider border-b border-[#5C4A3D]/40">
              <tr>
                <th className="px-5 py-4">Item</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Price</th>
                <th className="px-4 py-4">In Stock</th>
                <th className="px-4 py-4">Featured</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5C4A3D]/30 text-[#F5E6D3]">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const isLoading = actionLoadingId === p.id;
                  const isDeleted = p.deleted_at !== null;
                  const categoryName = categoryMap.get(p.category_id) || "Specialty";

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-[#2C221E]/60 transition-colors ${
                        isDeleted ? "opacity-60 bg-[#1A1613]/40" : ""
                      }`}
                    >
                      {/* Item thumbnail and name */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#2C221E] border border-[#5C4A3D]/40 overflow-hidden relative shrink-0">
                            {p.image_path ? (
                              <Image
                                src={p.image_path}
                                alt={p.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#D4A373]/50">
                                <Coffee className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-serif font-bold text-sm text-[#F5E6D3] block truncate max-w-xs">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-[#8A8179] font-mono block">
                              /{p.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#3D3028] text-[#D4A373] border border-[#5C4A3D]/40">
                          {categoryName}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3.5 font-serif font-bold text-sm text-[#D4A373]">
                        {formatCurrencyBDT(p.price_minor)}
                      </td>

                      {/* In Stock Toggle */}
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          disabled={isLoading || isDeleted}
                          onClick={() => handleToggleAvailability(p)}
                          className={`px-2.5 py-1 rounded text-[10px] font-semibold border transition-all inline-flex items-center gap-1 ${
                            p.is_available
                              ? "bg-[#4ADE80]/15 text-[#4ADE80] border-[#4ADE80]/30 hover:bg-[#4ADE80]/25"
                              : "bg-[#F87171]/15 text-[#F87171] border-[#F87171]/30 hover:bg-[#F87171]/25"
                          }`}
                        >
                          {p.is_available ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>In Stock</span>
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3" />
                              <span>Sold Out</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          disabled={isLoading || isDeleted}
                          onClick={() => handleToggleFeatured(p)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            p.is_featured
                              ? "bg-[#D4A373]/20 border-[#D4A373]/50 text-[#D4A373]"
                              : "border-[#5C4A3D]/40 text-[#8A8179] hover:text-[#F5E6D3]"
                          }`}
                          aria-label="Toggle Featured"
                        >
                          <Star className={`w-3.5 h-3.5 ${p.is_featured ? "fill-[#D4A373]" : ""}`} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#D4A373]" />
                          ) : isDeleted ? (
                            <button
                              type="button"
                              onClick={() => handleRestore(p)}
                              className="px-2.5 py-1 rounded bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/30 hover:bg-[#4ADE80]/25 text-[10px] font-semibold inline-flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Restore</span>
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleEdit(p)}
                                className="p-1.5 rounded-lg text-[#8A8179] hover:text-[#D4A373] hover:bg-[#3D3028] transition-colors"
                                aria-label={`Edit ${p.name}`}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSoftDelete(p)}
                                className="p-1.5 rounded-lg text-[#8A8179] hover:text-[#F87171] hover:bg-[#3D3028] transition-colors"
                                aria-label={`Delete ${p.name}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8A8179]">
                    No matching products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories}
        productToEdit={editingProduct}
      />
    </div>
  );
}
