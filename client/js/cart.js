document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in to view your cart.");
    window.location.href = "/signup"; // redirect if not logged in
    return;
  }

  try {
    const res = await fetch("/api/cart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to fetch cart");

    const cartItems = await res.json();
    const container = document.querySelector(".container");

    if (cartItems.length === 0) {
      container.innerHTML = `<h2>🛒 Your Cart</h2><p>Your cart is empty.</p>`;
      return;
    }

    let html = `<h2>🛒 Your Cart</h2>`;
    let total = 0;

    for (const item of cartItems) {
      const product = item.item_id;
      const subtotal = product.price * item.quantity;
      total += subtotal;

      html += `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.name}" />
          <div class="cart-details">
            <h3>${product.name}</h3>
            <p>${product.description || ''}</p>
            <p><strong>Rental Type:</strong> ${item.rental_type}</p>
            <p><strong>From:</strong> ${new Date(item.rental_start_date).toLocaleDateString()}</p>
            <p><strong>To:</strong> ${new Date(item.rental_end_date).toLocaleDateString()}</p>
          </div>
          <div class="quantity">
            <label>Qty:</label>
            <input type="number" value="${item.quantity}" min="1" data-id="${item._id}">
          </div>
          <div class="price">Rs.${subtotal}</div>
          <button class="remove-btn" data-id="${item._id}">Remove</button>
        </div>
      `;
    }

    html += `
      <div class="cart-summary">
        <h3>Total: Rs.${total}</h3>
        <button class="btn-checkout">Checkout</button>
      </div>
    `;

    container.innerHTML = html;

    // ✅ Remove item handler
    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        await fetch(`/api/cart/remove/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        location.reload();
      });
    });

    // ✅ Quantity update handler
    document.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('change', async () => {
        const cartItemId = input.getAttribute("data-id");
        const newQuantity = parseInt(input.value);

        if (newQuantity < 1) {
          alert("Quantity must be at least 1");
          return;
        }

        try {
          const res = await fetch(`/api/cart/update/${cartItemId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ quantity: newQuantity })
          });

          if (!res.ok) throw new Error("Failed to update quantity");

          const data = await res.json();
          console.log("Quantity updated:", data);
          location.reload();

        } catch (err) {
          alert("Failed to update quantity: " + err.message);
        }
      });
    });

  } catch (error) {
    console.error("Cart loading error:", error);
    alert("Something went wrong loading your cart.");
  }
});

