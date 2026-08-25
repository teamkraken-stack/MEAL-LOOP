const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    if (!filePath.endsWith('.html')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace "FoodSafe" or "Food Safe" with "Meal Loop"
    // Negative lookahead: (?!\s*[\._\(A]) means do NOT match if followed by dot, underscore, parenthesis, or 'A' (for FoodSafeAvatars)
    let newContent = content.replace(/\bfood\s*safe\b(?!\s*[\._\(A])/ig, "Meal Loop");
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('Updated:', filePath);
    }
}

function walkSync(currentDirPath) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        if (name === 'node_modules' || name === '.git') return;
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            replaceInFile(filePath);
        } else if (stat.isDirectory()) {
            walkSync(filePath);
        }
    });
}

walkSync(process.cwd());
console.log('Done replacing.');
