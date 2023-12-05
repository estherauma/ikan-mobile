// Use this script to check which pages are missing in certain languages
// Run this script with the following command: 
// node scripts/compare-content.js

// NOTE: You have to manually copy the all the content into a json file and save it as 'all-content.json' in the same directory

const fs = require('fs');

// Read the content of the JSON file
const fileContent = fs.readFileSync('all-content.json', 'utf-8');

// Parse the JSON content
const jsonObject = JSON.parse(fileContent);

// Extract the keys from the 'en-us' language
const enUsKeys = Object.keys(jsonObject["en-us"]);

// Initialize an object to store missing keys in other languages
const missingKeys = {};

// Iterate through other languages and find missing keys
for (const langCode in jsonObject) {
    if (langCode !== "en-us") {
        const langKeys = Object.keys(jsonObject[langCode]);
        const missingInLang = enUsKeys.filter(key => !langKeys.includes(key));
        if (missingInLang.length > 0) {
            missingKeys[langCode] = missingInLang;
        }
    }
}

// Display the results
if (Object.keys(missingKeys).length > 0) {
    console.log("Missing keys in other languages:");
    for (const langCode in missingKeys) {
        console.log(`${langCode}: ${missingKeys[langCode]}`);
    }
} else {
    console.log("No missing keys in other languages.");
}