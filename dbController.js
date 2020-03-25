const pouch = require('pouchdb');

class dbController {
    constructor() {
        this.db = new pouch("questions");
        db.info().then(function (info) { console.log(info); });
    }

    async getQuestion() {
        
    }
}