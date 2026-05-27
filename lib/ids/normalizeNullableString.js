export function normalizeNullableString(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return String(value);
}
