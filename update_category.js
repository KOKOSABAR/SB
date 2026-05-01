const fs = require('fs');
const appJsPath = 'app.js';

let appJs = fs.readFileSync(appJsPath, 'utf8');

const targetStart = "const SLOT_GAMES_DATA = ";
const targetEnd = "let predictionInitialized = false;";

const startIndex = appJs.indexOf(targetStart);
const endIndex = appJs.indexOf(targetEnd);

if (startIndex !== -1 && endIndex !== -1) {
    let jsonStr = appJs.slice(startIndex + targetStart.length, endIndex);
    const lastBracketMatch = jsonStr.lastIndexOf('];');
    if (lastBracketMatch !== -1) {
        jsonStr = jsonStr.slice(0, lastBracketMatch + 1);
    }
    
    let gamesArray;
    try {
        gamesArray = JSON.parse(jsonStr);
    } catch (e) {
        console.error("Parse error", e);
        process.exit(1);
    }

    gamesArray.forEach(game => {
        if (game.provider === 'Pragmatic Play') {
            game.tanggal = 'Pragmatic Play';
        }
    });

    const newJsonStr = JSON.stringify(gamesArray, null, 4) + ';\n\n';
    
    const newAppJs = appJs.slice(0, startIndex + targetStart.length) + newJsonStr + appJs.slice(endIndex);
    fs.writeFileSync(appJsPath, newAppJs, 'utf8');
    console.log('Successfully converted Pragmatic Play category!');
} else {
    console.error('Could not find markers');
}
