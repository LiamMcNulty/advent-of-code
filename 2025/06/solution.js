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
// console.log({mathWorksheet})


console.log('');
console.log('= Part 01 ====');

console.log(' -> Solving Maths Sheet');
let solvedWorksheet = solve(mathWorksheet);
// console.log({solvedWorksheet});

let total = solvedWorksheet.reduce((sum, value) => sum + value, 0);
console.log(' -> Maths Sheet Grand Ttoal: ' + total);


function solve(mathWorksheet, part2 = false){
    return mathWorksheet.map(mathsProblem => {
        const operator = mathsProblem.shift();
        const startValue = mathsProblem.shift();

        return mathsProblem.reduce((output, value) => {
            return eval(output + operator + value);
        }, startValue)
    });
}

function cleanupData(data){
    let mathWorksheet = data.split('\n');
    mathWorksheet = mathWorksheet.map(row => { 

        // Remove white space at beginning and end of each row
        row = row.replace(/^\s*/, '');
        row = row.replace(/\s*$/, '');

        // Split at whitespaces
        return row.split(/\s+/);
    });

    mathWorksheet = rotateMatrix(mathWorksheet);

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

    // Put the operator in the first position
    rotatedMatrix.map(row => row.reverse(row));
    return rotatedMatrix;
}