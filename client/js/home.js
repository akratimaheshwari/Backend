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



