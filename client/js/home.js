let slides = document.querySelectorAll('.carousel-slide');
    let currentIndex = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    }

    setInterval(nextSlide, 3000);

    document.addEventListener("DOMContentLoaded", () => {
      const authLink = document.getElementById("auth-link");
      const token = localStorage.getItem("token");

      if (token) {
        authLink.textContent = "👤";
        

        authLink.href = "userdashboard.html";
        
      } else {
        authLink.textContent = "Signup/Login";
        authLink.href = "signup.html";
      }

    });

