// کمک: Base64 encode Unicode-safe
function toBase64Unicode(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const copyButton = document.getElementById('copyButton');
  const linkInput   = document.getElementById('link');
  const feedback    = document.getElementById('copyFeedback');

  async function copyAndShare() {
    copyButton.disabled = true;
    const link = linkInput.value;

    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // Fallback for older browsers
      linkInput.select();
      document.execCommand('copy');
    }

    // نمایش بازخورد
    feedback.textContent = '✅ لینک کپی شد!';
    feedback.classList.add('visible');

    // باز کردن Deep Link تلگرام برای اشتراک‌گذاری
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('لینک مینی‌اپ را اینجا ببین!')}`;
    window.open(shareUrl, '_blank');

    // بازگشت دکمه و بازخورد پس از 2 ثانیه
    setTimeout(() => {
      feedback.classList.remove('visible');
      copyButton.disabled = false;
    }, 2000);
  }

  copyButton.addEventListener('click', copyAndShare);
});
