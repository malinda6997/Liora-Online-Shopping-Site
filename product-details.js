// Product Details Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Product Image Gallery
  const setupProductGallery = () => {
    const mainImage = document.getElementById("main-product-image");
    const thumbnails = document.querySelectorAll(".thumbnail");

    if (mainImage && thumbnails.length) {
      thumbnails.forEach((thumb) => {
        thumb.addEventListener("click", function () {
          // Change main image with fade animation
          mainImage.style.opacity = "0";
          setTimeout(() => {
            mainImage.src = this.getAttribute("data-image");
            mainImage.style.opacity = "1";
          }, 200);

          // Update active thumbnail
          thumbnails.forEach((t) => t.classList.remove("active"));
          this.classList.add("active");
        });
      });
    }
  };

  // Color Selection
  const setupColorOptions = () => {
    const mainImage = document.getElementById("main-product-image");
    const colorOptions = document.querySelectorAll(".color-option");
    const thumbnails = document.querySelectorAll(".thumbnail");

    if (colorOptions.length) {
      colorOptions.forEach((option) => {
        option.addEventListener("click", function () {
          // Update active color
          colorOptions.forEach((o) => o.classList.remove("active"));
          this.classList.add("active");

          // Change main image based on color with animation
          const colorImage = this.getAttribute("data-image");
          mainImage.style.opacity = "0";
          setTimeout(() => {
            mainImage.src = colorImage;
            mainImage.style.opacity = "1";
          }, 200);

          // Update thumbnails to show active color
          thumbnails.forEach((thumb) => {
            if (thumb.getAttribute("data-image") === colorImage) {
              thumb.classList.add("active");
            } else {
              thumb.classList.remove("active");
            }
          });
        });
      });
    }
  };

  // Size Selection
  const setupSizeOptions = () => {
    const sizeOptions = document.querySelectorAll(".size-option");

    if (sizeOptions.length) {
      sizeOptions.forEach((option) => {
        option.addEventListener("click", function () {
          sizeOptions.forEach((o) => o.classList.remove("active"));
          this.classList.add("active");
        });
      });
    }
  };

  // Quantity Selector
  const setupQuantitySelector = () => {
    const quantityInput = document.querySelector(".quantity-input input");
    const decreaseBtn = document.querySelector(".quantity-btn.decrease");
    const increaseBtn = document.querySelector(".quantity-btn.increase");

    if (quantityInput && decreaseBtn && increaseBtn) {
      decreaseBtn.addEventListener("click", function () {
        if (parseInt(quantityInput.value) > 1) {
          quantityInput.value = parseInt(quantityInput.value) - 1;
        }
      });

      increaseBtn.addEventListener("click", function () {
        if (
          parseInt(quantityInput.value) <
          parseInt(quantityInput.getAttribute("max") || 10)
        ) {
          quantityInput.value = parseInt(quantityInput.value) + 1;
        }
      });
    }
  };

  // Add to Cart Animation
  const setupAddToCartButton = () => {
    const addToCartBtn = document.querySelector(".btn-add-cart");

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", function () {
        this.classList.add("added");

        setTimeout(() => {
          this.classList.remove("added");
          // Update cart count (would connect to cart functionality)
          const cartCount = document.querySelector(".cart-count");
          if (cartCount) {
            cartCount.textContent = parseInt(cartCount.textContent) + 1;
          }

          // Show confirmation message
          const confirmationMsg = document.createElement("div");
          confirmationMsg.className = "cart-confirmation";
          confirmationMsg.innerHTML =
            '<i class="fas fa-check-circle"></i> Successfully added to cart!';
          document.body.appendChild(confirmationMsg);

          setTimeout(() => {
            confirmationMsg.classList.add("show");
          }, 10);

          setTimeout(() => {
            confirmationMsg.classList.remove("show");
            setTimeout(() => {
              document.body.removeChild(confirmationMsg);
            }, 300);
          }, 2000);
        }, 300);
      });
    }
  };

  // Wishlist Button Toggle
  const setupWishlistButton = () => {
    const wishlistBtn = document.querySelector(".btn-wishlist");

    if (wishlistBtn) {
      wishlistBtn.addEventListener("click", function () {
        this.classList.toggle("active");
        const icon = this.querySelector("i");
        if (this.classList.contains("active")) {
          icon.className = "fas fa-heart";
        } else {
          icon.className = "far fa-heart";
        }
      });
    }
  };

  // Scroll Animations
  const setupScrollAnimations = () => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll");

      elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;

        if (elementPosition < screenHeight * 0.85) {
          element.classList.add("visible");
          const animation = element.getAttribute("data-animation");
          if (animation) {
            element.style.animationName = animation;
          }

          const delay = element.getAttribute("data-delay");
          if (delay) {
            element.style.animationDelay = delay;
          }
        }
      });
    };

    // Run on load
    animateOnScroll();

    // Run on scroll
    window.addEventListener("scroll", animateOnScroll);
  };

  // Image Zoom Effect
  const setupImageZoom = () => {
    const mainImage = document.querySelector(".main-image");
    const img = mainImage ? mainImage.querySelector("img") : null;

    if (mainImage && img) {
      mainImage.addEventListener("mousemove", function (e) {
        // Calculate mouse position relative to the container
        const { left, top, width, height } = this.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        // Move the image based on mouse position for zoom effect
        img.style.transformOrigin = `${x}% ${y}%`;
      });

      mainImage.addEventListener("mouseenter", function () {
        img.style.transform = "scale(1.5)";
      });

      mainImage.addEventListener("mouseleave", function () {
        img.style.transform = "scale(1)";
      });
    }
  };

  // Back to Top Button
  const setupBackToTop = () => {
    const scrollProgressBar = document.querySelector(".scroll-progress-bar");
    const backToTopButton = document.querySelector(".back-to-top");

    if (scrollProgressBar && backToTopButton) {
      window.addEventListener("scroll", function () {
        // Update scroll progress bar
        const scrollPercentage =
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
          100;
        scrollProgressBar.style.width = scrollPercentage + "%";

        // Show or hide back to top button
        if (window.scrollY > 300) {
          backToTopButton.classList.add("visible");
        } else {
          backToTopButton.classList.remove("visible");
        }
      });

      backToTopButton.addEventListener("click", function () {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }
  };

  // Initialize all functionality
  const initProductDetails = () => {
    setupProductGallery();
    setupColorOptions();
    setupSizeOptions();
    setupQuantitySelector();
    setupAddToCartButton();
    setupWishlistButton();
    setupScrollAnimations();
    setupImageZoom();
    setupBackToTop();
  };

  // Run initialization
  initProductDetails();
});
