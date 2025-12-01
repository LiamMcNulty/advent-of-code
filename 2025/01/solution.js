const fs = require('node:fs');

console.log('-> Retrieving Input Data - input.txt');
let data;
try {
    data = fs.readFileSync(__dirname + '/input.txt', 'utf8');

} catch (err) {
    console.error(err);
    return;
}

const instructions = data.split('\n');

console.log('-> Cracking Password');
const solution = solve(instructions);

console.log('');
console.log('-> Password: ' + solution);


function solve(instructions){

    let position = 50;
    let password = 0;

    instructions.forEach(instruction => {

        if (instruction === ''){ return; }

        // Extract direction and clicks
        const direction = instruction.substring(0, 1);
        const clicks = parseInt(instruction.substring(1));

        // Calculate new position
        position = (direction === 'L') ? (position - clicks) : (position + clicks);

        // Re-adjust Position
        position = readjustTurns(position);

        // Check if 0, therefore increase count for password
        if (position === 0){
            password++;
        }

    })

    return password;
}


// Accounts for whole (and multiple) turns of the dial
function readjustTurns(position){
    while (position < 0 || position > 99){
        if (position < 0){
            position += 100;

        } else if (position > 99){
            position -= 100;
        }
    }

    return position;
}
