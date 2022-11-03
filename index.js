// Add the express.js framework to handle serving web pages.
let express = require('express');
// Add the fs module (fs stands for filesystem) so we can read our play reading file
let fs = require('fs');

let app = express();

// array of all character names in the play
const characterList = ['don pedro', 'don john', 'claudio', 'benedick', 'leonato', 
'antonio', 'balthasar', 'borachio', 'conrade', 'dogberry', 'verges', 'friar francis'];

const upperCharList = characterList.map(name => name.toUpperCase());


// empty array to add character objects to
let characterStats = [];

// character object constructor
function CharObj(character){
    // input: character name
    // output: nothing (establish skeleton for character object)
        this.name = character.toUpperCase();
        this.lines = 0;
        this.words = 0;
};

// create a list of character objects from the master list of character names
function makeCharList(upperCharList){
    for (let i = 0; i < upperCharList.length; i++){
        characterStats.push(new CharObj(upperCharList[i]))
    };
};

// takes in the actor's assigned characters and returns an array of character objects
function assignChar(assignmentArray){
    const charObjArray = []
    for (let i = 0; i < assignmentArray.length; i++){
        // find the character object in our character stats and add it to our actor's assigned characters
        let character = assignmentArray[i].toUpperCase();
        for (let j = 0; j < characterStats.length; j++){
            if (characterStats[j].name === character) {
                charObjArray.push(characterStats[j]);
            }
        }
    }
    return charObjArray;
}

// Actor constructor to make objects that track each person, their characters, and line counts
function Actor(name, assignmentArray){
    this.actorName = name;
    this.assignedCharacters = assignChar(assignmentArray);
    this.numberOfRoles = assignmentArray.length;
    this.totalLines = total(this.assignedCharacters, 'lines');
    this.totalWords = total(this.assignedCharacters, 'words');
}

// get totals for lines or words from the assigned characters objects
function total(assignedList, counter) {
    let count = 0;
    for (let obj in assignedList) {
        count += assignedList[obj][counter];
    }
    return count;
}



let playPath = 'public/plays/much-ado-about-nothing.txt'
// let playPath = 'public/plays/test.txt'




// Returns a boolean of whether this line is spoken by the character.
// Checks whether the current line is spoken by any of our assigned characters
function isSpokenByCharacter(characterArray, line) {
    for (let character in characterArray){
        if (line.includes(characterArray[character].name)) {
            return true;
        }
    }
    return false;
}

function gatherData(characterArray, line) {
    for (let character in characterArray) {
        if (line.includes(characterArray[character].name)) {
            characterArray[character].lines += 1;
            const words = line.split(' ');
            characterArray[character].words += words.length;
        }
    }
}


// TODO: fix to actually sort the array. Doesn't work now becaues I don't think sort() can compare object properties
// sort the characterStats list by which character has the most words, highest to lowest
// function sortByWords(list) {
//     const sortedByWords = (list[words].sort());
//     return sortedByWords;
// }

// make array of character objects for stats to be stored in
makeCharList(upperCharList);


// Handle routing for the "/" path of our website, otherwise known as the "root". This is the default route that a user
// goes to when they don't type anything after the website's domain name. For example "google.com" would go to "/" whereas
// "google.com/myRoute" would go to "/myRoute".
app.get('/', function (request, response) {
    // Set the response header. A status code of 200 indicates the request was successful and the "Content-Type" tells
    // the browser what we're sending them in the response. In this case it's an html file.
    response.writeHead(200, { 'Content-Type': 'text/html' });
    
    // Read our play from disk
    let play = fs.readFileSync(playPath, 'utf8');
    
    
    // The play seems to separate each character's lines from the next by two newlines, \n\n.
    // Split on two newlines to get an array with each element being a characters lines.
    let playLines = play.split('\n\n');

    // get data about characters
    for (let i in playLines){
        gatherData(characterStats, playLines[i]);
    }
    characterStats = sortByWords(characterStats);
    
    // Start sending data for the response. This contains the first part of our html.
    response.write('<html><head><meta charset="UTF-8"></head><body><pre>');
    
    // creates rachel object and passes in the actor's name and their roles
    // actor is created after gatherData has been run so it can pull the character data
    const rachel = new Actor('Rachel', ['leonato', 'conrade', 'don john']);

    
    // Add the whole play, line by line, to our response.
    // Any lines spoken by myCharacter will be bold, so they're easier to spot.
    for (let i in playLines) {
        if (isSpokenByCharacter(rachel.assignedCharacters, playLines[i])) {
            response.write(`<b>${playLines[i]}</b>`);
        } else {
            response.write(playLines[i]);
        }
        // We need to add these newlines back in since they were removed by the split('\n\n') call above.
        response.write('\n\n');
    }  
    

    // testing
    console.log('character stats: ', characterStats);
    
    // Log character information for testing
    console.log('Actor object: ', rachel);
    
    // Send the end of our html and then send our response by calling end().
    response.write('</pre></body></html>');
    response.end();
});


// Start a web server that hosts our play on port 5000 of our computer.
// Access it by navigating to http://localhost:5000 in your browser.
let server = app.listen(5000, function () {
    console.log('Play reading webserver is running..');

});
