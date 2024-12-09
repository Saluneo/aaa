// 主题设置和加载
function loadTheme() {
    // 加载主题颜色
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
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
        
        const theme = themes[savedTheme];
        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--secondary-color', theme.secondary);
        document.documentElement.style.setProperty('--accent-color', theme.accent);
    }

    // 加载字体设置
    const savedFont = localStorage.getItem('fontFamily');
    if (savedFont) {
        document.body.style.fontFamily = savedFont;
    }

    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        document.body.style.fontSize = savedFontSize + 'px';
    }

    // 加载动画设置
    const animationsEnabled = localStorage.getItem('animationsEnabled');
    if (animationsEnabled !== null) {
        document.body.classList.toggle('disable-animations', !JSON.parse(animationsEnabled));
    }
}

// 页面加载时应用主题
document.addEventListener('DOMContentLoaded', loadTheme); 