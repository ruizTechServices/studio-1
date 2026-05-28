export function renderHomeStatus(target) {
  if (!target) {
    return;
  }

  target.innerHTML = `
    <div class="home-status-panel">
      <h2>Current Studio Status</h2>
      <ul>
        <li>Repo intake lives on <code>files.html</code>.</li>
        <li>Home lives on <code>/</code>.</li>
        <li>Dashboard lives on <code>dashboard.html</code>.</li>
        <li>Next major feature: <strong>Project Map v1</strong>.</li>
      </ul>
    </div>
  `;
}