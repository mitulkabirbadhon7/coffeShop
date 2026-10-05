"use client";

import * as React from "react";
import Link from "next/link";
import { Search, X, Coffee, ArrowRight, SlidersHorizontal } from "lucide-react";
import type { Product, ProductCategory } from "@/lib/data/products.data";
import { filterProducts } from "@/lib/data/products.data";
import { formatBdt } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";

export interface ProductCatalogProps {
  initialProducts: Product[];
  categories: ProductCategory[];
}

export function ProductCatalog({
  initialProducts,
  categories,
}: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [sortBy, setSortBy] = React.useState<
    "featured" | "price-asc" | "price-desc" | "name-asc" | "newest"
  >("featured");
  const [availableOnly, setAvailableOnly] = React.useState<boolean>(false);

  // Category ID to Name mapping
  const categoryMap = React.useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories]
  );

  // Compute filtered products
  const filteredProducts = React.useMemo(() => {
    return filterProducts(initialProducts, {
      categoryId: selectedCategory,
      search: searchQuery,
      sort: sortBy,
      availableOnly,
    });
  }, [initialProducts, selectedCategory, searchQuery, sortBy, availableOnly]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("featured");
    setAvailableOnly(false);
  };

  const isFiltered =
    selectedCategory !== "all" ||
    searchQuery.trim().length > 0 ||
    sortBy !== "featured" ||
    availableOnly;

  return (
    <div className="space-y-8">
      {/* Search & Sort Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-[#F4F1EA] p-4 sm:p-5 rounded-lg border border-[#8A8179]/20">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8A8179] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="product-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by roast, tasting note, or confection..."
            className="w-full h-11 pl-10 pr-9 rounded-md bg-[#FDFBF7] border border-[#8A8179]/30 text-[#2C221E] placeholder-[#8A8179] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A373] focus:border-transparent transition-all"
            aria-label="Search roastery products"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8179] hover:text-[#2C221E] p-1"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Availability Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Availability checkbox */}
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-[#5C4A3D] select-none px-3 py-2 rounded-md bg-[#FDFBF7] border border-[#8A8179]/25 hover:border-[#D4A373]">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="rounded text-[#D4A373] focus:ring-[#D4A373] w-3.5 h-3.5"
            />
            <span>In Stock Only</span>
          </label>

          {/* Sort selector */}
          <div className="relative inline-flex items-center">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8A8179] absolute left-3 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as
                    | "featured"
                    | "price-asc"
                    | "price-desc"
                    | "name-asc"
                    | "newest"
                )
              }
              aria-label="Sort products by"
              className="h-11 pl-8 pr-8 rounded-md bg-[#FDFBF7] border border-[#8A8179]/30 text-xs font-medium text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#D4A373] cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
              <option value="newest">Recently Roasted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
            selectedCategory === "all"
              ? "bg-[#2C221E] text-[#FDFBF7] shadow-sm"
              : "bg-[#F4F1EA] text-[#5C4A3D] hover:bg-[#FAEDCD] border border-[#8A8179]/20"
          }`}
        >
          All Offerings ({initialProducts.length})
        </button>

        {categories.map((category) => {
          const count = initialProducts.filter(
            (p) => p.category_id === category.id
          ).length;
          const isSelected = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-[#2C221E] text-[#FDFBF7] shadow-sm"
                  : "bg-[#F4F1EA] text-[#5C4A3D] hover:bg-[#FAEDCD] border border-[#8A8179]/20"
              }`}
            >
              {category.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Counter & Active Filter Indicators */}
      <div className="flex items-center justify-between text-xs text-[#5C4A3D] px-1">
        <p>
          Showing <span className="font-bold text-[#2C221E]">{filteredProducts.length}</span> of{" "}
          <span className="font-bold text-[#2C221E]">{initialProducts.length}</span> handcrafted selections
        </p>

        {isFiltered && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-[#E07A5F] hover:underline font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-16 text-center rounded-lg border border-[#8A8179]/20 bg-[#F4F1EA] space-y-4">
          <Coffee className="w-10 h-10 text-[#8A8179] mx-auto" />
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#2C221E]">
              No Matching Roasts Found
            </h3>
            <p className="text-xs sm:text-sm text-[#5C4A3D] max-w-md mx-auto">
              We couldn&apos;t find any offerings matching your search criteria. Try
              adjusting your keywords or reset all filters.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="border-[#2C221E] text-[#2C221E] hover:bg-[#2C221E] hover:text-[#FDFBF7] rounded-md text-xs"
          >
            <span>Reset All Filters</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const categoryName = product.category_id
              ? categoryMap.get(product.category_id) || "Specialty"
              : "Specialty";

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between rounded-lg border border-[#8A8179]/20 bg-[#F4F1EA] p-6 hover:shadow-md hover:border-[#D4A373]/60 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Category, Status & Feature Badges */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#E07A5F] tracking-wider uppercase text-[11px]">
                      {categoryName}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {product.is_featured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAEDCD] text-[#5C4A3D]">
                          Featured
                        </span>
                      )}
                      {!product.is_available && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#F87171]/20 text-[#F87171]">
                          Sold Out
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-bold text-[#2C221E] group-hover:text-[#E07A5F] transition-colors">
                      <Link href={`/products/${product.slug}`}>
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C4A3D] font-sans line-clamp-2 leading-relaxed">
                      {product.description ||
                        "Specialty small-batch coffee with distinct origin terroir and balanced finish."}
                    </p>
                  </div>

                  {/* Ingredients/Flavor pills */}
                  {product.ingredients && product.ingredients.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.ingredients.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="text-[11px] px-2 py-0.5 rounded bg-[#FDFBF7] text-[#5C4A3D] border border-[#8A8179]/20 font-sans"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price & Action */}
                <div className="pt-6 mt-6 border-t border-[#8A8179]/15 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8A8179] block">
                      Pickup Price
                    </span>
                    <span className="font-serif text-xl font-bold text-[#2C221E]">
                      {formatBdt(product.price_minor)}
                    </span>
                  </div>

                  <Link href={`/products/${product.slug}`}>
                    <Button
                      variant="primary"
                      size="sm"
                      className="btn-cup-fill bg-[#2C221E] text-[#FDFBF7] hover:text-[#1A1613] rounded-md text-xs font-medium h-9 px-4 inline-flex items-center gap-1.5"
                    >
                      <span>Order Pickup</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
