const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'client/src');
const API_BASE = "${import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com'}";

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(directoryPath);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Replace backtick instances: `http://localhost:5000/api/...` -> `${import.meta...}/api/...`
    if (content.includes('`http://localhost:5000')) {
        content = content.replace(/`http:\/\/localhost:5000/g, '`' + API_BASE);
        changed = true;
    }

    // Replace single quote instances: 'http://localhost:5000/api/...' -> `${import.meta...}/api/...`
    if (content.includes("'http://localhost:5000")) {
        content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`' + API_BASE + '$1`');
        changed = true;
    }
    
    // Replace double quote instances just in case
    if (content.includes('"http://localhost:5000')) {
        content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, '`' + API_BASE + '$1`');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
