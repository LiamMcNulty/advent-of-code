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

const idRanges = data.split(',');


console.log('');
console.log('= Part 01 ====');

console.log(' -> Determining Invalid IDs');
const invalidIDs = solve(idRanges);
console.log(' -> Found ' + invalidIDs.length + ' invalid IDs');

console.log(' -> Summing IDs');
const total = invalidIDs.reduce((sum, value) => sum + value, 0);

console.log(' -> Total: ' + total);


// console.log('');
// console.log('= Part 02 ====');

// console.log(' -> Cracking Password with method "0x434C49434B"');
// solution = solve(instructions, true);

// console.log(' -> Password: ' + solution);

function solve(idRanges){

    let invalidIDs = [];

    idRanges.forEach(idRange => {

        // Get start and end IDs
        idRange = idRange.split('-');
        const startID = parseInt(idRange[0]);
        const endID = parseInt(idRange[1]);

        // console.log({ startID, endID });

        // Iterate through range
        for(let id = startID; id < endID + 1; id++){

            const stringID = id.toString();

            // Must be even number length to be invalid (two
            // sets of equal length number)
            if ((stringID.length % 2) !== 0){
                continue;
            }

            // Split id evenly and check if they match
            const idFirstHalf = stringID.slice(0, stringID.length / 2);
            const idSecondHalf = stringID.slice(stringID.length / 2, stringID.length);

            if (idFirstHalf === idSecondHalf){
                // console.log({ id });
                invalidIDs.push(id);
            }
        }
    });

    return invalidIDs;
}
