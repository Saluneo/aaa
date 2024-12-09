// 全局变量
let heartsContainer = null;
let lastHeartTime = 0;

// 创建摩天轮
function createFerrisWheel() {
    const wheel = document.createElement('div');
    wheel.className = 'ferris-wheel';
    
    const spokeCount = 8;
    const wheelHTML = `
        <div class="wheel-support"></div>
        <div class="wheel-frame">
            <div class="wheel-rim"></div>
            <div class="wheel-center"></div>
            ${Array(spokeCount).fill(0).map((_, i) => {
                const angle = (i * 360) / spokeCount;
                return `
                    <div class="spoke-unit" style="transform: rotate(${angle}deg)">
                        <div class="spoke"></div>
                        <div class="cabin-mount"></div>
                        <div class="cabin-container">
                            <div class="cabin-rod"></div>
                            <div class="cabin"></div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    wheel.innerHTML = wheelHTML;
    document.body.appendChild(wheel);
}

// 创建爱心容器
function createHeartsContainer() {
    if (!heartsContainer) {
        heartsContainer = document.createElement('div');
        heartsContainer.className = 'floating-hearts';
        document.body.appendChild(heartsContainer);
    }
    return heartsContainer;
}

// 创建浮动爱心
function createFloatingHeart() {
    const hearts = ['💘', '💞', '💟']; // 替换为爱心符号
    const container = heartsContainer || createHeartsContainer();
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    container.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove());
}

// 创建烟花
function createFirework(x, y) {
    const colors = [
        '#ff69b4', '#87ceeb', '#dda0dd', '#98fb98', '#ffd700',
        '#ff1493', '#4169e1', '#7fffd4', '#ff4500', '#9370db'
    ];

    // 主烟花
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = x + 'px';
    firework.style.top = y + 'px';
    const mainColor = colors[Math.floor(Math.random() * colors.length)];
    firework.style.backgroundColor = mainColor;
    firework.style.color = mainColor;
    document.body.appendChild(firework);

    // 火花
    const sparkCount = 32;
    for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        spark.style.left = x + 'px';
        spark.style.top = y + 'px';
        
        const sparkColor = colors[Math.floor(Math.random() * colors.length)];
        spark.style.backgroundColor = sparkColor;
        spark.style.color = sparkColor;
        
        const angle = (i * (360 / sparkCount)) * Math.PI / 180;
        const distance = 100 + Math.random() * 80;
        const rotation = Math.random() * 360;
        
        spark.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        spark.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
        spark.style.setProperty('--rotate', rotation + 'deg');
        
        document.body.appendChild(spark);
        spark.addEventListener('animationend', () => spark.remove());
    }

    firework.addEventListener('animationend', () => firework.remove());
}

// 随机生成烟花
function randomFireworks() {
    const maxWidth = window.innerWidth - 100;
    const maxHeight = window.innerHeight / 2;
    const x = 100 + Math.random() * maxWidth;
    const y = Math.random() * maxHeight;
    createFirework(x, y);
}

// 处理鼠标移动
function handleMouseMove(e) {
    const now = Date.now();
    if (now - lastHeartTime > 100) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = 'a'; // 替换为爱心符号
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        heartsContainer.appendChild(heart);
        lastHeartTime = now;
        
        // 同步触发烟花效果
        if (Math.random() < 0.1) { // 10%概率触发烟花
            createFirework(e.clientX, e.clientY);
        }
    }
}

// 处理点击事件
function handleClick(e) {
    // 同时创建爱心和烟花
    createFirework(e.clientX, e.clientY);
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = 'a'; // 替换为爱心符号
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    heartsContainer.appendChild(heart);
}

// 初始化函数
function initialize() {
    createHeartsContainer();
    createFerrisWheel();
    
    // 定期效果
    setInterval(createFloatingHeart, 300);
    setInterval(randomFireworks, 2000);
    
    // 事件监听
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', initialize);