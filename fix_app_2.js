const fs = require('fs');

let content = fs.readFileSync('app.js', 'utf8');

// Fix handleSequenceCreate
content = content.replace(
    /function handleSequenceCreate\(event\) \{\n    event\.preventDefault\(\);/g,
    `function handleSequenceCreate(event) {
    const e = event || window.event;
    if (e && e.preventDefault) e.preventDefault();`
);

// Fix handleAuthSubmit
content = content.replace(
    /function handleAuthSubmit\(event\) \{\n    event\.preventDefault\(\);/g,
    `function handleAuthSubmit(event) {
    const e = event || window.event;
    if (e && e.preventDefault) e.preventDefault();`
);

fs.writeFileSync('app.js', content);
