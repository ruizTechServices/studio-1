import { loadHtmlPartials } from "./core/html-loader.js";
import { renderIconPlaceholders, icon } from "./core/icons.js";
import { showToast } from "./core/toast.js";
import { navItems } from "./data/nav-items.js";

await loadHtmlPartials();

renderIconPlaceholders();

const currentPage = document.body.dataset.page;

const primaryNav = document.querySelector("#primaryNav");
if (primaryNav) {
  primaryNav.innerHTML = navItems.map((item) => `
    <a class="nav-item ${item.page === currentPage ? "active" : ""}" href="${item.href}" data-nav="${item.label}">
      ${icon(item.icon)}
      <span>${item.label}</span>
    </a>
  `).join("");
}

document.addEventListener("click", (event) => {
  const toastTarget = event.target.closest("[data-toast]");
  if (toastTarget) {
    showToast(toastTarget.dataset.toast);
  }
});

const pageInitializers = {
  files: async () => {
    const { initRepoIntakePage } = await import("./features/repo-intake/repo-controller.js");
    initRepoIntakePage();
  },

  dashboard: async () => {
    const { initDashboardPage } = await import("./features/dashboard/dashboard-controller.js");
    initDashboardPage();
  },
};

const initializePage = pageInitializers[currentPage];

if (initializePage) {
  await initializePage();
}

// Later, if you add pages, you add one entry:

// projects: async () => {
//   const { initProjectsPage } = await import("./features/projects/projects-controller.js");
//   initProjectsPage();
// }

// No messy chain of if/else.