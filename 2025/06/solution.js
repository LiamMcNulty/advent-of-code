const fs = require('node:fs');

console.log('');
console.log('= Retrieving Input Data - input.txt');
let data;
try {
    data = fs.readFileSync(__dirname + '/input.txt', 'utf8');

} catch (err) {
    console.error(err);
    return;
}

console.log('= Cleaning Up Data');
let mathWorksheet = cleanupData(data);


console.log('');
console.log('= Part 01 ====');

console.log(' -> Solving Maths Sheet');
let solvedWorksheet = solve(mathWorksheet);

let total = solvedWorksheet.reduce((sum, value) => sum + value, 0);
console.log(' -> Maths Sheet Grand Total: ' + total);


console.log('');
console.log('= Part 02 ====');

console.log(' -> Solving Maths Sheet with Correct Method');
solvedWorksheet = solve(mathWorksheet, true);

total = solvedWorksheet.reduce((sum, value) => sum + value, 0);
console.log(' -> Maths Sheet Grand Total: ' + total);


function solve(mathWorksheet, part2 = false){

    // Deep copy to break references otherwise part1 affects part2
    mathWorksheet = JSON.parse(JSON.stringify(mathWorksheet));

    if (part2){
        mathWorksheet = correctFormat(mathWorksheet);
    }

    return mathWorksheet.map(mathsProblem => {
        const operator = mathsProblem.pop();
        const startValue = mathsProblem.pop();

        return mathsProblem.reduce((output, value) => {
            return eval(output + operator + value);
        }, startValue)
    });
}

function cleanupData(data){

    // Split data and seperate operators from values
    let mathWorksheet = data.split('\n');
    let operators = mathWorksheet.pop();

    // Setup to track the bounds of each column
    let formattedWorksheet = [];
    let finished = false;

    // Process columns to maintain whitespace
    while (!finished){

        // Set default start and end indexes for colummns
        let digitIndexes = [10000, 0];

        // Determine start and end indexes for columns
        mathWorksheet.forEach((row, index) => {

            const regex = /(\d+|\*|\+)/;
            const match = row.match(regex);
            const startIndex = match.index;
            const endIndex = startIndex + match[0].length;

            // Get earliest starting index across the column
            if (digitIndexes[0] > startIndex) digitIndexes[0] = startIndex;
            if (digitIndexes[1] < endIndex) digitIndexes[1] = endIndex;
        });

        // Get value columns and remove from data
        mathWorksheet = mathWorksheet.map((row, index) => {
            const startIndex = digitIndexes[0];
            const endIndex = digitIndexes[1];
            const value = row.slice(startIndex, endIndex);

            if (!Array.isArray(formattedWorksheet[index])) formattedWorksheet[index] = [];

            formattedWorksheet[index].push(value)
            return row.slice(endIndex + 1);
        });

        // Finish when there is nothing left to process value wise
        finished = mathWorksheet.filter(row => { return row === '' }).length;
    }

    // Process operators string
    operators = operators.replace(/^\s*/, '');
    operators = operators.replace(/\s*$/, '');

    // Split at whitespaces
    formattedWorksheet.push(operators.split(/\s+/));

    // Rotate Matric so each row is the equation to calculate
    mathWorksheet = rotateMatrix(formattedWorksheet);

    return mathWorksheet;
}

function rotateMatrix(matrix){
    const rotatedMatrix = [];

    matrix.forEach((row, i) => {
        row.forEach((element, j) => {
            if (!Array.isArray(rotatedMatrix[j])) rotatedMatrix[j] = [];

            rotatedMatrix[j].push(element);
        });
    });

    return rotatedMatrix;
}

function correctFormat(worksheet){
    const operatorIndex = worksheet[0].length - 1;

    // Correct the worksheet
    let fixedWorksheet = worksheet.map(row => {

        // Contruct new row
        const newRow = [];
        row.forEach((value, index) => {

            // Skip operators
            if (operatorIndex === index){ return; }

            // Interate each digit
            value = value.split('');
            value.forEach((digit, jindex) => {
                if (newRow[jindex] == undefined) newRow[jindex] = '';
                newRow[jindex] += digit;
            })
        })

        return newRow;
    })

    // Add operators
    fixedWorksheet = fixedWorksheet.map((row, index) => {
        row.push(worksheet[index][operatorIndex]);
        return row;
    })

    return fixedWorksheet;
}