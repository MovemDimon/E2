// Cojs.js (copy link)
document.getElementById('copyButton').addEventListener('click', function() {
  var copyText = document.getElementById('link');
  copyText.select();
  document.execCommand('copy');
  alert('Link copied to clipboard!');
});
