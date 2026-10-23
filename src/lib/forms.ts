export type FormValue = string | File | null | undefined;

/** Submit through Netlify Forms when deployed there. A static-host fallback is reported honestly. */
export async function submitNetlifyForm(formName: string, values: Record<string, FormValue>): Promise<boolean> {
  const data = new FormData();
  data.set('form-name', formName);
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== null) data.set(key, value);
  }

  try {
    const response = await fetch('/', { method: 'POST', body: data, headers: { Accept: 'text/plain, text/html' } });
    const responseText = await response.text();
    const normalized = responseText.toLowerCase();
    if (response.ok && !normalized.includes('<!doctype html') && !normalized.includes('<html')) return true;
  } catch {
    // A mailto fallback below prevents a silent loss of the enquiry on unsupported hosts.
  }
  return false;
}

export function openEmailFallback(subject: string, body: string) {
  const url = `mailto:companyflow0@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
}
