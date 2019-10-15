const baseUrl = "http://localhost:3129/";

document.addEventListener("DOMContentLoaded", () => {
    // FORMS
    let animalForm = document.querySelector("#animalForm");
    let randomNumberForm = document.querySelector("#randomNumberForm");
    // let queueForm = document.querySelector("#queueForm");

    // INPUTS (TEXT & NUMBERS)
    let animalInput = document.querySelector("#animalInput");
    let minNumber = document.querySelector("#minNumber");
    let maxNumber = document.querySelector("#maxNumber");
    let nameInput = document.querySelector("#nameInput");

    // BUTTONS
    let peekBtn = document.querySelector("#peekBtn");
    let enqueueBtn = document.querySelector("#enqueueBtn");
    let dequeueBtn = document.querySelector("#dequeueBtn");

    // PARAGRAPHS FOR DISPLAYING RESPONSES
    let animalResponse = document.querySelector("#animalResponse");
    let randomNumberResponse = document.querySelector("#randomNumberResponse");
    let queueResponse = document.querySelector("#queueResponse");


    animalForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        let animal = animalInput.value;

        try {
            let response = await axios.get(`${baseUrl}animal?animal=${animal}`);
            displayAnimalSearch(animal, animalResponse, response.data);
        } catch (err) {
            animalResponse.innerText = `Network Error:\n${err}`;
        }
    })


    randomNumberForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        let min = minNumber.value;
        let max = maxNumber.value;

        try {
            let response = await axios.get(`${baseUrl}random?floor=${min}&ceil=${max}`);
            displayRandomNumber(randomNumberResponse, response.data);
        } catch (err) {
            randomNumberResponse.innerText = `Network Error:\n${err}`;
        }
    })


    peekBtn.addEventListener("click", async () => {
        try {
            let response = await axios.get(`${baseUrl}queue/peek`);
            displayQueueManagement(queueResponse, response.data);
        } catch (err) {
            queueResponse.innerText = `Network Error:\n${err}`;
        }
    })


    enqueueBtn.addEventListener("click", async () => {
        let name = nameInput.value;

        try {
            let response = await axios.post(`${baseUrl}queue/enqueue?name=${name}`);
            displayQueueManagement(queueResponse, response.data);
        } catch (err) {
            queueResponse.innerText = `Network Error:\n${err}`;
        }
    })


    dequeueBtn.addEventListener("click", async () => {
        try {
            let response = await axios.get(`${baseUrl}queue/dequeue`);
            displayQueueManagement(queueResponse, response.data);
        } catch (err) {
            queueResponse.innerText = `Network Error:\n${err}`;
        }
    })

})
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


const displayAnimalSearch = (input, container, data) => {
    container.innerText = '';
    
    if (data.status === "success") {
        if (data.message) {
            container.innerText = `There is/are ${data.animal.number} ${data.animal.name}(s) \nLocation: ${data.animal.section}`
        } else {
            container.innerText = `Sorry, we don't have any ${input}`
        }
    } else if (data.status === "failed") {
        container.innerText = `Please entre an animal name`
    } else {
        container.innerText = `Something went wrong with your request, please try again later`
    }
}

const displayRandomNumber = (container, data) => {
    container.innerText = '';

    if (data.status === "success") {
        container.innerText = data.randPick;
    } else if (data.status === "failed") {
        container.innerText = `Please entre valid numbers / range`
    } else {
        container.innerText = `Something went wrong with your request, please double check your input(s) and try again or try again later`
    }
}

const displayQueueManagement = (container, data) => {
    container.innerText = '';

    if (data.status === "success") {
        if (data.data) {
            let name = data.data[0].toUpperCase() + data.data.slice(1, data.data.length)
            container.innerText = `The next person on the list is ${name}`
        } else if (data.enqueued) {
            let name = data.enqueued[0].toUpperCase() + data.enqueued.slice(1, data.enqueued.length)
            container.innerText = `${name} has been successfully added to the list`
        } else if (data.dequeued) {
            let name = data.dequeued[0].toUpperCase() + data.dequeued.slice(1, data.dequeued.length)
            container.innerText = `${name} has been successfully removed from the list`
        } else {
            container.innerText = 'Sorry, Something went wrong'
        }
    } else if (data.status === "failed") {
        if (data.message === "Input error") {
            container.innerText = `Please entre a name`
        } else if (data.message === "Empty Queue") {
            container.innerText = `The list is empty`
        } else if (data.message === "Name exists") {
            container.innerText = `Name already exists in the list`
        }
    } else {
        container.innerText = `Something went wrong with your request, please double check your input and try again or try again later`
    }
}