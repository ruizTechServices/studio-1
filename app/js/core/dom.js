export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function qsa(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

export function on(parent, eventName, selector, handler) {
  parent.addEventListener(eventName, (event) => {
    const target = event.target.closest(selector);
    if (target) {
      handler(event, target);
    }
  });
}

export function setHtml(target, html) {
  if (target) {
    target.innerHTML = html;
  }
}
