function loadItemDetails() {
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("id");

  if (!itemId) {
    alert("Item ID not found in URL");
    return;
  }

  fetch(`/api/items/${itemId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch item");
      return res.json();
    })
    .then((item) => {
      document.getElementById("itemTitle").textContent = item.title || "No title";
      document.getElementById("itemDescription").textContent = item.description || "No description";
      document.getElementById("itemPrice").textContent = `₹${item.pricing?.per_day ?? "--"} /day`;
      document.getElementById("itemAvailability").textContent = item.available ? "In Stock" : "Out of Stock";

      const images = item.images?.length ? item.images : ["https://via.placeholder.com/300x200?text=No+Image"];
      const carouselInner = document.getElementById("carouselInner");
      carouselInner.innerHTML = "";

      images.forEach((img, index) => {
        const div = document.createElement("div");
        div.className = `carousel-item${index === 0 ? " active" : ""}`;
        div.innerHTML = `
          <img src="${img}" class="d-block w-100 rounded shadow-sm" alt="Image ${index + 1}">
        `;
        carouselInner.appendChild(div);
      });

      const specTable = document.getElementById("specTable");
      specTable.innerHTML = "";
      if (item.specifications) {
        for (const key in item.specifications) {
          const row = document.createElement("tr");
          row.innerHTML = `<th>${key}</th><td>${item.specifications[key]}</td>`;
          specTable.appendChild(row);
        }
      }
    })
    .catch((err) => {
      console.error("❌ Error loading item:", err);
      alert("Failed to load item details.");
    });
}

function addToCart() {
  alert(`Item added to cart.`);
}

function buyNow() {
  alert("Redirecting to checkout...");
  // window.location.href = "checkout.html";
}

window.onload = loadItemDetails;

