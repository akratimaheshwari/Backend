const grid = document.getElementById('itemsGrid');

// Adjust if your backend is on port 5000
fetch('/api/items')
  .then(response => response.json())
  .then(items => {
    console.log('Fetched items:', items);
    items.forEach(item => {
      const col = document.createElement('div');
      col.className = 'col-md-4 mb-4';

      // fallback image if none
      const image = item.images && item.images.length > 0
        ? item.images[0]
        : 'https://via.placeholder.com/300x200?text=No+Image';

      const price = item.pricing?.per_day ?? 0;

      col.innerHTML = `
        <div class="card product-card">
          <img src="${image}" class="card-img-top product-img" alt="${item.title}">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text text-muted">${item.description}</p>
            <p class="fw-bold">₹${price} / day</p>
            <div class="d-flex justify-content-between">
              <button class="btn btn-add btn-sm" onclick='addToCart("${item._id}", "${item.title}")'>Add to Cart</button>

              <a href="itemdetails.html?id=${item._id}" class="btn btn-details btn-sm">View Details</a>
            </div>
          </div>
        </div>
      `;
      grid.appendChild(col);
    });
  })
  .catch(error => {
    console.error('Error fetching items:', error);
    grid.innerHTML = `<p class="text-danger">Failed to load items. Please try again later.</p>`;
  });

function addToCart(itemId, title) {
  const token = localStorage.getItem('token');

  if (!token) {
    alert("Please login to add items to cart.");
    window.location.href = 'login.html';
    return;
  }

  fetch('/api/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ item_id: itemId })
  })
  .then(res => res.json())
  .then(data => {
    if (data.message) {
      alert(`"${title}" added to cart.`);
    } else {
      alert("Error: " + data.error);
    }
  })
  .catch(err => {
    console.error(err);
    alert("Failed to add to cart");
  });
}

