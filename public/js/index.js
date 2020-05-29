'use strict';

/**
 * Web socket to send to and recieve data from the server.
 */
const ws = new WebSocket("ws://" + window.location.hostname + ":8080/");

/**
 * Contains the questions id and the type of question for collection.
 */
let questionsDict = [];

/**
 * Addes event listener to submit button.
 */
window.onload = function() {
    document.querySelector('#submit-button').addEventListener('click', submitButtonClick);
}

ws.addEventListener('message', fromServer);

/**
 * Prints the contents of the questions dictionary.
 * TESTING
 */
function print() {
    questionsDict.forEach(object =>{
        console.log(object);
    });
}

/**
 * Creates object from DOM id and question type.
 * @param {Int} id -> id of DOM element.
 * @param {String} type -> string defining type of question.
 * @returns {Object} -> Object containing aguments.
 */
function createObj(id, type) {
    let obj = {
        id: id,
        type: type
    };
    return obj;
}

/**
 * Event handler to message from data event.
 * @param {event} e -> Event data
 */
function fromServer(e) {
    const data = JSON.parse(e.data);
    console.log(e.data);
    addToDom(data);
}

/**
 * Constructs JSON data into DOM structure. 
 * @param {JSON} data -> JSON data from server.
 */
function addToDom(data) {
    setQuestionnaireTitle(data.questionnaire.name);
    let master = document.querySelector('#questionnaire-form');

    for (let i = 0; i < data.questionnaire.questions.length; i++) {
        const element = data.questionnaire.questions[i];
        
        if (element.type == 'text') {
            master.appendChild(createTextCard(element, "question-" + i));
            questionsDict.push(createObj(i, element.type));
        } else if (element.type == 'single-select') {
            master.appendChild(createSingleSelectCard(element, "question-" + i));
            questionsDict.push(createObj(i, element.type));
        } else if (element.type == 'multi-select') {
            master.appendChild(createMultiSelectCard(element, "question-" + i));
            questionsDict.push(createObj(i, element.type));
        } else if (element.type == 'number') {
            master.appendChild(createNumCard(element, "question-" + i));
            questionsDict.push(createObj(i, element.type));
        }
    }
}

/**
 * Sets the title at top of page.
 * @param {String} title -> Title of questionnaire.
 */
function setQuestionnaireTitle(title) {
    let master = document.querySelector('#questionnaire-title');
    master.textContent = `Questionnaire - ${title}`;
}

/**
 * Creates DOM structure with text type question.
 * @param {JSON} question -> JSON data of question.
 * @param {Int} id -> DOM id.
 */
function createTextCard(question, id) {
    let card = createSectionWrapper(question.text);
    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', question.id);
    let button = document.createElement('button');
    button.textContent = 'Next';
    card.appendChild(input);
    card.appendChild(button);
    card.setAttribute('id', id);
    return card;
}

/**
 * Creates DOM structure with single select type question.
 * @param {JSON} question -> JSON data of question.
 * @param {Int} id -> DOM id.
 */
function createSingleSelectCard(question, id) {
    let card = createSectionWrapper(question.text);
    card.setAttribute('id', id);
    let select = document.createElement('select');
    select.setAttribute('name', question.id);

    for (let i = 0; i < question.options.length; i++) {
        let op = document.createElement('option');
        if (i == 0) {
            op.setAttribute('value', '0');
            op.textContent = '--CHOOSE AN OPTION--';
            select.appendChild(op);
        } else {
            op.setAttribute('value', i);
            op.textContent = question.options[i];
            select.appendChild(op);
        }
    }
    card.appendChild(select);
    return card;
}

/**
 * Creates DOM structure with multi-select type question.
 * @param {JSON} question -> JSON data of question.
 * @param {Int} id -> DOM id.
 */
function createMultiSelectCard(question, id) {
    let card = createSectionWrapper(question.text);
    card.setAttribute('id', id);
    let wrapper = document.createElement('div');
    wrapper.className = 'multi-select';

    for (let i = 0; i < question.options.length; i++) {
        let input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('name', i);
        let label = document.createElement('label');
        label.setAttribute('for', i);
        label.textContent = " " + question.options[i];
        let optionWrapper = document.createElement('div');
        optionWrapper.appendChild(input);
        optionWrapper.appendChild(label);
        wrapper.appendChild(optionWrapper);
    }
    card.appendChild(wrapper);
    return card;
}

/**
 * Creates DOM structure with number type question.
 * @param {JSON} question -> JSON data of question.
 * @param {Int} id -> DOM id.
 */
function createNumCard(question, id) {
    let card = createSectionWrapper(question.text);
    let input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('name', question.id);
    let button = document.createElement('button');
    button.textContent = 'Next';
    card.appendChild(input);
    card.appendChild(button);
    card.setAttribute('id', id);
    return card;
}

/**
 * Creates DOM strcure with section.
 * @param {String} title -> Title of section.
 */
function createSectionWrapper(title) {
    let questionWrapper = document.createElement('section');
    questionWrapper.className = 'question';
    let questionString = document.createElement('h2');
    questionString.textContent = title;
    questionWrapper.appendChild(questionString);
    return questionWrapper;
}

function submitButtonClick(event) {
    console.log("SUBMIT BUTTON CLICKED");
}

let results = [];

function collectData() {
    for (let i = 0; i < questionsDict.length - 1; i++) {
        //const element = questions[i];
        if (questionsDict[i].type == "text" || questionsDict[i].type == "number" || questionsDict[i].type == "single-select") {
            let element = document.querySelector('#question-' + i);
            console.log(element.childNodes[1].value);
        } else {

        }
    }
}

function collectFromMultiSelect(id) {
    const root = document.querySelector('#question-' + id);

    for (let i = 0; i < root.childNodes.length; i++) {
        const element = root.childNodes[i];
        
    }
}