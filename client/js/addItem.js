const form = document.getElementById("addItemForm");

document.addEventListener("DOMContentLoaded", async () => {
  const categorySelect = document.getElementById("categorySelect");

  try {
    const res = await fetch("/api/categories");
    const categories = await res.json();

    categorySelect.innerHTML = categories.map(cat =>
      `<option value="${cat._id}">${cat.title}</option>`
    ).join("");
  } catch (err) {
    categorySelect.innerHTML = `<option>Error loading categories</option>`;
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const formData = new FormData(form);

  const pricing = {
    per_day: formData.get("per_day")
  };

  formData.delete("per_day");
  formData.append("pricing", JSON.stringify(pricing));

  try {
    const res = await fetch("/api/items", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) throw new Error("Failed to add item");

    alert("Item added successfully!");
    window.location.href = "userDashboard.html";
  } catch (err) {
    alert("Error: " + err.message);
  }
});

