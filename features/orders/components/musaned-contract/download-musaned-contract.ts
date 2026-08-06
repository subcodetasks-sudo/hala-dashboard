import type { jsPDF } from "jspdf";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

function sanitizeFileName(name: string): string {
  const cleaned = name.replace(/[^\w.\-]+/g, "_").replace(/_+/g, "_");
  return cleaned.replace(/^_+|_+$/g, "") || "musaned-contract";
}

/**
 * Rasterizes each `.musaned-page` into an A4 PDF and triggers a file download.
 * Temporarily clears CSS transforms on ancestors so scale preview does not shrink pages.
 */
export async function downloadMusanedContractPdf(
  elementId: string,
  fileNameBase = "musaned-contract",
): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Download is only available in the browser");
  }

  const source = document.getElementById(elementId);
  if (!source) {
    throw new Error("Contract preview not found");
  }

  const pages = Array.from(
    source.querySelectorAll<HTMLElement>(".musaned-page"),
  );
  if (pages.length === 0) {
    throw new Error("No contract pages found");
  }

  const scaledAncestors: { el: HTMLElement; transform: string }[] = [];
  let ancestor: HTMLElement | null = source;
  while (ancestor) {
    const transform = ancestor.style.transform;
    const computed = window.getComputedStyle(ancestor).transform;
    if (transform || (computed && computed !== "none")) {
      scaledAncestors.push({ el: ancestor, transform });
      ancestor.style.transform = "none";
    }
    ancestor = ancestor.parentElement;
  }

  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    const pdf: jsPDF = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    for (let index = 0; index < pages.length; index += 1) {
      const page = pages[index];
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: page.scrollWidth,
        windowHeight: page.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const ratio = canvas.height / canvas.width;
      const renderHeight = Math.min(A4_WIDTH_MM * ratio, A4_HEIGHT_MM);

      if (index > 0) {
        pdf.addPage();
      }

      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        A4_WIDTH_MM,
        renderHeight,
        undefined,
        "FAST",
      );
    }

    const fileName = `${sanitizeFileName(fileNameBase)}.pdf`;
    pdf.save(fileName);
  } finally {
    for (const { el, transform } of scaledAncestors) {
      el.style.transform = transform;
    }
  }
}
