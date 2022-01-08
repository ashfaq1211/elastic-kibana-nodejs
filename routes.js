const express = require('express');
const router = express.Router();
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    host: 'localhost:9200'
});

const workouts = [
    {
        id: 1,
        type: 'Weights',
        duration: 45,
        date: "07/01/2022"
    },
    {
        id: 2,
        type: 'Run',
        duration: 30,
        date: "08/01/2022"
    }
]

router.use((req, res, next) => {
    console.log(req.method, req.url);

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4201');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    next();
})

// GET all workouts

router.get('/workouts', (req, res) => {
    return res.status(200).send({
        message: 'GET workouts call succeeded',
        workouts: workouts
    });
});

// GET specific workout by id

router.get('/workouts/:id', (req, res) => {
    // let workout = workouts.find(workout => workout.id == req.params.id);
    
    let workout;

    client.get({
        index: 'workout',
        type: 'mytype',
        id: req.params.id
    }, function(err, resp, status) {
        if (err) {
            console.log(err);
        } else {
            workout = resp._source;
            console.log('Found the requested document', resp);
            if (!workout) {
                return res.status(400).send({
                    message: `Workout is not found for id ${req.params.id}`,
                });
            }
            return res.status(200).send({
                message: `GET workout call for id ${req.params.id} succeeded`,
                workout: workout
            });
        }
    });

});

// POST single workout

router.post('/workout', (req, res) => {
    if (!req.body.id) {
        return res.status(400).send({
            message: `Id is required`,
        });
    } else {
        // workouts.push(req.body);
        client.index({
            index: 'workout',
            type: 'mytype',
            id: req.body.id,
            body: req.body
        }, function(err, resp, status) {
            if (err) {
                console.log(err);
            } else {
                return res.status(200).send({
                    message: `POST workout call succeeded`,
                })
            }
        });
    }
})

// PUT single workout

router.put('/workout', (req, res) => {
    if (!req.body.id) {
        return res.status(400).send({
            message: `Id is required`,
        });
    } else {
        const foundIndex = workouts.findIndex(workout => workout.id == req.body.id);
        workouts[foundIndex] = req.body;
        return res.status(200).send({
            message: `PUT workout call for id ${req.body.id} succeeded`,
        });
    }
});

// DELETE specific workout by id

router.delete('/workout/:id', (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({
            message: `Id is required`,
        });
    } else {
        const foundIndex = workouts.findIndex(workout => workout.id == req.params.id);
        workouts.splice(foundIndex);
        return res.status(200).send({
            message: `DELETE workout call for id ${req.params.id} succeeded`,
        });
    }
});


module.exports = router;