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
let invalidIDs = solve(idRanges);
console.log(' -> Found ' + invalidIDs.length + ' invalid IDs');

console.log(' -> Summing IDs');
let total = invalidIDs.reduce((sum, value) => sum + value, 0);

console.log(' -> Total: ' + total);


console.log('');
console.log('= Part 02 ====');

console.log(' -> Determining Invalid IDs');
invalidIDs = solve(idRanges, true);
console.log(' -> Found ' + invalidIDs.length + ' invalid IDs');

console.log(' -> Summing IDs');
total = invalidIDs.reduce((sum, value) => sum + value, 0);

console.log(' -> Total: ' + total);

function solve(idRanges, part2 = false){

    let invalidIDs = [];

    idRanges.forEach(idRange => {

        // Get start and end IDs
        idRange = idRange.split('-');
        const startID = parseInt(idRange[0]);
        const endID = parseInt(idRange[1]);

        // Iterate through range
        for(let id = startID; id !== endID; id++){

            // Grab a string version of the id
            const stringID = id.toString();

            // Part 2 Solution
            if (part2){

                // Fix to start and end of line with '^' and '$'
                // Capture any digits with parenthesis
                // Match captured digits at least once with '\1+'
                let regex = /^(\d+)\1+$/;
                const isInvalid = regex.test(stringID);

                if (isInvalid){
                    invalidIDs.push(id);
                }

            // Part 1 Solution
            } else {

                // Must be even number length to be invalid (two
                // sets of equal length number)
                if ((stringID.length % 2) !== 0){
                    continue;
                }

                // Split id evenly and check if they match
                const idFirstHalf = stringID.slice(0, stringID.length / 2);
                const idSecondHalf = stringID.slice(stringID.length / 2, stringID.length);

                if (idFirstHalf === idSecondHalf){
                    invalidIDs.push(id);
                }
            }
        }
    });

    return invalidIDs;
}
