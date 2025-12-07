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

// Convert to array of arrays for easier manipulation and access during puzzle
let paperRollGrid = data.split('\n');
paperRollGrid = paperRollGrid.map(paperRollRow => { return paperRollRow.split('')});


console.log('');
console.log('= Part 01 ====');

console.log(' -> Determining Accessible Paper Rolls');
let accessibleRolls = solve(paperRollGrid);

console.log(' -> Total Accessible Paper Rolls: ' + accessibleRolls);


console.log('');
console.log('= Part 02 ====');

console.log(' -> Determining Accessible Paper Rolls Recursively');
accessibleRolls = solve(paperRollGrid, true);

console.log(' -> Total Accessible Paper Rolls: ' + accessibleRolls);


function solve(paperRollGrid, part2 = false){

    // Remove removable rolls and count
    let { count, paperRollGridMarked } = removeAccessibleRolls(paperRollGrid);

    if (part2){

        // Create the new grid with accessible rolls removed
        let rollsRemoved = false;
        paperRollGrid = paperRollGridMarked.map(rollRow => {
            return rollRow.map(roll => {
                if ((roll === 'x')){
                    rollsRemoved = true;
                    return '.';
                } else {
                    return roll;
                }
            })
        })

        // Recursively remove rolls until we no longer can remove anymore
        if (rollsRemoved){
            count += solve(paperRollGrid, true);
        }
    }

    return count;
}

function removeAccessibleRolls(paperRollGrid){

    // Duplicate by value
    let paperRollGridMarked = JSON.parse(JSON.stringify(paperRollGrid));

    // Get the size (in terms of array index) of the grid we're working with
    const gridIndexHeight = paperRollGrid.length - 1;
    const gridIndexWidth = paperRollGrid[0].length - 1;

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

            // Increse count and mark result grid with x
            if (adjacentRollCount < 4){
                count++;
                paperRollGridMarked[y][x] = 'x';
            }
        });
    });

    return { count, paperRollGridMarked }
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