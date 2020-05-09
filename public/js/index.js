'use strict';

const ws = new WebSocket("ws://" + window.location.hostname + ":8080/");

function fromServer(e) {
    const data = JSON.parse(e.data);
    console.log(e.data);
    addToDom(data);
}

function addToDom(data) {
    setQuestionnaireTitle(data.questionnaire.name);
    let master = document.querySelector('#questionnaire-form');

    data.questionnaire.questions.forEach(question => {
        // master.appendChild(createTextCard(question));
        if (question.type == 'text') {
            master.appendChild(createTextCard(question));
        } else if (question.type == 'single-select') {
            master.appendChild(createSingleSelectCard(question));
        } else if (question.type == 'multi-select') {
            master.appendChild(createMultiSelectCard(question));
        } else if (question.type == 'number') {
            master.appendChild(createNumCard(question));
        }
    });

    // let master = document.querySelector('#list');
    // let ele = document.createElement('li');
    // ele.textContent = data.questionnaire.name;
    // master.appendChild(ele);

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

function createTextCard(question) {
    let card = createSectionWrapper(question.text);
    let input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('name', question.id);
    let button = document.createElement('button');
    button.textContent = 'Next';
    card.appendChild(input);
    card.appendChild(button);
    return card;
}

function createSingleSelectCard(question) {
    let card = createSectionWrapper(question.text);
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

function createMultiSelectCard(question) {
    let card = createSectionWrapper(question.text);

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

function createNumCard(question) {
    let card = createSectionWrapper(question.text);
    let input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('name', question.id);
    let button = document.createElement('button');
    button.textContent = 'Next';
    card.appendChild(input);
    card.appendChild(button);
    return card;
}

function createSectionWrapper(title) {
    let questionWrapper = document.createElement('section');
    questionWrapper.className = 'question';
    let questionString = document.createElement('h2');
    questionString.textContent = title;
    questionWrapper.appendChild(questionString);
    return questionWrapper;
}

ws.addEventListener('message', fromServer);