document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in to view your cart.");
    window.location.href = "/signup";
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
      const start = new Date(item.rental_start_date);
      const end = new Date(item.rental_end_date);
      const timeDiff = end.getTime() - start.getTime();
      const rentalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // ✅ total rental duration in days

      const perDayRate = item.price;
      const subtotal = perDayRate * item.quantity * rentalDays;
      total += subtotal;

      html += `
        <div class="cart-item d-flex align-items-center border p-3 rounded mb-3 shadow-sm">
          <img src="${item.image}" alt="${item.title}" class="cart-thumb me-3" />
          <div class="flex-grow-1">
            <h5>${item.title}</h5>
            <p><strong>Rental Type:</strong> ${item.rental_type}</p>
            <p><strong>From:</strong> ${start.toLocaleDateString()} <strong>To:</strong> ${end.toLocaleDateString()}</p>
            <p><strong>Duration:</strong> ${rentalDays} day(s)</p>
            <p><strong>Quantity:</strong> 
              <input type="number" value="${item.quantity}" min="1" data-id="${item._id}" style="width: 60px;" />
            </p>
            <p><strong>Subtotal:</strong> ₹${subtotal}</p>
            <button class="remove-btn btn btn-sm btn-outline-danger mt-1" data-id="${item._id}">Remove</button>
          </div>
        </div>
      `;
    }

    html += `
      <div class="cart-summary mt-4 p-3 bg-light rounded shadow-sm">
        <h4>Total: ₹${total}</h4>
        <button class="btn btn-success mt-2">Proceed to Checkout</button>
      </div>
    `;

    container.innerHTML = html;

    // ✅ Remove item from cart
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

    // ✅ Quantity update
    document.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener("change", async () => {
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

