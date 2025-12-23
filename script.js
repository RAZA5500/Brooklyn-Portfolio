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
  if (slider && dots.length) {
    // pointer-based drag (works for mouse & touch)
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    slider.addEventListener("pointerdown", (e) => {
      isDown = true;
      slider.setPointerCapture(e.pointerId);
      slider.classList.add("dragging");
      startX = e.clientX;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("pointerup", (e) => {
      isDown = false;
      try { slider.releasePointerCapture(e.pointerId); } catch (err) {}
      slider.classList.remove("dragging");
    });

    slider.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.clientX;
      const walk = (x - startX) * 1.2;
      slider.scrollLeft = scrollLeft - walk;
    });

    // compute usable scroll range and step per dot
    function scrollRange() {
      return Math.max(0, slider.scrollWidth - slider.clientWidth);
    }

    function stepSize() {
      const range = scrollRange();
      return dots.length > 1 ? range / (dots.length - 1) : range;
    }

    // dot click => scroll to correct position
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        const left = Math.round(stepSize() * index);
        slider.scrollTo({ left, behavior: "smooth" });
        dots.forEach(d => d.classList.remove("active"));
        dot.classList.add("active");
      });
    });

    // update active dot on scroll (requestAnimationFrame for perf)
    let raf = null;
    slider.addEventListener("scroll", () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const range = scrollRange();
        const ratio = range === 0 ? 0 : slider.scrollLeft / range;
        const idx = Math.round(ratio * (dots.length - 1));
        dots.forEach(d => d.classList.remove("active"));
        if (dots[idx]) dots[idx].classList.add("active");
      });
    });

    // keep behaviour correct on resize
    window.addEventListener("resize", () => {
      // recalc active based on new dimensions
      slider.dispatchEvent(new Event("scroll"));
    });

    // initialize active dot
    slider.dispatchEvent(new Event("scroll"));
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

