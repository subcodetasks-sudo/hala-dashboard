/** Print / Save-as-PDF helper for the Musaned HTML contract. */

const PRINT_EXTRA_CSS = `
@page { size: A4; margin: 10mm; }
html, body {
  margin: 0 !important;
  padding: 0 !important;
  background: #fff !important;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.musaned-print-root {
  display: flex !important;
  flex-direction: column !important;
  gap: 0 !important;
}
.musaned-page {
  width: 210mm !important;
  min-height: 277mm !important;
  margin: 0 auto !important;
  page-break-after: always;
  break-after: page;
  box-shadow: none !important;
  border: none !important;
}
.musaned-page:last-child {
  page-break-after: auto;
  break-after: auto;
}
`;

function collectParentStyles(): string {
  const chunks: string[] = [];

  for (const node of Array.from(
    document.querySelectorAll('link[rel="stylesheet"], style'),
  )) {
    if (node instanceof HTMLLinkElement && node.href) {
      chunks.push(`<link rel="stylesheet" href="${node.href}" />`);
    } else if (node instanceof HTMLStyleElement) {
      chunks.push(`<style>${node.innerHTML}</style>`);
    }
  }

  chunks.push(`<style>${PRINT_EXTRA_CSS}</style>`);
  return chunks.join("\n");
}

export function printMusanedContract(elementId: string): void {
  if (typeof window === "undefined") return;

  const source = document.getElementById(elementId);
  if (!source) return;

  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", "Musaned contract print");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";
  document.body.appendChild(iframe);

  const frameDoc = iframe.contentDocument ?? iframe.contentWindow?.document;
  if (!frameDoc) {
    document.body.removeChild(iframe);
    return;
  }

  frameDoc.open();
  frameDoc.write(
    `<!DOCTYPE html><html><head><meta charset="utf-8"/>${collectParentStyles()}</head><body>${source.outerHTML}</body></html>`,
  );
  frameDoc.close();

  const cleanup = () => {
    try {
      document.body.removeChild(iframe);
    } catch {
      /* already removed */
    }
  };

  const triggerPrint = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      window.setTimeout(cleanup, 1000);
    }
  };

  // Allow stylesheets + signature images to load before print
  window.setTimeout(triggerPrint, 600);
}
