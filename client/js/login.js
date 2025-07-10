document.getElementById('loginForm').addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = e.target.email.value;
      const password = e.target.password.value;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok && data.token) {
          localStorage.setItem('token', data.token);
          alert('Login successful!');
          window.location.href = '/home.html'; // redirect after login
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (err) {
        console.error('Login error:', err);
        alert('Something went wrong. Try again.');
      }
    });