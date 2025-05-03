// Cojs.js (copy link)
export function setupCopy() {
  document.getElementById('copyButton').addEventListener('click', () => {
    const copyText = document.getElementById('link');
    copyText.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
  });
}
