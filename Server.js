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
    console.log(requestedAnimal, "\n")
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


app.get('/animal', log, checkValidInput, isAnimal)

app.get('/random', log, checkValidInput, getRandomNumber)



app.listen(port, () => {
    console.log('Server using port', port)
})