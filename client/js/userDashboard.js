
  const sidebarMenu = document.getElementById('sidebarMenu');
  const ownerContent = document.getElementById('ownerContent');
  const renterContent = document.getElementById('renterContent');
  const personalInfoSection = document.getElementById('personalInfoSection');
  const saveBtn = document.getElementById('saveBtn');

  let userData = {
    fullName: '',
    email: '',
    phone: '',
    address: ''
  };

  const ownerSidebarItems = [
    { text: "Dashboard", href: "#", active: true },
    { text: "My Listings", href: "#" },
    { text: "Get Orders", href: "#" },
    { text: "Personal Info", href: "#" },
    { text: "Log Out", href: "#", danger: true }
  ];

  const renterSidebarItems = [
    { text: "Dashboard", href: "#", active: true },
    { text: "My Orders", href: "#" },
    { text: "My Cart", href: "cart.html" },
    { text: "Personal Info", href: "#" },
    { text: "Log Out", href: "#", danger: true }
  ];

  function renderSidebar(items) {
    sidebarMenu.innerHTML = '';
    sidebarMenu.classList.remove('sidebar-hidden');

    items.forEach(item => {
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.text;
      a.className = 'list-group-item list-group-item-action';
      if (item.active) a.classList.add('active');
      if (item.danger) a.classList.add('text-danger');

      a.addEventListener('click', function (e) {
        if (item.text === "Personal Info") {
          e.preventDefault();
          showPersonalInfo();
        } else {
          hidePersonalInfo();
        }

        if (item.text === "Log Out") {
          e.preventDefault();
          logout(); // <-- Use the logout function
        }
      });

      sidebarMenu.appendChild(a);
    });
  }

  async function showPersonalInfo() {
    personalInfoSection.style.display = "block";
    ownerContent.style.display = "none";
    renterContent.style.display = "none";
    saveBtn.classList.add('d-none');

    const token = localStorage.getItem('token');
    try {
    const res = await fetch('/api/users/profile', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

      if (!res.ok) throw new Error('Failed to fetch user data');
      const data = await res.json();
      console.log("Fetched user data:", data); // Debug log

      userData = {
        fullName: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address
      };
    //   updatePersonalInfoDisplay();
    // setTimeout(() => updatePersonalInfoDisplay(), 50);
    setTimeout(() => {
  const editBtn = document.getElementById('editBtn');
  if (editBtn) {
    editBtn.addEventListener('click', editPersonalInfo);
  }
  updatePersonalInfoDisplay();
}, 50);


    } catch (err) {
      alert("Error loading data: " + err.message);
    }
  }

  function updatePersonalInfoDisplay() {
  const nameEl = document.getElementById('pi-name');
  const emailEl = document.getElementById('pi-email');
  const phoneEl = document.getElementById('pi-phone');
  const addressEl = document.getElementById('pi-address');

 if (!nameEl || !emailEl || !phoneEl || !addressEl) {
    console.error("❌ One or more elements not found in DOM");
    console.log({ nameEl, emailEl, phoneEl, addressEl }); // Debugging
    return;
  }

  nameEl.textContent = userData.fullName;
  emailEl.textContent = userData.email;
  phoneEl.textContent = userData.phone;
  addressEl.textContent = userData.address;
}


  function hidePersonalInfo() {
    personalInfoSection.style.display = "none";
    saveBtn.classList.add('d-none');
    ownerContent.style.display = document.getElementById('owner').checked ? 'block' : 'none';
    renterContent.style.display = document.getElementById('renter').checked ? 'block' : 'none';
  }

  function editPersonalInfo() {
    const listItems = personalInfoSection.querySelectorAll('.list-group-item');
    const fields = ['fullName', 'email', 'phone', 'address'];

    listItems.forEach((li, i) => {
      const input = document.createElement('input');
      input.className = 'form-control';
      input.value = userData[fields[i]];
      li.innerHTML = `<strong>${li.innerText.split(':')[0]}:</strong> `;
      li.appendChild(input);
    });

    saveBtn.classList.remove('d-none');
  }

  async function savePersonalInfo() {
    const inputs = personalInfoSection.querySelectorAll('input');
    userData.fullName = inputs[0].value;
    userData.email = inputs[1].value;
    userData.phone = inputs[2].value;
    userData.address = inputs[3].value;

    const token = localStorage.getItem('token');

    try {
      const profileRes = await fetch('/api/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profileData = await profileRes.json();
      const userId = profileData._id;

      const res = await fetch(`/api/users/${userId}`, {

        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          address: userData.address
        })
      });

      if (!res.ok) throw new Error("Failed to save data");

      updatePersonalInfoDisplay();
      saveBtn.classList.add('d-none');
      document.querySelector('.sidebar-menu').classList.add('sidebar-hidden');
      alert("Changes saved successfully!");
    } catch (err) {
      alert("Error saving data: " + err.message);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "home.html"; // redirect to home
  }

  document.addEventListener("DOMContentLoaded", () => {
//   document.getElementById('editBtn').addEventListener('click', editPersonalInfo);

  renderSidebar(ownerSidebarItems);

  document.querySelectorAll('input[name="userType"]').forEach(input => {
    input.addEventListener('change', function () {
      if (this.id === "owner") {
        renderSidebar(ownerSidebarItems);
        ownerContent.style.display = "block";
        renterContent.style.display = "none";
      } else {
        renderSidebar(renterSidebarItems);
        ownerContent.style.display = "none";
        renterContent.style.display = "block";
      }
      hidePersonalInfo();
    });
  });
});


