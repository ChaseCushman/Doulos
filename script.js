const API_URL = 'https://t85uqonty0.execute-api.us-east-2.amazonaws.com/dev';

// Function to fetch tasks from API and render them
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderTasks(data);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Function to render tasks in the UI
function renderTasks(tasks) {
    const taskList = document.getElementById('task-list-items');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.textContent = task.taskName;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTask(task.taskId);
        listItem.appendChild(deleteButton);
        taskList.appendChild(listItem);
    });
}

// Function to add a new task
async function addTask() {
    const taskInput = document.getElementById('task').value;
    if (taskInput.trim() === '') return;
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ taskName: taskInput })
        });
        if (response.ok) {
            fetchTasks(); // Refresh task list
            document.getElementById('task').value = ''; // Clear input field
        } else {
            console.error('Failed to add task');
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

// Function to delete a task
async function deleteTask(taskId) {
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            fetchTasks(); // Refresh task list
        } else {
            console.error('Failed to delete task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Fetch tasks when the page loads
fetchTasks();
