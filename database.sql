DROP TABLE IF EXISTS questionnaire;
DROP TABLE IF EXISTS results;

create table questionnaire (
  questionnaire_id serial primary key,
  questionnaire_name varchar(50) not null,
  questionnaire_json json not null
);

create table results (
  results_id serial primary key,
  questionnaire_id serial references questionnaire(questionnaire_id),
  results_json json not null
);

insert into questionnaire (questionnaire_name, questionnaire_json)
values ('Example Questionnaire', 
'{
  "name": "Example Questionnaire",
  "questions": [
    {
      "id": "name",
      "text": "What is your name?",
      "type": "text"
    },
    {
      "id": "quest",
      "text": "What is your quest?",
      "type": "text"
    },
    {
      "id": "col",
      "text": "What is your favourite colour?",
      "type": "text"
    },
    {
      "id": "velo",
      "text": "What is the air-speed velocity of an unladen swallow?",
      "type": "number"
    },
    {
      "id": "lord",
      "text": "Which is the best lord?",
      "type": "single-select",
      "options": [
        "Lord of the Rings",
        "Lord of the Flies",
        "Lord of the Dance",
        "Lorde"
      ]
    },
    {
      "id": "langs",
      "text": "Which computer languages have you used?",
      "type": "multi-select",
      "options": [
        "JavaScript",
        "Java",
        "C",
        "Python",
        "Ook",
        "LISP"
      ]
    }
  ]
}');