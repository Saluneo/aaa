// 创建浮动爱心
function createFloatingHeart() {
    const hearts = ['❤️', '💕', '💖', '💗', '💓'];
    const container = document.getElementById('floatingHearts');
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    container.appendChild(heart);

    // 动画结束后移除元素
    heart.addEventListener('animationend', () => {
        heart.remove();
    });
}

// 定期创建新的浮动爱心
setInterval(createFloatingHeart, 3000);

// 鼠标移动时创建跟随爱心
let lastHeartTime = 0;
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastHeartTime > 100) { // 限制创建频率
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = '💝';
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        document.getElementById('floatingHearts').appendChild(heart);
        lastHeartTime = now;
    }
}); 