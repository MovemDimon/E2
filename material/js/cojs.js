document.getElementById('copyButton').addEventListener('click', async function () {
  const copyText = document.getElementById('link');

  try {
    await navigator.clipboard.writeText(copyText.value);
    alert("Link copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy:", err);
    alert("Copy failed. Please copy manually.");
  }
});
