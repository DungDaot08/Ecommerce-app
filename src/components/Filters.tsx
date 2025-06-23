import React from "react";

interface FiltersProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  minPrice: string;
  maxPrice: string;
  setMinPrice: (value: string) => void;
  setMaxPrice: (value: string) => void;
  minRating: number;
  setMinRating: (value: number) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  sortOption,
  setSortOption,
}) => {
  return (
    <div className="space-y-4 mb-6 bg-white p-4 rounded shadow w-full">

      {/* Row 1: Category + Sort */}
      <div className="flex flex-col md:flex-row md:items-end md:gap-4">
        {/* Category Filter */}
        <div className="flex-1 mb-4 md:mb-0">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Sort By</label>
          <select
            className="w-full p-2 border rounded"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">-- Default --</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
            <option value="rating-desc">Rating: High to Low</option>
          </select>
        </div>
      </div>

      {/* Row 2: Rating */}
      <div>
        <label className="block text-sm font-medium mb-1">Min Rating</label>
        <select
          className="w-full p-2 border rounded"
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
        >
          <option value={0}>All</option>
          <option value={1}>1 ★</option>
          <option value={2}>2 ★</option>
          <option value={3}>3 ★</option>
          <option value={4}>4 ★</option>
        </select>
      </div>

      {/* Row 3: Price Range */}
      <div>
        <label className="block text-sm font-medium mb-1">Price Range ($)</label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">From</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) setMinPrice(val);
            }}
            onBlur={() => {
              if (minPrice === "") setMinPrice("0");
            }}
            className="p-2 border rounded w-24"
          />
          <span className="text-sm text-gray-600">to</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) setMaxPrice(val);
            }}
            onBlur={() => {
              if (maxPrice === "") setMaxPrice("1000");
            }}
            className="p-2 border rounded w-24"
          />
          <div className="flex-grow" />
        </div>
      </div>
    </div>
  );
};

export default Filters;
