document.addEventListener('DOMContentLoaded', () => {
  // Clean script: single active-nav implementation and other behaviors
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  function updateActiveNav() {
    const scrollY = window.pageYOffset;
    let currentId = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // adjust as needed
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === `#${currentId}`);
    });
  }

  window.addEventListener("scroll", updateActiveNav);
  window.addEventListener("load", updateActiveNav);
  window.addEventListener("resize", updateActiveNav);

  // Blog slider drag-to-scroll and dots (safe guards)
  const slider = document.querySelector(".blog-grid");
  const dots = document.querySelectorAll(".blog-pagination .dot");
  if (slider) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      slider.classList.add("dragging");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    window.addEventListener("mouseup", () => {
      isDown = false;
      slider.classList.remove("dragging");
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.2;
      slider.scrollLeft = scrollLeft - walk;
    });

    if (dots.length) {
      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          const scrollAmount = slider.scrollWidth / dots.length;
          slider.scrollTo({ left: scrollAmount * index, behavior: "smooth" });
          dots.forEach(d => d.classList.remove("active"));
          dot.classList.add("active");
        });
      });

      slider.addEventListener("scroll", () => {
        const index = Math.round(slider.scrollLeft / (slider.scrollWidth / dots.length));
        dots.forEach(d => d.classList.remove("active"));
        if (dots[index]) dots[index].classList.add("active");
      });
    }
  }

  // Scroll-top: ensure button exists, accessible, and works on click/touch/keyboard
  let scrollTopBtn = document.querySelector(".scroll-top");

  if (!scrollTopBtn) {
    scrollTopBtn = document.createElement("button");
    scrollTopBtn.className = "scroll-top";
    scrollTopBtn.type = "button";
    scrollTopBtn.setAttribute("aria-label", "Scroll to top");
    scrollTopBtn.innerHTML = "↑";
    document.body.appendChild(scrollTopBtn);
  }

  function toggleScrollTop() {
    scrollTopBtn.classList.toggle("show", window.scrollY > 300);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    scrollTopBtn.blur();
  }

  window.addEventListener("scroll", toggleScrollTop, { passive: true });
  toggleScrollTop();

  scrollTopBtn.addEventListener("click", scrollToTop);
  scrollTopBtn.addEventListener("touchstart", (e) => { e.preventDefault(); scrollToTop(); }, { passive: false });
  scrollTopBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollToTop();
    }
  });
});

