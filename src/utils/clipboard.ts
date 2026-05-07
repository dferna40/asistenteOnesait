const CLIPBOARD_EVENT_NAME = 'app:clipboard-copy';

interface ClipboardCopyEventDetail {
  message: string;
}

export const copyTextToClipboard = async (
  text: string,
  successMessage = 'Texto copiado.',
) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  window.dispatchEvent(
    new CustomEvent<ClipboardCopyEventDetail>(CLIPBOARD_EVENT_NAME, {
      detail: { message: successMessage },
    }),
  );
};

export const clipboardCopyEventName = CLIPBOARD_EVENT_NAME;
export type { ClipboardCopyEventDetail };
