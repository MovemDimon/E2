document.addEventListener('DOMContentLoaded', () => {
  const copyButton = document.getElementById('copyButton');
  const linkInput = document.getElementById('link');
  const feedback = document.getElementById('copyFeedback');

  const userId = localStorage.getItem('userId') || 'guest';
  const inviteLink = `https://t.me/Daimonium_bot?start=${encodeURIComponent(userId)}`;
  linkInput.value = inviteLink;

  async function copyAndShare() {
    copyButton.disabled = true;

    try {
      await navigator.clipboard.writeText(inviteLink);
    } catch {
      linkInput.select();
      document.execCommand('copy');
    }

    feedback.textContent = '✅ Link copied!';
    feedback.classList.add('visible');

    const shareText = 'Join this awesome Telegram mini-app using my link!';
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, '_blank');

    setTimeout(() => {
      feedback.classList.remove('visible');
      copyButton.disabled = false;
    }, 2000);
  }

  copyButton.addEventListener('click', copyAndShare);
});
