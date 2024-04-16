const express = require('express');
const AWS = require('aws-sdk');

const app = express();
const port = 3000;

// Configure AWS SDK
AWS.config.update({ region: 'us-east-2' });

// Initialize DynamoDB DocumentClient
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Endpoint to get all tasks
app.get('/tasks', async (req, res) => {
    const params = {
        TableName: 'DoulosDB'
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        res.json(data.Items);
    } catch (error) {
        console.error('Error fetching tasks from DynamoDB:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Endpoint to add a task
app.post('/tasks', async (req, res) => {
    const { taskName } = req.body;

    const params = {
        TableName: 'DoulosDB',
        Item: {
            taskId: Date.now().toString(),
            taskName: taskName
        }
    };

    try {
        await dynamoDB.put(params).promise();
        res.status(201).json({ message: 'Task added successfully' });
    } catch (error) {
        console.error('Error adding task to DynamoDB:', error);
        res.status(500).json({ error: 'Failed to add task' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
