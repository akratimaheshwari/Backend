let slides = document.querySelectorAll('.carousel-slide');
let dots = document.querySelectorAll('.dot');
let currentIndex = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
    dots[i].classList.toggle('active', i === index);
  });
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}

setInterval(nextSlide, 3000);

// Add click events to dots
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    currentIndex = parseInt(dot.dataset.index);
    showSlide(currentIndex);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  
  searchInput.addEventListener("input", filterItems);

// ✅ Trigger on button click
// await fetchCategoriesAndItems(); // Wait till all items are loaded
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    window.location.href = `items.html?q=${encodeURIComponent(query)}`;
  }
});
  const authLink = document.getElementById("auth-link");
  const token = localStorage.getItem("token");

  if (token) {
    authLink.innerHTML = `
  <a href="userDashboard.html" aria-label="User Profile">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
         fill="currentColor" viewBox="0 0 24 24"
         style="vertical-align: middle; color: #708090;">
      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
    </svg>
  </a>
`;

    authLink.href = "userdashboard.html";
  } else {
    authLink.textContent = "Signup/Login";
    authLink.href = "signup.html";
  }
  

});
const categoriesContainer = document.getElementById("categoriesContainer");

async function fetchCategoriesAndItems() {
  try {
    const res = await fetch("/api/categories");
    const categories = await res.json();

    for (const category of categories) {
      const section = document.createElement("div");
      section.classList.add("category-block");

      section.innerHTML = `
  <a href="category.html?slug=${category.slug}" class="category-header-link">
    <div class="category-header">
      <img src="${category.image}" alt="${category.title}" class="category-img" />
      <h2 class="category-title">${category.title}</h2>
    </div>
  </a>
   
`;




      categoriesContainer.appendChild(section);

      // loadItemsForCategory(category.slug, `items-${category.slug}`);
    }
  } catch (err) {
    console.error("Error loading categories:", err);
  }
}

async function loadItemsForCategory(slug, containerId) {
  try {
    const res = await fetch(`/api/items/category/${slug}`);
    const items = await res.json();

    const container = document.getElementById(containerId);
    if (items.length === 0) {
      container.innerHTML = `<p>No items available.</p>`;
      return;
    }

    container.innerHTML = items.map(item => `
  <a href="item.html?id=${item._id}" class="item-link">
    <div class="item-card">
      <img src="${item.images[0]}" alt="${item.title}" />
      <h3>${item.title}</h3>
      <p>₹${item.pricing?.per_day}/day</p>
      <span class="status ${item.status}">${item.status}</span>
    </div>
  </a>
`).join("");

  } catch (err) {
    console.error(`Error loading items for ${slug}:`, err);
  }
}

fetchCategoriesAndItems();

// 🔍 Search bar filtering

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");  // ✅ select by ID now

function filterItems() {
  const query = searchInput.value.toLowerCase();
  const allItems = document.querySelectorAll(".item-card");

  let found = false;

  allItems.forEach(item => {
    const title = item.querySelector("h3")?.textContent.toLowerCase() || "";
    const match = title.includes(query);
    item.style.display = match ? "block" : "none";
    if (match) found = true;
  });

  const noResultId = "no-items-msg";
  let noResultMsg = document.getElementById(noResultId);

  if (!found) {
    if (!noResultMsg) {
      noResultMsg = document.createElement("p");
      noResultMsg.id = noResultId;
      noResultMsg.textContent = "No items found.";
      noResultMsg.style.textAlign = "center";
      noResultMsg.style.fontWeight = "bold";
      categoriesContainer.appendChild(noResultMsg);
    }
  } else {
    if (noResultMsg) noResultMsg.remove();
  }
}

// 🔁 Trigger on typing
searchInput.addEventListener("input", filterItems);

// ✅ Trigger on button click
// await fetchCategoriesAndItems(); // Wait till all items are loaded
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    window.location.href = `items.html?q=${encodeURIComponent(query)}`;
  }
});




