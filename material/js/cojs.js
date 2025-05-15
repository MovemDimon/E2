document.getElementById('copyButton').addEventListener('click', async () => {
  const input = document.getElementById('link');
  try {
    await navigator.clipboard.writeText(input.value);
    alert("✅ لینک کپی شد!");
  } catch {
    alert("❌ کپی نشد، لطفاً دستی کپی کنید.");
  }
});
