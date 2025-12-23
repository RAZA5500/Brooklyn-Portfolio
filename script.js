const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

function setActiveLink() {
  let current = "home";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", setActiveLink);
window.addEventListener("load", setActiveLink);


const slider = document.querySelector(".blog-grid");
const dots = document.querySelectorAll(".blog-pagination .dot");

let isDown = false;
let startX = 0;
let scrollLeft = 0;

/* ======================
   MOUSE DRAG SCROLL
====================== */
slider.addEventListener("mousedown", (e) => {
  isDown = true;
  slider.classList.add("dragging");
  startX = e.pageX;
  scrollLeft = slider.scrollLeft;
});

window.addEventListener("mouseup", () => {
  isDown = false;
  slider.classList.remove("dragging");
});

window.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const walk = (e.pageX - startX) * 1.2;
  slider.scrollLeft = scrollLeft - walk;
});

/* ======================
   DOT CLICK
====================== */
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    const scrollAmount = slider.scrollWidth / dots.length;
    slider.scrollTo({
      left: scrollAmount * index,
      behavior: "smooth"
    });

    dots.forEach(d => d.classList.remove("active"));
    dot.classList.add("active");
  });
});

/* ======================
   DOT ACTIVE ON SCROLL
====================== */
slider.addEventListener("scroll", () => {
  const index = Math.round(
    slider.scrollLeft / (slider.scrollWidth / dots.length)
  );

  dots.forEach(d => d.classList.remove("active"));
  if (dots[index]) dots[index].classList.add("active");
});


const scrollTopBtn = document.querySelector(".scroll-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
