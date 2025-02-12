const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'messages.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Extract messages (ignoring timestamp)
    const messages = data
        .split('\n') // Split by line
        .map(line => line.replace(/^.*?: /, '').trim())
        .filter(msg => msg.length > 0);

    console.log(messages);
});
