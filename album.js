// 存储当前查看的相册ID
let currentAlbumId = null;

// 初始化相册数据
function initializeAlbums() {
    if (!localStorage.getItem('albums')) {
        localStorage.setItem('albums', JSON.stringify([]));
    }
    displayAlbums();
}

// 显示所有相册
function displayAlbums() {
    const albums = JSON.parse(localStorage.getItem('albums') || '[]');
    const container = document.getElementById('albumsContainer');
    
    container.innerHTML = albums.map(album => `
        <div class="album-card" onclick="openAlbum('${album.id}')">
            <img src="${album.coverImage}" alt="${album.name}" class="album-cover">
            <div class="album-info">
                <h3 class="album-title">${album.name}</h3>
                <div class="album-date">${album.date}</div>
                <p class="album-description">${album.description}</p>
            </div>
        </div>
    `).join('');
}

// 创建相册
document.getElementById('createAlbum').addEventListener('click', () => {
    document.getElementById('albumModal').style.display = 'block';
});

// 关闭模态框
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

// 点击模态框外部关闭
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// 相册封面预览
document.getElementById('albumCover').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('albumCover').dataset.preview = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// 保存相册
document.getElementById('saveAlbum').addEventListener('click', () => {
    const name = document.getElementById('albumName').value;
    const date = document.getElementById('albumDate').value;
    const description = document.getElementById('albumDescription').value;
    const coverImage = document.getElementById('albumCover').dataset.preview || 'default-album-cover.jpg';

    if (!name || !date) {
        alert('请填写相册名称和日期！');
        return;
    }

    const album = {
        id: Date.now().toString(),
        name,
        date,
        description,
        coverImage,
        photos: []
    };

    const albums = JSON.parse(localStorage.getItem('albums') || '[]');
    albums.push(album);
    localStorage.setItem('albums', JSON.stringify(albums));

    // 清空表单
    document.getElementById('albumName').value = '';
    document.getElementById('albumDate').value = '';
    document.getElementById('albumDescription').value = '';
    document.getElementById('albumCover').value = '';
    delete document.getElementById('albumCover').dataset.preview;

    // 关闭模态框并刷新显示
    document.getElementById('albumModal').style.display = 'none';
    displayAlbums();
});

// 打开相册
function openAlbum(albumId) {
    currentAlbumId = albumId;
    const albums = JSON.parse(localStorage.getItem('albums') || '[]');
    const album = albums.find(a => a.id === albumId);

    if (album) {
        document.getElementById('viewAlbumName').textContent = album.name;
        document.getElementById('viewAlbumDate').textContent = album.date;
        document.getElementById('viewAlbumDescription').textContent = album.description;

        // 显示相册照片
        displayAlbumPhotos(album.photos);

        document.getElementById('viewAlbumModal').style.display = 'block';
    }
}

// 显示相册照片
function displayAlbumPhotos(photos) {
    const container = document.getElementById('albumPhotos');
    const uploadArea = container.querySelector('.photo-upload-area');
    
    // 清空现有照片，保留上传区域
    container.innerHTML = '';
    container.appendChild(uploadArea);

    // 添加所有照片
    photos.forEach((photo, index) => {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'album-photo';
        photoDiv.innerHTML = `
            <img src="${photo}" alt="相册照片">
            <button class="photo-delete" onclick="deletePhoto(${index})">×</button>
        `;
        container.appendChild(photoDiv);
    });
}

// 上传照片
document.getElementById('photoUpload').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    const albums = JSON.parse(localStorage.getItem('albums') || '[]');
    const albumIndex = albums.findIndex(a => a.id === currentAlbumId);

    if (albumIndex === -1) return;

    const processFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    };

    Promise.all(files.map(processFile)).then(photos => {
        albums[albumIndex].photos.push(...photos);
        localStorage.setItem('albums', JSON.stringify(albums));
        displayAlbumPhotos(albums[albumIndex].photos);
    });
});

// 删除照片
function deletePhoto(index) {
    const albums = JSON.parse(localStorage.getItem('albums') || '[]');
    const albumIndex = albums.findIndex(a => a.id === currentAlbumId);

    if (albumIndex === -1) return;

    albums[albumIndex].photos.splice(index, 1);
    localStorage.setItem('albums', JSON.stringify(albums));
    displayAlbumPhotos(albums[albumIndex].photos);
}

// 搜索相册
document.getElementById('searchAlbum').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const albums = JSON.parse(localStorage.getItem('albums') || '[]');
    
    const filteredAlbums = albums.filter(album => 
        album.name.toLowerCase().includes(searchTerm) ||
        album.description.toLowerCase().includes(searchTerm)
    );

    const container = document.getElementById('albumsContainer');
    container.innerHTML = filteredAlbums.map(album => `
        <div class="album-card" onclick="openAlbum('${album.id}')">
            <img src="${album.coverImage}" alt="${album.name}" class="album-cover">
            <div class="album-info">
                <h3 class="album-title">${album.name}</h3>
                <div class="album-date">${album.date}</div>
                <p class="album-description">${album.description}</p>
            </div>
        </div>
    `).join('');
});

// 页面加载时初始化相册
document.addEventListener('DOMContentLoaded', initializeAlbums); 