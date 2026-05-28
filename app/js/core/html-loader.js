export async function loadHtmlPartials() {
  let includes = Array.from(document.querySelectorAll("[data-include]"));

  while (includes.length > 0) {
    await Promise.all(includes.map(loadSinglePartial));
    includes = Array.from(document.querySelectorAll("[data-include]"));
  }
}

async function loadSinglePartial(element) {
  const partialPath = element.dataset.include;

  if (!partialPath) {
    console.warn("Missing data-include path.", element);
    return;
  }

  try {
    const response = await fetch(partialPath);

    if (!response.ok) {
      throw new Error(`Failed to load ${partialPath}. Status: ${response.status}`);
    }

    const html = await response.text();
    element.outerHTML = html;
  } catch (error) {
    console.error(error);

    element.innerHTML = `
      <div style="padding: 1rem; border: 1px solid red; color: red;">
        Failed to load partial: ${partialPath}
      </div>
    `;
  }
}