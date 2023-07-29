const express = require('express');

const app = express();

app.use(express.json());

const tasksList = [];

const port = process.env.PORT || 3000;
const HOST_NAME = "localhost";

app.get('/tasks', function (req, res) {
    if (!(tasksList.length > 0)) {
        res.json({
            message: 'No tasks created!',
            status: 'success'
        })
    } else {
        const sortedList = tasksList.sort((t1, t2) => t2 - t1);
        res.json({
            data: sortedList,
            status: 'success'
        });
    }
});

app.get('/tasks/:id', function (req, res) {
    const taskID = req.params['id'];
    const tasksFound = tasksList.filter(i => i.id === taskID);

    if (tasksFound.length > 0) {
        res.json({
            data: tasksFound,
            status: 'success'
        });
    } else {
        res.send({
            message: 'No Tasks found with id.',
            status: 'warning'
        })
    }
});

app.get('/tasks/:status', function (req, res) {
    const status = req.body['status'];

    if (!status) {
        res.send({
            message: 'Please provide a valid Status value to filter by! ',
            status: 'warning'
        })
    } else {
        const filteredRecords = tasksList.find(i => i.completionStatus === status);
        res.send({
            data: filteredRecords,
            message: `records with  status ${status} fetched successfully`,
            status: 'success'
        });
    }
});

app.get('/tasks/priority/:level', function (req, res) {
    const level = req.body['level'];

    if (!level) {
        res.send({
            message: 'Please provide a valid Level value to filter by! ',
            status: 'warning'
        })
    } else {
        const filteredRecords = tasksList.find(i => i.priority === level);
        res.send({
            data: filteredRecords,
            message: `records with priority level ${level} fetched successfully`,
            status: 'success'
        });
    }
});

app.post('/tasks', function (req, res) {
    const { title, description, completionStatus } = req.body;
    const checkItemExists = tasksList.find(i => i.title === title);
    if (checkItemExists) {
        res.send({
            message: 'A task with same title already exists',
            statusCode: 200,
            status: 'warning'
        })
    } else {
        tasksList.push({ id: String(Math.floor(Math.random() * 1000)), title: title, description: description, completionStatus: completionStatus, creationDate: Date.now() });
        res.json({
            data: tasksList,
            message: 'New Task created successfully!',
            status: 'success',
        })
    }
});

app.put('/tasks/:id', function (req, res) {
    const id = req.params['id'];

    const findTaskToUpdate = tasksList.find(i => i.id === id);

    if (findTaskToUpdate) {
        findTaskToUpdate.title = req.body.title;
        findTaskToUpdate.description = req.body.description;
        findTaskToUpdate.completionStatus = req.body.completionStatus;
        findTaskToUpdate.priority = req.body.priority ?? '';

        res.send({
            data: findTaskToUpdate,
            message: 'Task has been updated successfully!',
            status: 'success'
        })
    } else {
        res.send({
            message: 'No Task with ${id} id has been found.',
            status: 'success'
        })
    }
});

app.delete('/tasks/:id', (req, res) => {
    const id = req.params['id'];
    const itemIndex = tasksList.findIndex(i => i.id === id);
    if (itemIndex !== -1) {
        tasksList.splice(itemIndex, 1);
        res.send({
            message: 'Task has been deleted.',
            status: 'success'
        })
    } else {
        res.send({
            message: 'No Item found with ${id} Id.',
            status: 'warning'
        })
    }
});

app.listen(port, HOST_NAME, () => {
    `Listening on ${port}`;
})

