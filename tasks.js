// 初始化任务数据
function initializeTasks() {
    if (!localStorage.getItem('tasks')) {
        localStorage.setItem('tasks', JSON.stringify([]));
    }
    displayTasks();
}

// 显示任务列表
function displayTasks(filter = 'all') {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const tasksList = document.getElementById('tasksList');
    
    let filteredTasks = tasks;
    if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    tasksList.innerHTML = filteredTasks.map(task => `
        <div class="task-item ${task.completed ? 'task-completed' : ''}" data-id="${task.id}">
            <input type="checkbox" class="task-checkbox" 
                   ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask('${task.id}')">
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-info">
                    <span class="task-category ${task.category}">${getCategoryName(task.category)}</span>
                    <span class="task-priority">
                        <span class="priority-dot priority-${task.priority}"></span>
                        ${getPriorityName(task.priority)}
                    </span>
                    <span class="task-deadline">📅 ${task.deadline || '无截止日期'}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="task-btn btn-edit" onclick="editTask('${task.id}')">编辑</button>
                <button class="task-btn btn-delete" onclick="deleteTask('${task.id}')">删除</button>
            </div>
        </div>
    `).join('');
}

// 获取分类名称
function getCategoryName(category) {
    const categories = {
        travel: '旅行',
        date: '约会',
        gift: '礼物',
        activity: '活动',
        other: '其他'
    };
    return categories[category] || '其他';
}

// 获取优先级名称
function getPriorityName(priority) {
    const priorities = {
        low: '低优先级',
        medium: '中优先级',
        high: '高优先级'
    };
    return priorities[priority] || '中优先级';
}

// 切换任务完成状态
function toggleTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
    }
}

// 添加任务
document.getElementById('addTaskBtn').addEventListener('click', () => {
    document.getElementById('taskModal').style.display = 'block';
    document.getElementById('taskForm').reset();
});

// 保存任务
document.getElementById('taskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const task = {
        id: Date.now().toString(),
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        deadline: document.getElementById('taskDeadline').value,
        priority: document.getElementById('taskPriority').value,
        category: document.getElementById('taskCategory').value,
        completed: false,
        createdAt: new Date().toISOString()
    };

    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    document.getElementById('taskModal').style.display = 'none';
    displayTasks();
});

// 编辑任务
function editTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskDeadline').value = task.deadline;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskCategory').value = task.category;
        
        const form = document.getElementById('taskForm');
        form.dataset.editId = taskId;
        
        document.getElementById('taskModal').style.display = 'block';
    }
}

// 删除任务
function deleteTask(taskId) {
    if (confirm('确定要删除这个愿望吗？')) {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const filteredTasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(filteredTasks));
        displayTasks();
    }
}

// 筛选任务
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        displayTasks(btn.dataset.filter);
    });
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

// 页面加载时初始化任务
document.addEventListener('DOMContentLoaded', initializeTasks);

// 任务排序功能
function sortTasks(criteria) {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    switch(criteria) {
        case 'deadline':
            tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
            break;
        case 'priority':
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            break;
        case 'created':
            tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

// 添加任务完成动画
function addCompletionAnimation(taskElement) {
    taskElement.classList.add('task-complete-animation');
    setTimeout(() => {
        taskElement.classList.remove('task-complete-animation');
    }, 500);
} 