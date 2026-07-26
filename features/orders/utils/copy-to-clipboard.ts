type CopyFeedbackSetters = {
  setCopied: (value: boolean) => void;
  setTooltipOpen: (value: boolean) => void;
};

export async function copyTextWithFeedback(
  text: string,
  { setCopied, setTooltipOpen }: CopyFeedbackSetters,
  resetMs = 1500
): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTooltipOpen(true);
    window.setTimeout(() => {
      setCopied(false);
      setTooltipOpen(false);
    }, resetMs);
  } catch {
    setCopied(false);
  }
}
