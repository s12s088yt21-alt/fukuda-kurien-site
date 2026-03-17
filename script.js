const sections = document.querySelectorAll(".hero-content, .section");
const newsList = document.querySelector("#news-list");

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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderNewsItem(item) {
  const title = escapeHtml(item.title || "お知らせ");
  const date = escapeHtml(item.publishedAt || item.date || "");
  const body = escapeHtml(item.body || "").replace(/\n/g, "<br>");

  return `
    <article class="news-card">
      <p class="news-date">${date}</p>
      <h3>${title}</h3>
      <p>${body}</p>
    </article>
  `;
}

async function loadNews() {
  if (!newsList) {
    return;
  }

  const source = newsList.dataset.source;
  if (!source) {
    return;
  }

  try {
    const response = await fetch(source, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load news: ${response.status}`);
    }

    const items = await response.json();
    if (!Array.isArray(items) || items.length === 0) {
      return;
    }

    newsList.innerHTML = items.map((item) => renderNewsItem(item)).join("");
  } catch (error) {
    console.error("Failed to render news feed", error);
  }
}

void loadNews();
