import React, { useEffect, useState, useMemo, useCallback } from "react";
import { fetchProducts } from "../api/products";
import { Product } from "../types/Product";
import ProductCard from "../components/ProductCard";
import Filters from "../components/Filters";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<string>("0");
  const [maxPrice, setMaxPrice] = useState<string>("1000");
  const [minRating, setMinRating] = useState<number>(0);
  const [sortOption, setSortOption] = useState<string>("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 12;

  useEffect(() => {
    const load = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    load();
  }, []);

  // Memoize filtered & sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      const price = product.price;
      const matchesPrice =
        price >= parseFloat(minPrice || "0") &&
        price <= parseFloat(maxPrice || "1000");

      const matchesRating = !product.rating || product.rating.rate >= minRating;

      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesPrice && matchesRating && matchesSearch;
    });

    switch (sortOption) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "rating-desc":
        filtered.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
    }

    return filtered;
  }, [
    products,
    selectedCategory,
    minPrice,
    maxPrice,
    minRating,
    sortOption,
    searchTerm,
  ]);

  // Memoize paginated products
  const currentProducts = useMemo(() => {
    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;
    return filteredProducts.slice(indexOfFirst, indexOfLast);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // useCallback for pagination change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Derive categories from products
  const categories = useMemo(
    () => ["all", ...new Set(products.map((p) => p.category))],
    [products]
  );

  return (
    <div>
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      <Filters
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        minRating={minRating}
        setMinRating={setMinRating}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      <div className="md:col-span-3">
        <h2 className="text-xl font-semibold mb-4">Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Home;
