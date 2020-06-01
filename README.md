# WEBPROG_CW
## Instal Instructions
```
npm i
npm run setup
npm start
```

## Features
To submit, you simply fill out questionnaire and click the submit button at the bottom of the page.
To download all results, click download button at bottom of page.

## Design
### Communication
I decided to use web sockets as a way to facilitate communication because they are faster than using ajax calls and more reliable. I also gave me an opertunity to learn js web sockets indepth past the lectre we had.
### Looks
I decided to keep the looks simple and clean to provide a professional looking UI that was easy to use. It is also mobile friendly 
### Storage
I used postgres database as my storage. Everytime a responce is submitted it is inserted into the database. I used postgres because it was already installed on our VMs.
### In the Future
In the future I would like to add OAuth through google. So that I can make it viable, the download button would only be visible to admin and results could be more comprehensive.

