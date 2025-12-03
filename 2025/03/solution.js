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


function solve(batteryBanks, part2 = false){
    // Where we'll save each banks maximum joltage
    let maximumBankJoltage = [];

    // Iterate each bank
    batteryBanks.forEach(batteryBank => {

        // Split batteries so we can iterate
        batteryBank = batteryBank.split('');

        // Get first joltage value. 'batteryBank.length - 1' for end index
        // as the first value cannot be the last battery in the bank
        const { maxJoltage: firstMaxVoltage, position: firstPosition } = getMaxJoltage(0, batteryBank.length - 1, batteryBank);

        // Get second jolage value. Start after the position of the first joltage value
        const { maxJoltage: secondMaximumJoltage, position: secondPosition } = getMaxJoltage(firstPosition + 1, batteryBank.length, batteryBank);

        // Add the maximum joltage for the bank
        maximumBankJoltage.push('' + firstMaxVoltage + secondMaximumJoltage);
    });

    return maximumBankJoltage;
}

function getMaxJoltage(startIndex, endIndex, batteryBank){

    // Set both values to 0 as a starting point
    let maxJoltage = 0;
    let position = 0;

    for (let i = startIndex; i < endIndex; i++){
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