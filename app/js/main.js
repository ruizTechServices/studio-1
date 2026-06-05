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

initMobileNavDrawer();

document.addEventListener("click", (event) => {
  const toastTarget = event.target.closest("[data-toast]");
  if (toastTarget) {
    showToast(toastTarget.dataset.toast);
  }
});

const pageInitializers = {
  home: async () => {
    const { initHomePage } = await import("./features/home/home-controller.js");
    initHomePage();
  },
  
  files: async () => {
    const { initRepoIntakePage } = await import("./features/repo-intake/repo-controller.js");
    initRepoIntakePage();
  },

  dashboard: async () => {
    const { initDashboardPage } = await import("./features/dashboard/dashboard-controller.js");
    initDashboardPage();
  },

  projects: async () => {
    const { initProjectsPage } = await import("./features/projects/projects-controller.js");
    initProjectsPage();
  },

  specs: async () => {
    const { initSpecsPage } = await import("./features/specs/specs-controller.js");
    initSpecsPage();
  },

  agents: async () => {
    const { initAgentsPage } = await import("./features/agents/agents-controller.js");
    initAgentsPage();
  },

  workflows: async () => {
    const { initWorkflowsPage } = await import("./features/workflows/workflows-controller.js");
    initWorkflowsPage();
  },

  memory: async () => {
    const { initMemoryPage } = await import("./features/memory/memory-controller.js");
    initMemoryPage();
  },

  settings: async () => {
    const { initSettingsPage } = await import("./features/settings/settings-controller.js");
    initSettingsPage();
  },
};

const initializePage = pageInitializers[currentPage];

if (initializePage) {
  await initializePage();
}

function initMobileNavDrawer() {
  const shell = document.querySelector(".product-shell");
  const sidebar = document.querySelector("#siteSidebar");
  const toggle = document.querySelector("[data-shell-nav-toggle]");
  const backdrop = document.querySelector("[data-shell-backdrop]");

  if (!shell || !sidebar || !toggle || !backdrop) {
    return;
  }

  const mobileQuery = window.matchMedia("(max-width: 900px)");
  let restoreFocusTo = null;

  const setOpen = (open) => {
    shell.classList.toggle("nav-open", open);
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    backdrop.hidden = !open;

    if (open) {
      restoreFocusTo = document.activeElement;
      const focusTarget = sidebar.querySelector(".nav-item.active") || sidebar.querySelector("a, button");
      focusTarget?.focus({ preventScroll: true });
    } else if (restoreFocusTo instanceof HTMLElement) {
      restoreFocusTo.focus({ preventScroll: true });
      restoreFocusTo = null;
    }
  };

  toggle.addEventListener("click", () => {
    setOpen(!shell.classList.contains("nav-open"));
  });

  backdrop.addEventListener("click", () => {
    setOpen(false);
  });

  sidebar.addEventListener("click", (event) => {
    if (mobileQuery.matches && event.target.closest("a")) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && shell.classList.contains("nav-open")) {
      setOpen(false);
    }
  });

  mobileQuery.addEventListener("change", (event) => {
    if (!event.matches) {
      setOpen(false);
    }
  });
}

// No messy chain of if/else.
