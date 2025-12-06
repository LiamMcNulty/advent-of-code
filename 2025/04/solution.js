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

const paperRollGrid = data.split('\n');


console.log('');
console.log('= Part 01 ====');

console.log(' -> Determining Accessible Paper Rolls');
let accessibleRolls = solve(paperRollGrid);

console.log(' -> Total Accessible Paper Rolls: ' + accessibleRolls);


function solve(paperRollGrid, part2 = false){

    // Get the size (in terms of array index) of the grid we're working with
    const gridIndexHeight = paperRollGrid.length - 1;
    const gridIndexWidth = paperRollGrid[0].length - 1;

    // Convert to array of arrays for easier access when doing the count
    paperRollGrid = paperRollGrid.map(paperRollRow => { return paperRollRow.split('')});

    // Setup count
    let count = 0;

    // Iterate rolls with indices, x and y, being used for coordinates where
    // (0, 0) is the top left roll
    paperRollGrid.forEach((paperRollRow, y) => {
        paperRollRow.forEach((paperRoll, x) => {

            // Skip if we don't have a paperRoll
            if (paperRoll !== '@'){ return};

            // Determine the coordinates of the rolls to check
            const adjacentRollPositions = getAdjacentPositions(x, y, gridIndexWidth, gridIndexHeight);
            const adjacentRollCount = countAdjacentRolls(adjacentRollPositions, paperRollGrid);

            if (adjacentRollCount < 4) count++;
        });
    });

    return count;
}

function getAdjacentPositions(x, y, maxXIndex, maxYIndex){

    let positions = [
        [(x - 1), (y - 1)], // Top Left
        [(x    ), (y - 1)], // Top
        [(x + 1), (y - 1)], // Top Right
        [(x + 1), (y    )], // Right
        [(x + 1), (y + 1)], // Bottom Right
        [(x    ), (y + 1)], // Bottom
        [(x - 1), (y + 1)], // Bottom Left
        [(x - 1), (y    )]  // Left
    ];

    // Filter out of bounds positions
    positions = positions.filter(position => {
        const xIndex = position[0];
        const yIndex = position[1];
        if (xIndex >= 0 && yIndex >= 0 && xIndex <= maxXIndex && yIndex <= maxYIndex){
            return position;
        }
    });

    return positions;
}

function countAdjacentRolls(positions, paperRollGrid) {

    const count = positions.reduce((sum, position) => {
        const x = position[0];
        const y = position[1];

        const isPaperRoll = (paperRollGrid[y][x] === '@');
        return isPaperRoll ? sum + 1 : sum;
    }, 0);

    return count;
}