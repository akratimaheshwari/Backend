
  const grid = document.getElementById('itemsGrid');

  // Fetch items from backend
  fetch('https://your-backend-url.com/api/items') // Replace with your real backend endpoint
    .then(response => response.json())
    .then(items => {
      items.forEach(item => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';

        col.innerHTML = `
          <div class="card product-card">
            <img src="${item.image}" class="card-img-top product-img" alt="${item.title}">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
              <p class="card-text text-muted">${item.description}</p>
              <p class="fw-bold">₹${item.price} / day</p>
              <div class="d-flex justify-content-between">
                <button class="btn btn-add btn-sm" onclick="addToCart('${item.title}')">Add to Cart</button>
                <a href="itemdetails.html?id=${item.id}" class="btn btn-details btn-sm">View Details</a>
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

  function addToCart(title) {
    alert(`"${title}" added to cart.`);
  }

