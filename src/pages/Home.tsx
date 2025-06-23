import React, { useEffect, useState } from "react";
import { fetchProducts } from "../api/products";
import { Product } from "../types/Product";
import ProductCard from "../components/ProductCard";
import Filters from "../components/Filters";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";


const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortOption, setSortOption] = useState<string>("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);



  useEffect(() => {
    const load = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data);
    };
    load();
  }, []);

  useEffect(() => {
    let filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      const matchesRating = !product.rating || product.rating.rate >= minRating;
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesPrice && matchesRating && matchesSearch;
    });

    // Sắp xếp
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

    setFilteredProducts(filtered);
    setCurrentPage(1); // reset page khi lọc
  }, [products, selectedCategory, minPrice, maxPrice, minRating, sortOption, searchTerm]);


  const categories = ["all", ...new Set(products.map((p) => p.category))];

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

      {/* Danh sách sản phẩm trang hiện tại */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
    </div>
  );
};

export default Home;
