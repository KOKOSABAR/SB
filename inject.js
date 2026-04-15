const fs = require('fs');
const appJsPath = 'app.js';
const jsonPath = 'scraped.json';

let appJs = fs.readFileSync(appJsPath, 'utf8');
const scrapedJson = fs.readFileSync(jsonPath, 'utf8');

const targetStart = "const PREDICTION_RESULTS_KEY = 'pk_online_prediction_results';";
const targetEnd = "let predictionInitialized = false;";

const startIndex = appJs.indexOf(targetStart);
const endIndex = appJs.indexOf(targetEnd);

if (startIndex !== -1 && endIndex !== -1) {
    const stringToAdd = `const PREDICTION_RESULTS_KEY = 'pk_online_prediction_results';\n\nconst SLOT_GAMES_DATA = ${scrapedJson};\n\n`;
    
    const newAppJs = appJs.slice(0, startIndex) + stringToAdd + appJs.slice(endIndex);
    fs.writeFileSync(appJsPath, newAppJs, 'utf8');
    console.log('Successfully injected SLOT_GAMES_DATA!');
} else {
    console.error('Could not find markers', { startIndex, endIndex });
}
