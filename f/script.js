// عناصر الصفحة
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const currentDateElement = document.getElementById('current-date');

// عناصر الصوت
const addSound = document.getElementById('add-sound');
const deleteSound = document.getElementById('delete-sound');

// تحميل المهام والتاريخ عند بدء الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    displayCurrentDate();
});

// إضافة مهمة جديدة
taskForm.addEventListener('submit', addTask);

// دالة لإضافة مهمة
function addTask(e) {
    e.preventDefault();

    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const task = { text: taskText, completed: false };
    let tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTask(task, tasks.length - 1);

    // تشغيل صوت الإضافة
    addSound.currentTime = 0;
    addSound.play();

    taskInput.value = '';
}

// دالة لعرض مهمة واحدة مع الأنيميشن
function renderTask(task, index) {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    const taskInfo = document.createElement('div');
    taskInfo.classList.add('task-info');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskStatus(index, li));

    const span = document.createElement('span');
    span.textContent = task.text;

    taskInfo.appendChild(checkbox);
    taskInfo.appendChild(span);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(index, li));

    li.appendChild(taskInfo);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
}

// دالة لعرض جميع المهام
function renderTasks() {
    taskList.innerHTML = '';
    const tasks = getTasksFromLocalStorage();
    tasks.forEach((task, index) => {
        renderTask(task, index);
    });
}

// دالة لتغيير حالة المهمة
function toggleTaskStatus(index, listItem) {
    let tasks = getTasksFromLocalStorage();
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    listItem.classList.toggle('completed');

    // تشغيل صوت الحذف عند وضع علامة كمكتملة
    if (tasks[index].completed) {
        deleteSound.currentTime = 0;
        deleteSound.play();
    }
}

// دالة لحذف مهمة
function deleteTask(index, listItem) {
    let tasks = getTasksFromLocalStorage();
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // إضافة تأثير الأنيميشن للحذف
    listItem.style.animation = 'fadeOut 0.5s forwards';
    // تشغيل صوت الحذف قبل حذف العنصر
    deleteSound.currentTime = 0;
    deleteSound.play();
    
    listItem.addEventListener('animationend', () => {
        renderTasks();
    });
}

// دالة للحصول على المهام من التخزين المحلي
function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// دالة لتحميل المهام عند بدء الصفحة وإزالة المهام المكتملة
function loadTasks() {
    removeCompletedTasks();
    renderTasks();
}

// دالة لإزالة المهام المكتملة
function removeCompletedTasks() {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => !task.completed);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// دالة لعرض التاريخ الحالي
function displayCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const formattedDate = now.toLocaleDateString('ar-EG', options);
    currentDateElement.textContent = formattedDate;
}