document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('add-task-form');
    const taskList = document.getElementById('task-list-items');

    // Function to fetch tasks from API and render them
    async function fetchTasks() {
        try {
            const response = await fetch('https://uy5j64sv72.execute-api.us-east-2.amazonaws.com/dev/tasks');
            const data = await response.json();
            renderTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    // Function to render tasks in the UI
    function renderTasks(tasks) {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.textContent = task.taskName;
            taskList.appendChild(listItem);
        });
    }

    // Function to add a new task
    async function addTask(taskName) {
        try {
            const response = await fetch('https://uy5j64sv72.execute-api.us-east-2.amazonaws.com/dev/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ taskName })
            });
            if (response.ok) {
                // If the task was added successfully, fetch and render updated tasks
                fetchTasks();
            } else {
                console.error('Failed to add task');
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    // Event listener for submitting the task form
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const taskInput = document.getElementById('task').value;
        addTask(taskInput);
        document.getElementById('task').value = ''; // Clear input field after adding task
    });

    // Fetch tasks when the page loads
    fetchTasks();
});
