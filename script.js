const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

const app = express();
const port = 3000;

// Configure AWS SDK
AWS.config.update({ region: 'us-east-2' });

// Initialize DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json());

// Endpoint to add a task
app.post('/tasks', async (req, res) => {
    const { userId, task } = req.body;

    const params = {
        TableName: 'TaskManager',
        Item: {
            userId: userId,
            taskId: Date.now().toString(), // Generate unique task ID
            taskName: task,
            completed: false
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

// Endpoint to get all tasks for a user
app.get('/tasks/:userId', async (req, res) => {
    const userId = req.params.userId;

    const params = {
        TableName: 'TaskManager',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    };

    try {
        const data = await dynamoDB.query(params).promise();
        res.status(200).json(data.Items);
    } catch (error) {
        console.error('Error getting tasks from DynamoDB:', error);
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
});

// Endpoint to mark a task as completed
app.put('/tasks/:userId/:taskId/complete', async (req, res) => {
    const { userId, taskId } = req.params;

    const params = {
        TableName: 'TaskManager',
        Key: {
            userId: userId,
            taskId: taskId
        },
        UpdateExpression: 'set completed = :completed',
        ExpressionAttributeValues: {
            ':completed': true
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        await dynamoDB.update(params).promise();
        res.status(200).json({ message: 'Task marked as completed' });
    } catch (error) {
        console.error('Error marking task as completed:', error);
        res.status(500).json({ error: 'Failed to mark task as completed' });
    }
});

// Endpoint to delete a task
app.delete('/tasks/:userId/:taskId', async (req, res) => {
    const { userId, taskId } = req.params;

    const params = {
        TableName: 'TaskManager',
        Key: {
            userId: userId,
            taskId: taskId
        }
    };

    try {
        await dynamoDB.delete(params).promise();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
