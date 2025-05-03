const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.id = 'starfield';

const ctx = canvas.getContext('2d');

// تغییر اندازه‌ی بوم برای پر کردن صفحه
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const stars = [];
const STAR_COUNT = 200;
const STAR_SPEED = 1;

// ایجاد ستاره‌ها
function createStar() {
    return {
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
        type: Math.random() > 0.5 ? 'cross' : 'dot',
        size: Math.random() * 2 + 1
    };
}

// مقداردهی اولیه ستاره‌ها
for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(createStar());
}

// به‌روزرسانی و رسم ستاره‌ها
function animateStars() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let star of stars) {
        star.z -= STAR_SPEED;
        if (star.z <= 0) {
            Object.assign(star, createStar());
            star.z = canvas.width;
        }

        let x = (star.x / star.z) * canvas.width + canvas.width / 2;
        let y = (star.y / star.z) * canvas.height + canvas.height / 2;
        let opacity = 1 - star.z / canvas.width;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        if (star.type === 'dot') {
            ctx.beginPath();
            ctx.arc(x, y, star.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(x, y, star.size, star.size);
        }
    }

    requestAnimationFrame(animateStars);
}

animateStars();
