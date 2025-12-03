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

console.log(' -> Determining Maximum Joltag Per Bank');
let jolts = solve(batteryBanks);

console.log({jolts});

console.log(' -> Summing Total Output Joltage');
let total = jolts.reduce((sum, value) => sum + parseInt(value), 0);

console.log(' -> Total: ' + total);


// console.log('');
// console.log('= Part 02 ====');

// console.log(' -> Determining Invalid IDs');
// invalidIDs = solve(idRanges, true);
// console.log(' -> Found ' + invalidIDs.length + ' invalid IDs');

// console.log(' -> Summing IDs');
// total = invalidIDs.reduce((sum, value) => sum + value, 0);

// console.log(' -> Total: ' + total);

function solve(batteryBanks, part2 = false){
    // Where we'll save each banks maximum joltage
    let maximumBankJoltage = [];

    // Iterate each bank
    batteryBanks.forEach(batteryBank => {
        // console.log({batteryBank})

        // Iterate each battery for our first battery position and joltage
        batteryBank = batteryBank.split('');
        let firstMaximumJoltage = 0;
        let firstPosition = 0;

        // batteryBank.length - 1 as the first value cannot be the
        // last battery in the bank
        for (let i = 0; i < batteryBank.length - 1; i++){
            const batteryJoltage = parseInt(batteryBank[i]);

            // Set new maximum and save position
            if (batteryJoltage > firstMaximumJoltage){
                firstMaximumJoltage = batteryJoltage;
                firstPosition = i;
            }

            // 9 is the highest we can get so end loop
            if (batteryJoltage === 9){ break; }
        }

        // console.log({firstMaximumJoltage, firstPosition});

        // Iterate each battery for our second battery joltage from the
        // position of the first
        let secondMaximumJoltage = 0;
        let secondPosition = 0;
        for (let i = firstPosition + 1; i < batteryBank.length; i++){
            const batteryJoltage = parseInt(batteryBank[i]);

            // Set new maximum and save position
            if (batteryJoltage > secondMaximumJoltage){
                secondMaximumJoltage = batteryJoltage;
                secondPosition = i;
            }

            // 9 is the highest we can get so end loop
            if (batteryJoltage === 9){ break; }
        }

        // console.log({secondMaximumJoltage, secondPosition})

        // Add the maximum joltage for the bank
        maximumBankJoltage.push('' + firstMaximumJoltage + secondMaximumJoltage);
    });

    return maximumBankJoltage;
}
