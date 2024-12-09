// 设置默认日期为今天
document.getElementById('diaryDate').valueAsDate = new Date();

// 图片上传处理
let uploadedImages = [];

document.getElementById('imageUpload').addEventListener('change', function(e) {
    const files = e.target.files;
    
    for (let file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const imageData = e.target.result;
                uploadedImages.push(imageData);
                displayImagePreview(imageData);
            };
            
            reader.readAsDataURL(file);
        }
    }
});

// 显示图片预览
function displayImagePreview(imageData) {
    const previewArea = document.getElementById('imagePreviewArea');
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-preview';
    
    imageContainer.innerHTML = `
        <img src="${imageData}" alt="预览图片">
        <button class="delete-button" onclick="deleteImage(this)">×</button>
    `;
    
    previewArea.appendChild(imageContainer);
}

// 删除图片
function deleteImage(button) {
    const container = button.parentElement;
    const image = container.querySelector('img');
    const index = uploadedImages.indexOf(image.src);
    
    if (index > -1) {
        uploadedImages.splice(index, 1);
    }
    
    container.remove();
}

// 保存日记
document.getElementById('saveDiary').addEventListener('click', () => {
    const date = document.getElementById('diaryDate').value;
    const mood = document.getElementById('moodSelect').value;
    const title = document.getElementById('diaryTitle').value;
    const content = document.getElementById('diaryContent').value;

    if (!title || !content) {
        alert('标题和内容不能为空！');
        return;
    }

    const diary = {
        date,
        mood,
        title,
        content,
        images: uploadedImages,
        timestamp: new Date().getTime()
    };

    // 获取现有日记
    const diaries = JSON.parse(localStorage.getItem('diaries') || '[]');
    diaries.push(diary);
    
    // 保存到本地存储
    localStorage.setItem('diaries', JSON.stringify(diaries));
    
    // 清空表单和图片
    document.getElementById('diaryTitle').value = '';
    document.getElementById('diaryContent').value = '';
    document.getElementById('imagePreviewArea').innerHTML = '';
    uploadedImages = [];
    
    // 刷新日记列表
    displayDiaries();
    
    alert('日记保存成功！');
});

// 显示日记列表
function displayDiaries() {
    const diaries = JSON.parse(localStorage.getItem('diaries') || '[]');
    const diaryEntries = document.getElementById('diaryEntries');
    
    diaries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    diaryEntries.innerHTML = diaries.map(diary => `
        <div class="diary-entry" onclick="editDiary(${diary.timestamp})">
            <div class="diary-entry-header">
                <span class="diary-entry-title">
                    <span class="diary-entry-mood">${getMoodEmoji(diary.mood)}</span>
                    ${diary.title}
                </span>
                <span class="diary-entry-date">${diary.date}</span>
            </div>
            <div class="diary-entry-preview">${diary.content}</div>
            ${diary.images && diary.images.length > 0 ? `
                <div class="diary-entry-images">
                    ${diary.images.slice(0, 3).map(img => `
                        <img src="${img}" alt="日记图片">
                    `).join('')}
                    ${diary.images.length > 3 ? `<span>+${diary.images.length - 3}</span>` : ''}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// 获取心情表情
function getMoodEmoji(mood) {
    const moodEmojis = {
        'happy': '😊',
        'love': '🥰',
        'sad': '😢',
        'angry': '😡',
        'normal': '😐'
    };
    return moodEmojis[mood] || '😊';
}

// 编辑日记
function editDiary(timestamp) {
    const diaries = JSON.parse(localStorage.getItem('diaries') || '[]');
    const diary = diaries.find(d => d.timestamp === timestamp);
    
    if (diary) {
        document.getElementById('diaryDate').value = diary.date;
        document.getElementById('moodSelect').value = diary.mood;
        document.getElementById('diaryTitle').value = diary.title;
        document.getElementById('diaryContent').value = diary.content;
        
        // 清空并重新显示图片
        document.getElementById('imagePreviewArea').innerHTML = '';
        uploadedImages = diary.images || [];
        uploadedImages.forEach(displayImagePreview);
    }
}

// 页面加载时显示日记列表
displayDiaries(); 