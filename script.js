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

async function fetchNewsItems(source) {
  const response = await fetch(source, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load news: ${response.status}`);
  }

  const items = await response.json();
  if (!Array.isArray(items)) {
    throw new Error("News feed is not an array");
  }

  return items;
}

function fetchJsonpNewsItems(source) {
  return new Promise((resolve, reject) => {
    const callbackName = `postboxNewsCallback_${Date.now()}_${Math.floor(
      Math.random() * 10000,
    )}`;
    const script = document.createElement("script");

    function cleanup() {
      delete window[callbackName];
      script.remove();
    }

    window[callbackName] = (items) => {
      cleanup();
      resolve(items);
    };

    script.async = true;
    script.src = `${source}${source.includes("?") ? "&" : "?"}callback=${callbackName}`;
    script.onerror = () => {
      cleanup();
      reject(new Error("Failed to load JSONP news feed"));
    };

    document.head.append(script);
  });
}

async function loadNews() {
  if (!newsList) {
    return;
  }

  const source = newsList.dataset.source;
  const sourceFormat = newsList.dataset.sourceFormat;
  const fallbackSource = newsList.dataset.fallbackSource;
  if (!source) {
    return;
  }

  try {
    const items =
      sourceFormat === "jsonp"
        ? await fetchJsonpNewsItems(source)
        : await fetchNewsItems(source);
    if (!Array.isArray(items) || items.length === 0) {
      return;
    }

    newsList.innerHTML = items.map((item) => renderNewsItem(item)).join("");
  } catch (error) {
    if (!fallbackSource || fallbackSource === source) {
      console.error("Failed to render news feed", error);
      return;
    }

    try {
      const fallbackItems = await fetchNewsItems(fallbackSource);
      if (!Array.isArray(fallbackItems) || fallbackItems.length === 0) {
        return;
      }

      newsList.innerHTML = fallbackItems
        .map((item) => renderNewsItem(item))
        .join("");
    } catch (fallbackError) {
      console.error("Failed to render news feed", error);
      console.error("Failed to render fallback news feed", fallbackError);
    }
  }
}

void loadNews();
