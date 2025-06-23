import React from "react";
import { Product } from "../types/Product";
import { useCart } from "../context/CartContext"; 
import { toast } from "react-hot-toast";

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-md p-4 flex flex-col transition duration-300">
      <img
        src={product.image}
        alt={product.title}
        className="h-40 object-contain w-full mb-4"
      />
      <h3 className="text-base font-semibold line-clamp-2 h-[3em]">{product.title}</h3>
      <p className="text-gray-500 text-sm mb-1">{product.category}</p>
      <p className="text-xl font-bold text-blue-600 mb-1">${product.price}</p>
      {product.rating && (
        <p className="text-yellow-500 text-sm mb-3">
          {product.rating.rate} ★ ({product.rating.count})
        </p>
      )}
      <button
        onClick={() => {
          addToCart(product);
          toast.success(`Added "${product.title}" to cart!`);
        }}
        className="mt-auto bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};


export default ProductCard;
