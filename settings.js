// 主题设置和颜色映射
const themes = {
    pink: {
        primary: '#FF69B4',
        secondary: '#FFF0F5',
        accent: '#FF1493'
    },
    blue: {
        primary: '#87CEEB',
        secondary: '#F0F8FF',
        accent: '#4169E1'
    },
    purple: {
        primary: '#DDA0DD',
        secondary: '#F8F4FF',
        accent: '#9370DB'
    },
    green: {
        primary: '#98FB98',
        secondary: '#F0FFF0',
        accent: '#32CD32'
    }
};

// 主题切换
document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        document.documentElement.style.setProperty('--primary-color', themes[theme].primary);
        document.documentElement.style.setProperty('--secondary-color', themes[theme].secondary);
        document.documentElement.style.setProperty('--accent-color', themes[theme].accent);
        
        // 保存主题设置
        localStorage.setItem('theme', theme);
        
        // 更新活动状态
        document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        // 触发主题更改事件
        const themeEvent = new CustomEvent('themeChange', { detail: theme });
        document.dispatchEvent(themeEvent);
    });
});

// 背景音乐控制
let audio = null;

document.getElementById('musicSelect').addEventListener('change', function() {
    if (audio) {
        audio.pause();
    }
    if (this.value) {
        audio = new Audio(this.value);
        audio.volume = document.getElementById('volumeControl').value / 100;
        localStorage.setItem('selectedMusic', this.value);
    }
});

document.getElementById('playMusic').addEventListener('click', function() {
    if (audio) {
        if (audio.paused) {
            audio.play();
            this.textContent = '暂停';
        } else {
            audio.pause();
            this.textContent = '播放';
        }
    }
});

document.getElementById('volumeControl').addEventListener('input', function() {
    if (audio) {
        audio.volume = this.value / 100;
        localStorage.setItem('volume', this.value);
    }
});

// 字体设置
let fontSize = parseInt(localStorage.getItem('fontSize')) || 16;

document.getElementById('fontFamily').addEventListener('change', function() {
    document.body.style.fontFamily = this.value;
    localStorage.setItem('fontFamily', this.value);
});

document.getElementById('increaseFont').addEventListener('click', () => {
    if (fontSize < 24) {
        fontSize += 2;
        updateFontSize(fontSize);
    }
});

document.getElementById('decreaseFont').addEventListener('click', () => {
    if (fontSize > 12) {
        fontSize -= 2;
        updateFontSize(fontSize);
    }
});

function updateFontSize(size) {
    document.body.style.fontSize = size + 'px';
    localStorage.setItem('fontSize', size);
}

// 动画效果控制
document.getElementById('enableAnimations').addEventListener('change', function() {
    document.body.classList.toggle('disable-animations', !this.checked);
    localStorage.setItem('animationsEnabled', this.checked);
});

// 页面加载时加载保存的设置
window.addEventListener('load', () => {
    // 加载主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.querySelector(`[data-theme="${savedTheme}"]`)?.click();
    }

    // 加载音乐设置
    const savedMusic = localStorage.getItem('selectedMusic');
    if (savedMusic) {
        document.getElementById('musicSelect').value = savedMusic;
    }
    const savedVolume = localStorage.getItem('volume');
    if (savedVolume) {
        document.getElementById('volumeControl').value = savedVolume;
    }

    // 加载字体设置
    const savedFont = localStorage.getItem('fontFamily');
    if (savedFont) {
        document.getElementById('fontFamily').value = savedFont;
        document.body.style.fontFamily = savedFont;
    }

    // 加载字体大小
    if (fontSize) {
        document.body.style.fontSize = fontSize + 'px';
    }

    // 加载动画设置
    const animationsEnabled = localStorage.getItem('animationsEnabled');
    if (animationsEnabled !== null) {
        const enabled = JSON.parse(animationsEnabled);
        document.getElementById('enableAnimations').checked = enabled;
        document.body.classList.toggle('disable-animations', !enabled);
    }
}); 