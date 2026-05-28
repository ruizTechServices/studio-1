export async function readApiJson(response) {
  const text = await response.text();
  let result = {};

  if (text) {
    try {
      result = JSON.parse(text);
    } catch {
      const routeMissing = text.match(/Cannot\s+(GET|POST|PUT|PATCH|DELETE)\s+([^\s<]+)/i);
      result = {
        error: routeMissing
          ? `Server route unavailable for ${routeMissing[1].toUpperCase()} ${routeMissing[2]}. Restart the Express server and reload.`
          : "Server returned a non-JSON response."
      };
    }
  }

  if (!response.ok) {
    throw new Error(result.error || `Request failed with ${response.status}.`);
  }

  return result;
}

export async function apiGet(url) {
  return readApiJson(await fetch(url));
}

export async function apiPost(url, body) {
  return readApiJson(await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }));
}

export async function apiDelete(url, body) {
  return readApiJson(await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }));
}
