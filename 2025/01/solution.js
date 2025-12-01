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

const instructions = data.split('\n');

console.log('');
console.log('= Part 01 ====');

console.log(' -> Cracking Password');
let solution = solve(instructions);

console.log(' -> Password: ' + solution);


console.log('');
console.log('= Part 02 ====');

console.log(' -> Cracking Password with method "0x434C49434B"');
solution = solve(instructions, true);

console.log(' -> Password: ' + solution);

function solve(instructions, part2 = false){

    let position = 50;
    let password = 0;

    instructions.forEach(instruction => {

        // Extract direction and clicks
        const direction = instruction.substring(0, 1);
        const clicks = parseInt(instruction.substring(1));

        // Record position before applying instructions
        const oldPosition = position;

        // Calculate new position
        position = (direction === 'L') ? (position - clicks) : (position + clicks);

        // Save temporary position
        let tempPosition = position;

        // Recalculate Position and Passes.
        let passes = Math.abs(Math.floor(position / 100));
        position = position % 100;

        // Reset position
        if (position < 0){
            position += 100;
        }

        // Remove one of the passes
        if ((oldPosition === 0 && (direction === 'L')) ||
            ((tempPosition % 100 === 0) && (direction === 'R') &&
            passes)){
            passes--;
        }

        // Count landing on zero
        if (position === 0){
            password++;
        }

        // Add passes to password
        if (part2){
            password += passes;
        }
    })

    return password;
}
