// Add the express.js framework to handle serving web pages.
let express = require('express');
// Add the fs module (fs stands for filesystem) so we can read our play reading file
let fs = require('fs');

let app = express();

// The character that I'm going to be during the play.
// TODO: Make this an array of characters so I can play multiple parts.
let myCharacter = 'MESSENGER';

let playPath = 'public/plays/much-ado-about-nothing.txt';

// Returns a boolean of whether this line is spoken by the character.
// TODO: This incorrectly returns true when another character says our character's name. Fix.
function isSpokenByCharacter(character, line) {
    return line.includes(character);
}

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

    // Start sending data for the response. This contains the first part of our html.
    response.write('<html><head><meta charset="UTF-8"></head><body><pre>');

    // Add the whole play, line by line, to our response.
    // Any lines spoken by myCharacter will be bold, so they're easier to spot.
    for (let i in playLines) {
        if (isSpokenByCharacter(myCharacter, playLines[i])) {
            response.write(`<b>${playLines[i]}</b>`);
        } else {
            response.write(playLines[i]);
        }
        // We need to add these newlines back in since they were removed by the split('\n\n') call above.
        response.write('\n\n');
    }

    // Send the end of our html and then send our response by calling end().
    response.write('</pre></body></html>');
    response.end();
});

// Start a web server that hosts our play on port 5000 of our computer.
// Access it by navigating to http://localhost:5000 in your browser.
let server = app.listen(5000, function () {
    console.log('Play reading webserver is running..');
});
