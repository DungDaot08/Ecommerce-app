import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import { useCart } from "./context/CartContext";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BrowserRouter>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#333",
          color: "#fff",
        },
      }}
    />
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            My E-commerce Store
          </h1>
          <Link
            to="/cart"
            className="text-blue-600 hover:underline font-medium"
          >
            🛒 Cart ({totalItems})
          </Link>
        </header>

        {/* Main content */}
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;


