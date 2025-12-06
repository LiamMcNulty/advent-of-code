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

const batteryBanks = data.split('\n');


console.log('');
console.log('= Part 01 ====');

console.log(' -> Determining Maximum Joltage Per Bank');
let jolts = solve(batteryBanks);

console.log(' -> Summing Total Output Joltage');
let total = jolts.reduce((sum, value) => sum + parseInt(value), 0);

console.log(' -> Total: ' + total);


console.log('');
console.log('= Part 02 ====');

console.log(' -> Determining Maximum Joltage Per Bank');
jolts = solve(batteryBanks, true);

console.log(' -> Summing Total Output Joltage');
total = jolts.reduce((sum, value) => sum + parseInt(value), 0);

console.log(' -> Total: ' + total);


function solve(batteryBanks, part2 = false){
    // Iterate each bank and return the maximum joltage for each
    let maximumBankJoltage = batteryBanks.map(batteryBank => {

        // Split batteries so we can iterate
        batteryBank = batteryBank.split('');

        // Set the amount of batteries we are going to use
        const batteriesRequired = (part2) ? 12 : 2;

        // Set some variables to use in our while loop to keep track of progress and
        // to get us started
        let batteryJoltages = '';
        let startIndex = 0;
        let endIndex = batteryBank.length - batteriesRequired;
        let batteriesRemaining = batteriesRequired - batteryJoltages.length;

        // Loop until we have no batteries left to find
        while(batteriesRemaining){

            // Get maximum joltage and add to string
            let { maxJoltage, position } = getMaxJoltage(startIndex, endIndex, batteryBank);
            batteryJoltages += maxJoltage;

            // Set variables for next loop.
            // Start after the position of the first joltage value and
            // decrease our battery reamining count
            startIndex = position + 1;
            batteriesRemaining--;
            endIndex = batteryBank.length - batteriesRemaining;

        }

        return batteryJoltages;
    });

    return maximumBankJoltage;
}

function getMaxJoltage(startIndex, endIndex, batteryBank){

    // Set both values to 0 as a starting point
    let maxJoltage = 0;
    let position = 0;

    for (let i = startIndex; i < endIndex + 1; i++){
        const batteryJoltage = parseInt(batteryBank[i]);

        // Set new maximum and save position
        if (batteryJoltage > maxJoltage){
            maxJoltage = batteryJoltage;
            position = i;
        }

        // 9 is the highest we can get so end loop
        if (batteryJoltage === 9){ break; }
    }

    return { maxJoltage, position }
}