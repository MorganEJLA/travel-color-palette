export function loadFont(googleUrl) {
  const existing = document.querySelector(`link[href="${googleUrl}"]`);
  if (existing) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = googleUrl;
  document.head.appendChild(link);
}
