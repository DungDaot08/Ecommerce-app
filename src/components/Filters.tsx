import React from "react";

interface FiltersProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  minPrice: number;
  maxPrice: number;
  setMinPrice: (value: number) => void;
  setMaxPrice: (value: number) => void;
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
    <div className="space-y-4 mb-6">
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block text-sm font-medium mb-1">Price Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Rating Filter */}
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

      {/* Sorting */}
      <div>
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
  );
};

export default Filters;
