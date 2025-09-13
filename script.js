document.addEventListener("DOMContentLoaded", function () {
  // Initialize components
  initSlider();
  initFilterTabs();
  initMobileMenu();
  initAnimations();
  initProductOverlays();
  initCountdownTimer();
  enhanceProductCards();
  convertPricesToLKR();
});

// Modern Hero Slider Functionality with Advanced Animations
function initSlider() {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  let currentSlide = 0;
  let slideInterval;
  const slideDuration = 6000; // 6 seconds per slide

  // Reset all progress bars initially
  resetProgressBars();

  // Start automatic slider
  startSlider();

  // Initialize slider controls
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      clearInterval(slideInterval);
      resetProgressBars();
      changeSlide(currentSlide - 1);
      startSlider();
    });

    nextBtn.addEventListener("click", () => {
      clearInterval(slideInterval);
      resetProgressBars();
      changeSlide(currentSlide + 1);
      startSlider();
    });
  }

  // Initialize slider dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      if (currentSlide !== index) {
        clearInterval(slideInterval);
        resetProgressBars();
        changeSlide(index);
        startSlider();
      }
    });
  });

  // Function to reset progress bars
  function resetProgressBars() {
    dots.forEach((dot) => {
      const progressBar = dot.querySelector(".dot-progress");
      if (progressBar) {
        progressBar.style.transition = "none";
        progressBar.style.width = "0";
      }
    });
  }

  // Function to animate the current progress bar
  function animateProgressBar(index) {
    const currentDot = dots[index];
    if (currentDot) {
      const progressBar = currentDot.querySelector(".dot-progress");
      if (progressBar) {
        // Force a reflow to ensure the transition works correctly
        void progressBar.offsetWidth;
        progressBar.style.transition = `width ${slideDuration}ms linear`;
        progressBar.style.width = "100%";
      }
    }
  }

  // Function to start automatic slider
  function startSlider() {
    // Animate the progress bar for the current slide
    animateProgressBar(currentSlide);

    slideInterval = setInterval(() => {
      resetProgressBars();
      changeSlide(currentSlide + 1);
      animateProgressBar(currentSlide);
    }, slideDuration);
  }

  // Function to change slide
  function changeSlide(index) {
    // Reset all slides and dots
    slides.forEach((slide) => {
      slide.classList.remove("active");

      // Reset animation elements
      const animElements = slide.querySelectorAll(
        ".animate-text, .animate-btn, .subtitle"
      );
      animElements.forEach((elem) => {
        elem.style.opacity = "0";
      });
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

    // Reset and replay animations for the current slide
    const currentAnimElements = slides[currentSlide].querySelectorAll(
      ".animate-text, .animate-btn, .subtitle"
    );
    currentAnimElements.forEach((elem) => {
      elem.style.animation = "none";
      void elem.offsetHeight; // Force reflow

      // Restore the original animation
      if (elem.classList.contains("animate-text")) {
        elem.style.animation = "fadeInUp 0.8s ease forwards";
      } else if (elem.classList.contains("subtitle")) {
        elem.style.animation = "fadeInLeft 0.8s ease forwards";
      } else if (elem.classList.contains("animate-btn")) {
        elem.style.animation = "fadeInUp 0.8s ease forwards";
      }

      // Re-apply delays
      if (elem.classList.contains("delay-1")) {
        elem.style.animationDelay = "0.2s";
      } else if (elem.classList.contains("delay-2")) {
        elem.style.animationDelay = "0.4s";
      } else if (elem.classList.contains("delay-3")) {
        elem.style.animationDelay = "0.6s";
      }
    });
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

    // Add back button to mobile menu - only for screens <= 768px
    if (window.innerWidth <= 768) {
      const backBtn = document.createElement("div");
      backBtn.className = "menu-back";
      backBtn.innerHTML = '<i class="fas fa-times"></i>';
      backBtn.style.position = "absolute";
      backBtn.style.top = "20px";
      backBtn.style.right = "20px";
      backBtn.style.fontSize = "24px";
      backBtn.style.cursor = "pointer";
      backBtn.style.display = "none"; // Hide by default

      // Only show on mobile view
      const showHideBackBtn = () => {
        if (window.innerWidth <= 768) {
          backBtn.style.display = "block"; // Show on mobile
        } else {
          backBtn.style.display = "none"; // Hide on desktop
        }
      };

      // Run initially and add resize listener
      showHideBackBtn();
      window.addEventListener("resize", showHideBackBtn);

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

// Countdown Timer Functionality
function initCountdownTimer() {
  const countdownContainer = document.getElementById("countdown-timer");
  if (!countdownContainer) return;

  // Get end date from data attribute or default to 7 days from now
  let endDate = countdownContainer.getAttribute("data-end-date");
  if (!endDate) {
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 7);
    endDate = defaultEndDate.toISOString();
  }

  const endDateTime = new Date(endDate).getTime();

  // Elements to update
  const daysElement = document.getElementById("days-value");
  const hoursElement = document.getElementById("hours-value");
  const minutesElement = document.getElementById("minutes-value");
  const secondsElement = document.getElementById("seconds-value");

  // Animation elements
  const timeAnimations = document.querySelectorAll(".time-animation");

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = endDateTime - now;

    if (distance < 0) {
      // Countdown finished
      daysElement.textContent = "00";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";

      // Stop the countdown
      clearInterval(countdownInterval);
      return;
    }

    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Add leading zeros
    const formatNumber = (num) => (num < 10 ? `0${num}` : num);

    // Update the elements
    daysElement.innerHTML =
      formatNumber(days) + '<span class="time-animation"></span>';
    hoursElement.innerHTML =
      formatNumber(hours) + '<span class="time-animation"></span>';
    minutesElement.innerHTML =
      formatNumber(minutes) + '<span class="time-animation"></span>';
    secondsElement.innerHTML =
      formatNumber(seconds) + '<span class="time-animation"></span>';

    // Add animation for seconds
    const secondsAnimation = secondsElement.querySelector(".time-animation");
    if (secondsAnimation) {
      secondsAnimation.style.animation = "none";
      setTimeout(() => {
        secondsAnimation.style.animation = "countdown 1s linear infinite";
      }, 10);
    }

    // Add animation for minutes when seconds roll over
    if (seconds === 59) {
      const minutesAnimation = minutesElement.querySelector(".time-animation");
      if (minutesAnimation) {
        minutesAnimation.style.animation = "none";
        setTimeout(() => {
          minutesAnimation.style.animation = "countdown 60s linear infinite";
        }, 10);
      }
    }

    // Add animation for hours when minutes roll over
    if (seconds === 59 && minutes === 59) {
      const hoursAnimation = hoursElement.querySelector(".time-animation");
      if (hoursAnimation) {
        hoursAnimation.style.animation = "none";
        setTimeout(() => {
          hoursAnimation.style.animation = "countdown 3600s linear infinite";
        }, 10);
      }
    }

    // Add animation for days when hours roll over
    if (seconds === 59 && minutes === 59 && hours === 23) {
      const daysAnimation = daysElement.querySelector(".time-animation");
      if (daysAnimation) {
        daysAnimation.style.animation = "none";
        setTimeout(() => {
          daysAnimation.style.animation = "countdown 86400s linear infinite";
        }, 10);
      }
    }
  }

  // Initial call
  updateCountdown();

  // Update the countdown every second
  const countdownInterval = setInterval(updateCountdown, 1000);
}

// Enhanced Product Card Interactivity
function enhanceProductCards() {
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    // Add subtle tilt effect on mouse movement
    card.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top; // y position within the element

      // Calculate the tilt based on cursor position
      const xTilt = (x / rect.width - 0.5) * 4; // Max tilt of 4 degrees
      const yTilt = (y / rect.height - 0.5) * -4; // Inverse for correct tilt direction

      // Apply the tilt effect with transform
      this.style.transform = `translateY(-8px) perspective(1000px) rotateX(${yTilt}deg) rotateY(${xTilt}deg)`;
    });

    // Reset transform when mouse leaves
    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(-8px)";

      // Add a subtle bounce effect when mouse leaves
      setTimeout(() => {
        this.style.transform = "translateY(-4px)";
      }, 100);

      setTimeout(() => {
        this.style.transform = "translateY(-8px)";
      }, 200);

      setTimeout(() => {
        this.style.transform = "translateY(-5px)";
      }, 300);

      setTimeout(() => {
        this.style.transform = "translateY(-8px)";
      }, 400);
    });

    // Add touch functionality for mobile devices
    card.addEventListener("touchstart", function () {
      this.style.transform = "translateY(-5px)";
    });

    card.addEventListener("touchend", function () {
      this.style.transform = "translateY(-8px)";

      setTimeout(() => {
        this.style.transform = "translateY(0)";
      }, 300);
    });
  });
}

// Function to convert USD prices to LKR (under 5000)
function convertPricesToLKR() {
  const priceElements = document.querySelectorAll(".price");
  const originalPriceElements = document.querySelectorAll(".original-price");

  // Exchange rate (fictional for this example - keeping prices under LKR 5000)
  // Let's use a rate that ensures most prices will be under 5000 LKR
  // For example, if we use 50 as an exchange rate, a $49.99 would be LKR 2499.50
  const exchangeRate = 50;

  // Function to convert price and ensure it's under LKR 5000
  const convertPrice = (priceText) => {
    // Extract numeric value from price string (removing $ sign)
    const priceValue = parseFloat(priceText.replace("$", ""));

    // Convert to LKR
    let lkrPrice = priceValue * exchangeRate;

    // Ensure price is under LKR 5000
    if (lkrPrice >= 5000) {
      // Apply a discount to bring it under 5000
      lkrPrice = Math.min(4999, lkrPrice * 0.8);
    }

    // Format with commas and return
    return "LKR " + lkrPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Update regular prices
  priceElements.forEach((element) => {
    const originalPrice = element.textContent;
    element.textContent = convertPrice(originalPrice);
    element.setAttribute("data-original-price", originalPrice);
  });

  // Update original/discounted prices if any
  originalPriceElements.forEach((element) => {
    const originalPrice = element.textContent;
    element.textContent = convertPrice(originalPrice);
    element.setAttribute("data-original-price", originalPrice);
  });
}
