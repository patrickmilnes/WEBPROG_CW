'use strict';

const ws = new WebSocket("ws://" + window.location.hostname + ":8080/");

function fromServer(e) {
    const data = JSON.parse(e.data);
    console.log(e.data);
    addToDom(data);
}

function addToDom(data) {
    setQuestionnaireTitle(data.questionnaire.name);


    let master = document.querySelector('#list');
    let ele = document.createElement('li');
    ele.textContent = data.questionnaire.name;
    master.appendChild(ele);

    // data.forEach(element => {
    //     let ele = document.createElement('li');
    //     ele.textContent = `Name: ${element.name}\tAge: ${element.age}`
    //     master.appendChild(ele);
    // });
}

function setQuestionnaireTitle(title) {
    let master = document.querySelector('#questionnaire-title');
    master.textContent = `Questionnaire - ${title}`;
}

function createTextCard() {
    
}

ws.addEventListener('message', fromServer);