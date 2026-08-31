const copyButton = document.querySelector("[data-copy-citation]");
const citation = document.querySelector("[data-citation-text]");
const status = document.querySelector("[data-copy-status]");

async function copyCitation() {
  if (!copyButton || !citation) return;

  const text = citation.textContent.trim();
  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = "Citation copied";
    if (status) status.textContent = "Citation copied to the clipboard.";
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(citation);
    selection.removeAllRanges();
    selection.addRange(range);
    copyButton.textContent = "Citation selected";
    if (status) status.textContent = "Citation selected. Use your browser's copy command.";
  }

  window.setTimeout(() => {
    copyButton.textContent = "Copy citation";
  }, 2400);
}

copyButton?.addEventListener("click", copyCitation);
