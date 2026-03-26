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

function renderLatestNews(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return renderEmptyNewsState();
  }

  return renderNewsItem(items[0]);
}

function renderEmptyNewsState() {
  return `
    <article class="news-card">
      <p class="news-date">お知らせ準備中</p>
      <h3>最新のお知らせを準備しています</h3>
      <p>開園状況や季節の案内は、整い次第こちらに掲載します。</p>
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

    if (Array.isArray(items) && items.length > 0) {
      newsList.innerHTML = renderLatestNews(items);
      return;
    }

    if (fallbackSource && fallbackSource !== source) {
      const fallbackItems = await fetchNewsItems(fallbackSource);
      if (Array.isArray(fallbackItems) && fallbackItems.length > 0) {
        newsList.innerHTML = renderLatestNews(fallbackItems);
        return;
      }
    }

    newsList.innerHTML = renderEmptyNewsState();
  } catch (error) {
    if (!fallbackSource || fallbackSource === source) {
      console.error("Failed to render news feed", error);
      newsList.innerHTML = renderEmptyNewsState();
      return;
    }

    try {
      const fallbackItems = await fetchNewsItems(fallbackSource);
      if (!Array.isArray(fallbackItems) || fallbackItems.length === 0) {
        newsList.innerHTML = renderEmptyNewsState();
        return;
      }

      newsList.innerHTML = renderLatestNews(fallbackItems);
    } catch (fallbackError) {
      console.error("Failed to render news feed", error);
      console.error("Failed to render fallback news feed", fallbackError);
      newsList.innerHTML = renderEmptyNewsState();
    }
  }
}

void loadNews();
