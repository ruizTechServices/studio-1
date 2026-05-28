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

if (currentPage === "home") {
  const { initRepoIntakePage } = await import("./features/repo-intake/repo-controller.js");
  initRepoIntakePage();
} else if (currentPage === "dashboard") {
  const { initDashboardPage } = await import("./features/dashboard/dashboard-controller.js");
  initDashboardPage();
}
