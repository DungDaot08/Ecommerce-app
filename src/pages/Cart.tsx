import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart: React.FC = () => {
    const { cartItems, updateQuantity, removeFromCart } = useCart();

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div>
            <div className="mb-4">
                <Link
                    to="/"
                    className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded transition"
                >
                    ← Tiếp tục mua sắm
                </Link>
            </div>

            <h2 className="text-xl font-bold mb-4">🛒 Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty. <Link to="/" className="text-blue-500">Go shopping</Link></p>
            ) : (
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center border rounded p-3 bg-white">
                            <div className="flex gap-4 items-center">
                                <img src={item.image} alt={item.title} className="h-16 w-16 object-contain" />
                                <div>
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="text-sm text-gray-600">${item.price}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                    className="w-16 border rounded p-1 text-center"
                                />
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="text-right font-bold text-lg mt-4">
                        Total: ${totalPrice.toFixed(2)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
