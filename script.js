// 设置恋爱纪念日期
const startDate = new Date('2023-06-23'); // 请修改为您的恋爱纪念日

// 更新计时器
function updateTimer() {
    const now = new Date();
    const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    document.querySelector('.timer').innerHTML = `
        <div class="time-number">${days}</div>
        <div class="time-label">天</div>
        <div class="time-number">${hours}</div>
        <div class="time-label">小时</div>
    `;
}

// 每秒更新一次计时器
setInterval(updateTimer, 1000);
updateTimer(); // 立即执行一次

// 照片上传功能
document.querySelectorAll('.photo-item').forEach(item => {
    item.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    item.style.backgroundImage = `url(${e.target.result})`;
                    item.style.backgroundSize = 'cover';
                    item.style.backgroundPosition = 'center';
                    item.textContent = '';
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    });
}); 