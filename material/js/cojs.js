document.addEventListener('DOMContentLoaded', () => {
  const copyButton = document.getElementById('copyButton');
  const linkInput = document.getElementById('link');
  const feedback = document.getElementById('copyFeedback');

  // بررسی وجود کاربر
  const userId = localStorage.getItem('userId');
  if (!userId) {
    showNotification('⚠️ لطفاً ابتدا وارد شوید');
    return;
  }

  const inviteLink = `https://t.me/Daimonium_bot?start=${encodeURIComponent(userId)}`;
  linkInput.value = inviteLink;

  async function copyAndShare() {
    if (!copyButton) return;
    copyButton.disabled = true;

    try {
      await navigator.clipboard.writeText(inviteLink);
    } catch {
      linkInput.select();
      document.execCommand('copy');
    }

    feedback.textContent = '✅ لینک کپی شد!';
    feedback.classList.add('visible');

    const shareText = 'به بازی سکه جمع کن بپیوندید!';
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, '_blank');

    setTimeout(() => {
      feedback.classList.remove('visible');
      copyButton.disabled = false;
    }, 2000);
  }

  if (copyButton) copyButton.addEventListener('click', copyAndShare);
});
