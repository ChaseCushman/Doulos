// Import necessary AWS SDK modules
const AWS = require('aws-sdk');

// Initialize AWS SDK
AWS.config.update({ region: 'us-east-2' }); 

// Initialize DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Lambda function to handle API requests
exports.handler = async (event) => {
    // Extract user ID from JWT token
    const userId = event.requestContext.authorizer.claims.sub;

    // Parse request body
    const requestBody = JSON.parse(event.body);

    if (requestBody.action === 'addTask') {
        const task = requestBody.task;
        const success = await addTaskToDynamoDB(userId, task);
        if (success) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Task added successfully' })
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Failed to add task' })
            };
        }
    } else if (requestBody.action === 'listTasks') {
        const tasks = await listTasksFromDynamoDB(userId);
        return {
            statusCode: 200,
            body: JSON.stringify(tasks)
        };
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid action' })
        };
    }
};

// Function to add a task to DynamoDB
async function addTaskToDynamoDB(userId, task) {
    const params = {
        TableName: 'DoulosDB', 
        Item: {
            userId: userId,
            taskId: Date.now().toString(), // Generate a unique ID for the task
            taskName: task
        }
    };

    try {
        await dynamoDB.put(params).promise();
        return true;
    } catch (error) {
        console.error('Error adding task to DynamoDB:', error);
        return false;
    }
}

// Function to list tasks from DynamoDB
async function listTasksFromDynamoDB(userId) {
    const params = {
        TableName: 'DoulosDB', 
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    };

    try {
        const data = await dynamoDB.query(params).promise();
        return data.Items;
    } catch (error) {
        console.error('Error listing tasks from DynamoDB:', error);
        return [];
    }
}
