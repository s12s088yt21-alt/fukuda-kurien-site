const sections = document.querySelectorAll(".hero-content, .section");
const galleryItems = document.querySelectorAll(".gallery-item[data-lightbox-src]");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxClose = document.querySelector("#lightbox-close");
const instagramUrl = "https://www.instagram.com/fukutakurien?igsh=MXA2ZnRoNXhqczF3MA%3D%3D&utm_source=qr";

document.querySelectorAll('a[href="#instagram"]').forEach((link) => {
  link.setAttribute("href", instagramUrl);
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noreferrer");
});

document.querySelectorAll('a[href="#access"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector("#access");

    if (!target) {
      return;
    }

    event.preventDefault();

    const headerHeight = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--header-h"),
    ) || 0;
    const offset = headerHeight + 28;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
    history.replaceState(null, "", "#access");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.2,
  },
);

sections.forEach((section, index) => {
  section.classList.add("reveal");
  section.style.transitionDelay = `${index * 80}ms`;
  observer.observe(section);
});

function openLightbox(src, alt) {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightboxImage.src = src;
  lightboxImage.alt = alt || "";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  lightboxImage.alt = "";
  document.body.style.overflow = "";
}

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    openLightbox(item.dataset.lightboxSrc, item.dataset.lightboxAlt);
  });

  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(item.dataset.lightboxSrc, item.dataset.lightboxAlt);
    }
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox?.classList.contains("is-open")) {
    closeLightbox();
  }
});
