"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Upload, Sparkles, Loader2, AlertCircle, Plus, Trash2 } from "lucide-react";
import { createProductAction, updateProductAction } from "@/lib/products/admin-actions";
import { uploadProductImageAction } from "@/lib/uploads/image-service";
import type { Database } from "@/types/database.types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type CategoryRow = Database["public"]["Tables"]["product_categories"]["Row"];

export interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryRow[];
  productToEdit?: ProductRow | null;
}

export function ProductModal({
  isOpen,
  onClose,
  categories,
  productToEdit,
}: ProductModalProps) {
  const router = useRouter();
  const isEditing = !!productToEdit;

  const [name, setName] = React.useState<string>("");
  const [slug, setSlug] = React.useState<string>("");
  const [categoryId, setCategoryId] = React.useState<string>("");
  const [priceBdt, setPriceBdt] = React.useState<string>("250");
  const [description, setDescription] = React.useState<string>("");
  const [imagePath, setImagePath] = React.useState<string>("");
  const [ingredients, setIngredients] = React.useState<string[]>([]);
  const [newIngredient, setNewIngredient] = React.useState<string>("");
  const [variants, setVariants] = React.useState<string[]>([]);
  const [newVariant, setNewVariant] = React.useState<string>("");
  const [discountPercentage, setDiscountPercentage] = React.useState<string>("0");
  const [isAvailable, setIsAvailable] = React.useState<boolean>(true);
  const [isFeatured, setIsFeatured] = React.useState<boolean>(false);

  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  // Populate form fields when editing
  React.useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setSlug(productToEdit.slug);
      setCategoryId(productToEdit.category_id);
      setPriceBdt((productToEdit.price_minor / 100).toString());
      setDescription(productToEdit.description || "");
      setImagePath(productToEdit.image_path || "");
      setIngredients(productToEdit.ingredients || []);
      setVariants(productToEdit.variants || []);
      setDiscountPercentage((productToEdit.discount_percentage || 0).toString());
      setIsAvailable(productToEdit.is_available);
      setIsFeatured(productToEdit.is_featured);
    } else {
      setName("");
      setSlug("");
      setCategoryId(categories[0]?.id || "");
      setPriceBdt("250");
      setDescription("");
      setImagePath("");
      setIngredients([]);
      setVariants([]);
      setDiscountPercentage("0");
      setIsAvailable(true);
      setIsFeatured(false);
    }
    setError(null);
  }, [productToEdit, categories, isOpen]);

  // Helper to generate kebab-case slug from name
  const handleGenerateSlug = () => {
    const generated = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generated);
  };

  const handleAddIngredient = () => {
    const trimmed = newIngredient.trim();
    if (trimmed && !ingredients.includes(trimmed) && ingredients.length < 10) {
      setIngredients([...ingredients, trimmed]);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (tag: string) => {
    setIngredients(ingredients.filter((i) => i !== tag));
  };

  const handleAddVariant = () => {
    const trimmed = newVariant.trim();
    if (trimmed && !variants.includes(trimmed) && variants.length < 10) {
      setVariants([...variants, trimmed]);
      setNewVariant("");
    }
  };

  const handleRemoveVariant = (tag: string) => {
    setVariants(variants.filter((v) => v !== tag));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadProductImageAction(formData);
    setIsUploading(false);

    if (!res.success) {
      setError(res.error || "Image upload failed.");
    } else if (res.imagePath) {
      setImagePath(res.imagePath);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const priceNum = parseFloat(priceBdt);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Please enter a valid price in BDT.");
      return;
    }

    const priceMinor = Math.round(priceNum * 100);

    setIsSubmitting(true);

    if (isEditing && productToEdit) {
      const res = await updateProductAction({
        id: productToEdit.id,
        name,
        slug,
        categoryId,
        priceMinor,
        description: description || undefined,
        imagePath: imagePath || undefined,
        ingredients,
        variants,
        discountPercentage: parseInt(discountPercentage) || 0,
        isAvailable,
        isFeatured,
      });

      setIsSubmitting(false);

      if (!res.success) {
        setError(res.error || "Failed to update product.");
        return;
      }
    } else {
      const res = await createProductAction({
        name,
        slug,
        categoryId,
        priceMinor,
        description: description || undefined,
        imagePath: imagePath || undefined,
        ingredients,
        variants,
        discountPercentage: parseInt(discountPercentage) || 0,
        isAvailable,
        isFeatured,
      });

      setIsSubmitting(false);

      if (!res.success) {
        setError(res.error || "Failed to create product.");
        return;
      }
    }

    onClose();
    router.refresh();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1A1613]/80 backdrop-blur-sm transition-opacity"
        onClick={() => !isSubmitting && onClose()}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-2xl bg-[#2C221E] border border-[#5C4A3D]/60 p-6 sm:p-8 text-[#F5E6D3] shadow-2xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#5C4A3D]/40 pb-4">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#F5E6D3]">
                {isEditing ? "Edit Specialty Roast" : "Add New Roast to Catalog"}
              </h2>
              <p className="text-xs text-[#8A8179] mt-0.5">
                {isEditing ? `Modifying "${productToEdit.name}"` : "Create a new artisan coffee or confection"}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1.5 rounded-lg text-[#8A8179] hover:text-[#F5E6D3] hover:bg-[#3D3028] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-[#F87171]/15 border border-[#F87171]/30 text-[#F87171] text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            {/* Name & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#D4A373] font-medium mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ethiopia Yirgacheffe Washed"
                  className="w-full px-3 py-2 rounded-lg bg-[#231B18] border border-[#5C4A3D]/50 text-[#F5E6D3] placeholder-[#8A8179]/60 focus:outline-none focus:border-[#D4A373]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#D4A373] font-medium">Slug *</label>
                  <button
                    type="button"
                    onClick={handleGenerateSlug}
                    className="text-[10px] text-[#D4A373] hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase())}
                  placeholder="e.g. ethiopia-yirgacheffe-washed"
                  className="w-full px-3 py-2 rounded-lg bg-[#231B18] border border-[#5C4A3D]/50 text-[#F5E6D3] placeholder-[#8A8179]/60 focus:outline-none focus:border-[#D4A373]"
                />
              </div>
            </div>

            {/* Category & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#D4A373] font-medium mb-1">Category *</label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#231B18] border border-[#5C4A3D]/50 text-[#F5E6D3] focus:outline-none focus:border-[#D4A373]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

            {/* Price & Discount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#D4A373] font-medium mb-1">
                  Pickup Price (BDT Taka) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="1"
                  value={priceBdt}
                  onChange={(e) => setPriceBdt(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#231B18] border border-[#5C4A3D]/50 text-[#F5E6D3] focus:outline-none focus:border-[#D4A373]"
                />
              </div>

              <div>
                <label className="block text-[#D4A373] font-medium mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#231B18] border border-[#5C4A3D]/50 text-[#F5E6D3] focus:outline-none focus:border-[#D4A373]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[#D4A373] font-medium mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Origin terroir, roast profile, tasting notes..."
                className="w-full px-3 py-2 rounded-lg bg-[#231B18] border border-[#5C4A3D]/50 text-[#F5E6D3] placeholder-[#8A8179]/60 focus:outline-none focus:border-[#D4A373] resize-none"
              />
            </div>

            {/* Tasting Notes / Ingredients Tags */}
            <div>
              <label className="block text-[#D4A373] font-medium mb-1">
                Tasting Notes / Ingredients (Up to 10)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddIngredient();
                    }
                  }}
                  placeholder="e.g. Jasmine, Bergamot, Raw Cacao..."
                  className="flex-1 px-3 py-2 rounded-lg bg-[#231B18] border border-[#5C4A3D]/50 text-[#F5E6D3] placeholder-[#8A8179]/60 focus:outline-none focus:border-[#D4A373]"
                />
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="px-3.5 py-2 rounded-lg bg-[#3D3028] text-[#F5E6D3] hover:bg-[#5C4A3D] transition-colors flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {ingredients.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-[#3D3028] text-[#D4A373] border border-[#5C4A3D]/50 text-xs flex items-center gap-1.5"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(tag)}
                        className="hover:text-[#F87171]"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Variants Tags */}
            <div>
              <label className="block text-[#D4A373] font-medium mb-1">
                Variants (e.g., Small, Large, 250g, 500g)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newVariant}
                  onChange={(e) => setNewVariant(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddVariant();
                    }
                  }}
                  placeholder="e.g. Small, Large..."
                  className="flex-1 px-3 py-2 rounded-lg bg-[#231B18] border border-[#5C4A3D]/50 text-[#F5E6D3] placeholder-[#8A8179]/60 focus:outline-none focus:border-[#D4A373]"
                />
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="px-3.5 py-2 rounded-lg bg-[#3D3028] text-[#F5E6D3] hover:bg-[#5C4A3D] transition-colors flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {variants.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {variants.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-[#3D3028] text-[#D4A373] border border-[#5C4A3D]/50 text-xs flex items-center gap-1.5"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(tag)}
                        className="hover:text-[#F87171]"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Image Upload with Magic Byte Check */}
            <div>
              <label className="block text-[#D4A373] font-medium mb-1">
                Product Image (JPEG, PNG, or WebP &le; 2 MB)
              </label>
              <div className="flex items-center gap-4">
                {imagePath && (
                  <div className="w-16 h-16 rounded-lg bg-[#231B18] border border-[#5C4A3D]/50 relative overflow-hidden shrink-0">
                    <Image
                      src={imagePath}
                      alt="Product preview"
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D4A373]/40 bg-[#231B18] text-[#D4A373] hover:bg-[#3D3028] transition-colors text-xs font-medium">
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Magic Bytes &amp; Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload Image File</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                  {imagePath && (
                    <p className="text-[10px] text-[#8A8179] font-mono mt-1 truncate max-w-sm">
                      Path: {imagePath}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Checkboxes: Available & Featured */}
            <div className="flex items-center gap-6 pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="rounded border-[#5C4A3D] text-[#D4A373] focus:ring-0 w-4 h-4"
                />
                <span className="text-[#F5E6D3]">Available for Order (In Stock)</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-[#5C4A3D] text-[#D4A373] focus:ring-0 w-4 h-4"
                />
                <span className="text-[#F5E6D3]">Featured on Homepage</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#5C4A3D]/40">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-[#8A8179] hover:text-[#F5E6D3] hover:bg-[#3D3028] transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="px-5 py-2.5 rounded-lg bg-[#D4A373] text-[#1A1613] text-xs font-semibold hover:bg-[#C28E5C] disabled:opacity-50 transition-colors inline-flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{isEditing ? "Update Roast" : "Publish to Catalog"}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
