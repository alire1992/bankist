"use strict";

///////////////////////////////////////
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const allSections = document.querySelectorAll(".section");
const imgTargets = document.querySelectorAll("img[data-src]");
const slides = document.querySelectorAll(".slide");
const sliderBtnLeft = document.querySelector(".slider__btn--left");
const sliderBtnRight = document.querySelector(".slider__btn--right");
const dotsContainer = document.querySelector(".dots");

// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => {
  btn.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// Button scrolling
btnScrollTo.addEventListener("click", function () {
  // old way
  // const sec1cord = section1.getBoundingClientRect();
  // window.scrollTo({
  //   top: sec1cord.top + scrollY,
  //   left: sec1cord.left + scrollX,
  //   behavior: "smooth",
  // });

  // modern way
  section1.scrollIntoView({ behavior: "smooth" });
});

// Page navigation
// Not efficient!!!
// document.querySelectorAll(".nav__link").forEach((el) => {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     console.log(this);
//     const id = this.getAttribute("href");
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

// Delegation
document.querySelector(".nav__links").addEventListener("click", function (e) {
  if (e.target.classList.contains("nav__link")) {
    e.preventDefault();
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// Tabed components
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");
  if (!clicked) return;
  if (clicked.classList.contains("operations__tab")) {
    tabs.forEach((tab) => {
      tab.classList.remove("operations__tab--active");
      if (tab.classList.contains(`operations__tab--${clicked.dataset.tab}`)) {
        tab.classList.add("operations__tab--active");
      }
    });
    tabsContent.forEach((tabContent) => {
      tabContent.classList.remove("operations__content--active");
      if (
        tabContent.classList.contains(
          `operations__content--${clicked.dataset.tab}`
        )
      ) {
        tabContent.classList.add("operations__content--active");
      }
    });
  }
});

// Menu fade animation
function handleHover(e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = this;
        logo.style.opacity = this;
      }
    });
  }
}

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));
// Sticky navigation
// Old way not efficient
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener("scroll", function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// });

// New way: Intersection Observer api
// practice
// function obsCallback(entries, observer) {
//   console.log(entries);
//   console.log(observer);
//   entries.forEach((entry) => {
//     console.log(entry);
//   });
// }

// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height;

function stickyNav(entries) {
  const [entery] = entries;

  if (!entery.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal sections
function revealSections(entries, observer) {
  const [entery] = entries;
  // console.log(entery.target);
  if (!entery.isIntersecting) return;

  entery.target.classList.remove("section--hidden");
  observer.unobserve(entery.target);
}

const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// Lazy loading images
function loaImage(entries, observer) {
  const [entery] = entries;

  if (!entery.isIntersecting) return;

  entery.target.src = entery.target.dataset.src;
  entery.target.addEventListener("load", function () {
    entery.target.classList.remove("lazy-img");
  });

  observer.unobserve(entery.target);
}

const imgObserver = new IntersectionObserver(loaImage, {
  root: null,
  threshold: 0,
  rootMargin: "100px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

// Slider
function slider() {
  let curSlide = 0;

  function createDots() {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  }

  function activateDot(slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  }

  function goToSlide(slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${(i - slide) * 100}%)`;
    });
  }

  // Previous Slide
  function prevSlide() {
    if (curSlide === 0) {
      curSlide = slides.length - 1;
    } else curSlide--;

    goToSlide(curSlide);
    activateDot(curSlide);
  }

  // Next slide
  function nextSlide() {
    if (curSlide === slides.length - 1) {
      curSlide = 0;
    } else curSlide++;

    goToSlide(curSlide);
    activateDot(curSlide);
  }

  function init() {
    createDots();
    goToSlide(0);
    activateDot(0);
  }

  init();

  sliderBtnLeft.addEventListener("click", prevSlide);
  sliderBtnRight.addEventListener("click", nextSlide);

  document.addEventListener("keydown", function (e) {
    e.key === "ArrowLeft" && prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotsContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
}

slider();
