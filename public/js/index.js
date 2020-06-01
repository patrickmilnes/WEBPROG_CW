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
 * Name of questionnaire.
 */
let name = "";

/**
 * Addes event listener to submit button.
 */
window.onload = function() {
    document.querySelector('#submit-button').addEventListener('click', submitButtonClick);
    document.querySelector('#download-button').addEventListener('click', downloadButtonClick);
    document.querySelector('#dark-mode-button').addEventListener('click', darkModeButtonClick);
}

ws.addEventListener('message', fromServer);

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
 * @param {event} e -> Event
 */
function fromServer(e) {
    const data = JSON.parse(e.data);

    if (Array.isArray(data)) {
        console.log(data);
        downloadJson("results.json", JSON.stringify(data));
    } else {
        console.log(data);
        addToDom(data);
        name = data.questionnaire_json.name;
    }
    
}

/**
 * Creates and downloads json file with results.
 * @param {String} filename 
 * @param {String} text 
 */
function downloadJson(filename, text) {
    let ele = document.createElement('a');
    ele.setAttribute('href', 'data:json/plain;charset=utf-8,' + encodeURIComponent(text));
    ele.setAttribute('download', filename);

    ele.style.display = 'none';
    document.body.appendChild(ele);
    ele.click();
    document.body.removeChild(ele);
}

/**
 * Constructs JSON data into DOM structure. 
 * @param {JSON} data -> JSON data from server.
 */
function addToDom(data) {
    setQuestionnaireTitle(data.questionnaire_json.name);
    let master = document.querySelector('#questionnaire-form');

    for (let i = 0; i < data.questionnaire_json.questions.length; i++) {
        const element = data.questionnaire_json.questions[i];
        
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
    // let button = document.createElement('button');
    // button.textContent = 'Next';
    card.appendChild(input);
    // card.appendChild(button);
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
        input.setAttribute('value', false);
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
    // let button = document.createElement('button');
    // button.textContent = 'Next';
    card.appendChild(input);
    // card.appendChild(button);
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

/**
 * Event handler for click event on the submit button.
 * @param {Event} event 
 */
function submitButtonClick(event) {
    const resultsData = JSON.stringify(collectData());
    console.log(resultsData);
    ws.send(resultsData);
    console.log("SENT");
    document.querySelector('#submit-button').disabled = true;
}

/**
 * Event handler for click event on the download button.
 * @param {Event} event 
 */
function downloadButtonClick(event) {
    ws.send("DOWNLOAD");
}

/**
 * Changes css to dark mode.
 * @param {Event} event 
 */
function darkModeButtonClick(event) {
    console.log("HELLO");
    document.querySelector("body").style.backgroundColor = '#404347';
    let sectionEle = document.querySelectorAll("section");
    document.querySelector("h1").style.color = '#d7d9db';
    let h2Ele = document.querySelectorAll("h2");
    let labelEle = document.querySelectorAll("label");

    h2Ele.forEach(element => {
        element.style.color = '#d7d9db';
    });

    labelEle.forEach(element => {
        element.style.color = '#d7d9db';
    });

    sectionEle.forEach(element => {
        element.style.borderColor = '#d7d9db';
    });
}

/**
 * Collects data from questionnaure.
 */
function collectData() {
    const root = document.querySelector('#questionnaire-form');

    let results = [];

    for (let i = 0; i < root.childNodes.length; i++) {
        if (questionsDict[i].type == "multi-select") {
            results.push(collectFromMultiSelect(i))
        } else {
            const section = root.childNodes[i];
            const answer = section.childNodes[1];
            results.push(answer.value);
        }

    }
    const resultsObj = createResultsObject(name, results);
    console.log(resultsObj);
    return resultsObj;
}

/**
 * Collects answers from multi-select question.
 * @param {Int} id -> Id of DOM element.
 */
function collectFromMultiSelect(id) {
    const root = document.querySelector('#question-' + id);
    const optionNodes = root.childNodes[1];
    let options = [];

    for (let i = 0; i < optionNodes.childNodes.length; i++) {
        const element = optionNodes.childNodes[i];
        if (element.childNodes[0].checked == true) {
            options.push(true);
        } else {
            options.push(false);
        }
    }
    return options;
}

/**
 * Creates object from questionnaire name and results array.
 * @param {String} name -> Name of questionnaire.
 * @param {Array} results -> Array of results.
 */
function createResultsObject(name, results) {
    const resultsObj = {
        name: name + " Results",
        results: results
    }
    return resultsObj;
}