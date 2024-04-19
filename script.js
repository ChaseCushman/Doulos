const API_URL = 'https://d3ocgwcbslg24v.cloudfront.net';

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
        listItem.textContent = task.taskID;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTask(task.taskId);
        listItem.appendChild(deleteButton);
        taskList.appendChild(listItem);
    });
}

// Function to add a new task to the API
async function addTask(taskID) {
    try {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const response = await fetch(API_URL, {
            method: 'POST',
            //headers: myHeaders,
            body: JSON.stringify({ TableName: 'DoulosDB', Item: { tasks: taskID } })
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
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const response = await fetch(API_URL, {
            method: 'DELETE',
            //headers: myHeaders,
            body: JSON.stringify({ TableName: 'DoulosDB', Key: { tasks: taskId } })
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
