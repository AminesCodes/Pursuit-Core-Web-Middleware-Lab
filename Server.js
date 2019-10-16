const express = require('express');

const app = express();
const port = 3129;

const myCors = (req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    next();
}
app.use(myCors);


let animals = {
    lion: {name: "Lion", number: 5, section: 'A5'},
    tiger: {name: "Tiger", number: 3, section: 'A7'},
    zebra: {name: "Zebra", number: 8, section: 'B2'},
    giraffe: {name: "Giraffe", number: 7, section: 'B3'},
    eagle: {name: "Eagle", number: 2, section: 'D1'},
}

let labQueue = ['xavier', 'michelle', 'corey', 'reed']


const checkValidInput = (request, response, next) => {
    let query = request.query;
    if ((query.animal && query.animal !== "")
        || (query.name && query.name !== "")
        || ((query.floor && !isNaN(parseInt(query.floor)))
        && (query.ceil && !isNaN(parseInt(query.ceil))))) {
            next()
        } else {
            response.json({
                status: "failed", 
                message: "Input error"
            })
        }
}

const isAnimal = (request, response, next) => {
    let requestedAnimal = ((request.query.animal).trim()).toLowerCase();
    if (animals[requestedAnimal]) {
        response.json({
            status: 'success',
            message: true,
            animal: animals[requestedAnimal]
        })
    } else {
        response.json({
            status: 'success',
            message: false,
        })
    }
}

const log = (request, response, next) => {
    console.log("\nURL:", request.url, "\nQUERY:", request.query, '\n')
    next()
}

const checkValidRange = (request, response, next) => {
    let min = Math.floor(request.query.floor);
    let max = Math.floor(request.query.ceil);

    if (max < min) {
        response.json({
            status: "failed", 
            message: "Input error"
        })
    } else {
        next();
    }
}

const getRandomNumber = (request, response, next) => {
    let min = Math.floor(request.query.floor);
    let max = Math.floor(request.query.ceil);
    
    let randomNumber = Math.floor(Math.random() * (max - min + 1))
    randomNumber += min;

    response.json({
        status: "success",
        range: [min, max],
        randPick: randomNumber
    })
}

const checkIfEmptyQueue = (request, response, next) => {
    if (labQueue.length) {
        next()
    } else {
        response.json({
            status: 'failed',
            message: 'Empty Queue'
        })
    }
}

const returnNextName = (request, response, next) => {
    let name = labQueue[0][0].toUpperCase()+labQueue[0].slice(1, labQueue[0].length);
    response.json({
        status: "success",
        data: name
    })
}

const CheckIfAlreadyThere = (request, response, next) => {
    let name = ((request.query.name).trim()).toLowerCase();
    if (labQueue.includes(name)) {
        response.json({
            status: "failed",
            message: "Name exists"
        })
    } else {
        next()
    }
}

const addToTheQueue = (request, response, next) => {
    let name = ((request.query.name).trim()).toLowerCase();
    labQueue.push(name);
    response.json({
        status: "success",
        enqueued: name
    })
    console.log(labQueue)
}

const removeName = (request, response, next) => {
    let name = labQueue.shift();
    response.json({
        status: "success",
        dequeued: name
    })
    console.log(labQueue)
}


app.get('/animal', log, checkValidInput, isAnimal)
app.get('/random', log, checkValidInput, checkValidRange, getRandomNumber)
app.get('/queue/peek', log, checkIfEmptyQueue, returnNextName)
app.post('/queue/enqueue', log, checkValidInput, CheckIfAlreadyThere, addToTheQueue)
app.post('/queue/dequeue', log, checkIfEmptyQueue, removeName)


app.listen(port, () => {
    console.log('Server using port', port)
})