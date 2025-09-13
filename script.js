document.addEventListener("DOMContentLoaded", function () {
  // Initialize components
  initSlider();
  initFilterTabs();
  initMobileMenu();
  initAnimations();
  initProductOverlays();
});

// Hero Slider Functionality
function initSlider() {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  let currentSlide = 0;
  let slideInterval;

  // Start automatic slider
  startSlider();

  // Initialize slider controls
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      clearInterval(slideInterval);
      changeSlide(currentSlide - 1);
      startSlider();
    });

    nextBtn.addEventListener("click", () => {
      clearInterval(slideInterval);
      changeSlide(currentSlide + 1);
      startSlider();
    });
  }

  // Initialize slider dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      clearInterval(slideInterval);
      changeSlide(index);
      startSlider();
    });
  });

  // Function to start automatic slider
  function startSlider() {
    slideInterval = setInterval(() => {
      changeSlide(currentSlide + 1);
    }, 5000);
  }

  // Function to change slide
  function changeSlide(index) {
    // Reset all slides and dots
    slides.forEach((slide) => {
      slide.classList.remove("active");
    });

    dots.forEach((dot) => {
      dot.classList.remove("active");
    });

    // Handle circular navigation
    currentSlide = index;
    if (currentSlide < 0) {
      currentSlide = slides.length - 1;
    }
    if (currentSlide >= slides.length) {
      currentSlide = 0;
    }

    // Activate current slide and dot
    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
  }
}

// Product Filter Tabs
function initFilterTabs() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const products = document.querySelectorAll(".product-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active button
      filterBtns.forEach((btn) => btn.classList.remove("active"));
      btn.classList.add("active");

      // Filter products
      const filter = btn.getAttribute("data-filter");

      products.forEach((product) => {
        if (
          filter === "all" ||
          product.getAttribute("data-category") === filter
        ) {
          product.style.display = "block";
          // Add animation
          product.classList.remove("zoom-in");
          void product.offsetWidth; // Trigger reflow
          product.classList.add("zoom-in");
        } else {
          product.style.display = "none";
        }
      });
    });
  });
}

// Mobile Menu Toggle
function initMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".navigation");
  const dropdownLinks = document.querySelectorAll(".dropdown > a");

  if (menuToggle && navigation) {
    // Toggle mobile menu
    menuToggle.addEventListener("click", () => {
      navigation.classList.toggle("active");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target) &&
        navigation.classList.contains("active")
      ) {
        navigation.classList.remove("active");
      }
    });

    // Add back button to mobile menu
    if (window.innerWidth <= 768) {
      const backBtn = document.createElement("div");
      backBtn.className = "menu-back";
      backBtn.innerHTML = '<i class="fas fa-times"></i>';
      backBtn.style.position = "absolute";
      backBtn.style.top = "20px";
      backBtn.style.right = "20px";
      backBtn.style.fontSize = "24px";
      backBtn.style.cursor = "pointer";

      navigation.prepend(backBtn);

      backBtn.addEventListener("click", () => {
        navigation.classList.remove("active");
      });
    }

    // Handle dropdowns in mobile view
    if (window.innerWidth <= 768) {
      dropdownLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;

            if (dropdown.style.display === "block") {
              dropdown.style.display = "none";
            } else {
              // Close all other open dropdowns
              document
                .querySelectorAll(".dropdown-content")
                .forEach((content) => {
                  content.style.display = "none";
                });

              dropdown.style.display = "block";
            }
          }
        });
      });
    }
  }
}

// Initialize Animations on Scroll
function initAnimations() {
  const animatedElements = document.querySelectorAll(
    ".section-title, .product-card, .category-card, .promotion-card"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains("section-title")) {
            entry.target.classList.add("slide-left");
          } else if (entry.target.classList.contains("product-card")) {
            entry.target.classList.add("zoom-in");
          } else if (entry.target.classList.contains("category-card")) {
            entry.target.classList.add("fade-in");
          } else if (entry.target.classList.contains("promotion-card")) {
            entry.target.classList.add("slide-right");
          }
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
    // Remove pre-existing animation classes to prevent conflicts
    element.classList.remove("slide-left", "zoom-in", "fade-in", "slide-right");
  });
}

// Product Overlay Interaction
function initProductOverlays() {
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    const overlay = card.querySelector(".product-overlay");
    const icons = overlay.querySelectorAll("a");

    // Add click event for cart button
    const cartBtn = card.querySelector(".btn-cart");
    if (cartBtn) {
      cartBtn.addEventListener("click", function (e) {
        e.preventDefault();
        updateCart(1);
        showNotification("Product added to cart!");
      });
    }

    // Add click event for wishlist button
    const wishlistBtn = card.querySelector(".btn-wishlist");
    if (wishlistBtn) {
      wishlistBtn.addEventListener("click", function (e) {
        e.preventDefault();
        this.classList.toggle("active");
        if (this.classList.contains("active")) {
          this.innerHTML =
            '<i class="fas fa-heart" style="color: #ff4e50;"></i>';
          showNotification("Product added to wishlist!");
        } else {
          this.innerHTML = '<i class="fas fa-heart"></i>';
          showNotification("Product removed from wishlist!");
        }
      });
    }

    // Add hover effect with delayed animation
    icons.forEach((icon, index) => {
      icon.style.transitionDelay = `${index * 0.1}s`;
    });
  });
}

// Update Cart Count
function updateCart(count) {
  const cartCount = document.querySelector(".cart-count");
  if (cartCount) {
    const currentCount = parseInt(cartCount.textContent);
    cartCount.textContent = currentCount + count;

    // Add animation
    cartCount.classList.add("pulse");
    setTimeout(() => {
      cartCount.classList.remove("pulse");
    }, 500);
  }
}

// Show Notification
function showNotification(message) {
  // Check if notification container exists, if not create it
  let notificationContainer = document.querySelector(".notification-container");

  if (!notificationContainer) {
    notificationContainer = document.createElement("div");
    notificationContainer.className = "notification-container";
    document.body.appendChild(notificationContainer);

    // Add styles for notification container
    notificationContainer.style.position = "fixed";
    notificationContainer.style.top = "20px";
    notificationContainer.style.right = "20px";
    notificationContainer.style.zIndex = "9999";
  }

  // Create and show notification
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  // Style the notification
  notification.style.backgroundColor = "var(--primary-color)";
  notification.style.color = "white";
  notification.style.padding = "10px 20px";
  notification.style.borderRadius = "5px";
  notification.style.marginBottom = "10px";
  notification.style.boxShadow = "0 3px 10px rgba(0, 0, 0, 0.2)";
  notification.style.transform = "translateX(100%)";
  notification.style.opacity = "0";
  notification.style.transition = "all 0.3s ease";

  // Add to container
  notificationContainer.appendChild(notification);

  // Trigger animation
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
    notification.style.opacity = "1";
  }, 10);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    notification.style.opacity = "0";

    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      // Close mobile menu if open
      const navigation = document.querySelector(".navigation");
      if (navigation && navigation.classList.contains("active")) {
        navigation.classList.remove("active");
      }

      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

// Add pulse animation to cart count
const style = document.createElement("style");
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }
    .pulse {
        animation: pulse 0.5s ease;
    }
`;
document.head.appendChild(style);

// Add sticky header effect on scroll
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 100) {
    header.style.padding = "10px 50px";
    header.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
  } else {
    header.style.padding = "15px 50px";
    header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  }
});
