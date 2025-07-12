function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const searchQuery = getQueryParam("q")?.toLowerCase() || "";
const itemsContainer = document.getElementById("itemsContainer");
const heading = document.getElementById("resultsHeading");

async function loadItems() {
  try {
    const res = await fetch("/api/items");
    const items = await res.json();

    let filteredItems = items;

    if (searchQuery) {
      filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery)
      );
      heading.textContent = `Results for "${searchQuery}"`;
    }

    if (filteredItems.length === 0) {
      itemsContainer.innerHTML = `<p>No items found.</p>`;
      return;
    }

    itemsContainer.innerHTML = filteredItems.map(item => `
      <div class="item-card">
        <img src="${item.images[0]}" alt="${item.title}" />
        <h3>${item.title}</h3>
        <p>₹${item.pricing?.per_day}/day</p>
        <span class="status ${item.status}">${item.status}</span>
      </div>
    `).join("");

  } catch (err) {
    itemsContainer.innerHTML = `<p>Error loading items.</p>`;
    console.error("Error:", err);
  }
}

loadItems();
