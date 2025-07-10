const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = form.name.value;
  const email = form.email.value;
  const password = form.password.value;
  const phone = form.phone.value;
  const address = form.address.value;

  try {
    const res = await fetch('/api/users/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password, phone, address })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    // ✅ Redirect to home page after successful signup
    window.location.href = '/home.html';
  } catch (err) {
    alert('Signup failed: ' + err.message);
  }
});

