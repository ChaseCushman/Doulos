const API_URL = 'https://j4cbe0afa0.execute-api.us-east-2.amazonaws.com/dev';

// Function to fetch tasks from API and render them
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.Items) {
            renderTasks(data.Items);
        } else {
            console.error('No tasks found.');
        }
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

// Function to add a new task to the API
async function addTask(taskName) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ TableName: 'DoulosDB', Item: { taskName: taskName } })
        });
        if (!response.ok) {
            throw new Error('Failed to add task');
        }
    } catch (error) {
        throw error;
    }
}

// Function to delete a task
async function deleteTask(taskId) {
    try {
        const response = await fetch(API_URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ TableName: 'DoulosDB', Key: { taskId: taskId } })
        });
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        // Refresh task list after deleting the task
        fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Fetch tasks when the page loads
fetchTasks();
