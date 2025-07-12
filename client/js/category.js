const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

document.getElementById("categoryTitle").innerText = slug?.toUpperCase() || "Category";

async function loadCategoryItems() {
  try {
    const res = await fetch(`/api/items/category/${slug}`);
    const items = await res.json();

    const container = document.getElementById("categoryItems");
    if (!items.length) {
      container.innerHTML = "<p>No items found in this category.</p>";
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="item-card">
        <img src="${item.images[0]}" />
        <h3>${item.title}</h3>
        <p>₹${item.pricing?.per_day}/day</p>
        <span class="status ${item.status}">${item.status}</span>
      </div>
    `).join("");
  } catch (err) {
    console.error("Error loading items:", err);
  }
}

loadCategoryItems();

