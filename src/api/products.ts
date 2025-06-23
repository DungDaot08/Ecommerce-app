import axios from "axios";
import { Product } from "../types/Product";

// Fetch products from DummyJSON and map to your Product[] type
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get("https://dummyjson.com/products?limit=100");

  const mappedProducts: Product[] = response.data.products.map((item: any) => ({
    id: item.id,
    title: item.title,
    price: item.price,
    description: item.description,
    category: item.category,
    image: item.thumbnail, // hoặc item.images[0] nếu muốn ảnh to hơn
    rating: {
      rate: item.rating,
      count: item.stock, // bạn có thể thay thành 100 + Math.random() * 100 nếu muốn giả số đánh giá
    },
  }));

  return mappedProducts;
};
