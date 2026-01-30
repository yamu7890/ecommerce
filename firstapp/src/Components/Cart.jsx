import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Login first to view your cart");
      return;
    }
    try {
      const res = await axios.get("http://localhost:4000/api/cart", {
        params: { userId },
      });
      if (res.status === 200) {
        setCart(res.data);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  }

  async function removeFromCart(productId) {
    const userId = localStorage.getItem("userId");
    try {
      const res = await axios.delete("http://localhost:4000/api/cart/remove", {
        params: { userId, productId },
      });
      if (res.status === 200) {
        alert("Product removed from cart");
        fetchCart(); // refresh cart
      }
    } catch (err) {
      console.error("Error removing product:", err);
    }
  }

  function calculateTotal() {
    return cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>
      {loading ? (
        <p>Loading...</p>
      ) : cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-md-2 g-4 mt-3">
            {cart.items.map((item) => (
              <div className="col" key={item._id}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{item.product.name}</h5>
                    <p className="card-text">
                      <b>Price:</b> ${item.product.price}
                    </p>
                    <p className="card-text">
                      <b>Quantity:</b> {item.quantity}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="btn btn-danger"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <h4>Total: ${calculateTotal()}</h4>
            <button className="btn btn-success">Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}