document.addEventListener('DOMContentLoaded', () => { 
  const copyButton = document.getElementById('copyButton'); 
  const linkInput = document.getElementById('link'); 
  const feedback = document.getElementById('copyFeedback'); 
 
  if (!copyButton || !linkInput || !feedback) { 
    showNotification('❌ Invite UI not found.'); 
    return; 
  } 
 
  // بررسی وجود userId در لوکال 
  const userId = localStorage.getItem('userId'); 
  if (!userId) { 
    showNotification('⚠️ Please log in first'); 
    return; 
  } 
 
  const inviteLink = `https://t.me/Daimonium_bot?start=${encodeURIComponent(userId)}`; 
  linkInput.value = inviteLink; 
 
  async function copyAndShare() { 
    if (!inviteLink) { 
      showNotification('❌ No link available to copy.'); 
      return; 
    } 
 
    copyButton.disabled = true; 
 
    try { 
      if (navigator.clipboard && navigator.clipboard.writeText) { 
        await navigator.clipboard.writeText(inviteLink); 
      } else { 
        linkInput.select(); 
        const copied = document.execCommand('copy'); 
        if (!copied) throw new Error('Fallback copy failed'); 
      } 
 
      feedback.textContent = '✅ Link copied!'; 
      feedback.classList.add('visible'); 
 
      // باز کردن صفحه اشتراک‌گذاری تلگرام 
      const shareText = 'Join the Coin Collection Game!'; 
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`; 
      window.open(shareUrl, '_blank'); 
    } catch (err) { 
      console.error('Copy failed:', err); 
      showNotification('❌ Failed to copy the link. Try manually.'); 
    } 
 
    setTimeout(() => { 
      feedback.classList.remove('visible'); 
      copyButton.disabled = false; 
    }, 2000); 
  } 
 
  copyButton.addEventListener('click', copyAndShare); 
});
