// ===== interactions.js =====
// پارالاکس داینامیک
document.addEventListener('mousemove', e => {
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width/2;
    const centerY = rect.top + rect.height/2;
    const sensitivity = 15;
    const rotateX = (e.clientY - centerY) / sensitivity;
    const rotateY = (centerX - e.clientX) / sensitivity;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
});

// انیمیشن اسکرول
const animateOnScroll = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('animate-float');
  });
});
document.querySelectorAll('.task-container').forEach(el =>
  animateOnScroll.observe(el)
);
