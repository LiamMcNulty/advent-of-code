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


// Convert to array of arrays for easier manipulation and access during solution
let tachyonData = data.split('\n');
tachyonData = tachyonData.map(tachyonDataRow => { return tachyonDataRow.split('')});


console.log('');
console.log('= Part 01 ====');
console.log(' -> Solving Tachyon Manifold Diagram');
let beamSplits = solve(tachyonData);
console.log(' -> Total Splits: ' + beamSplits);


// console.log('');
// console.log('= Part 02 ====');
// console.log(' -> Solving Tachyon Manifold Diagram');
// beamSplits = solve(tachyonData);
// console.log(' -> Total Splits: ' + beamSplits);


function solve(tachyonData, part2 = false){

    // Create beam tracker and set default 'off' value across width
    let beamTracker = new Array(tachyonData[0].length).fill(0);
    let beamSplits = 0;

    // Iterate rows
    for (let y = 0; y < tachyonData.length; y++){

        const tachyonRow = tachyonData[y];

        // console.log(`\nRow ${y + 1} -------`)
        // console.log(tachyonRow)

        // Traverse across each row
        for (let x = 0; x < tachyonRow.length; x++){
            const tachyonElement = tachyonRow[x];

            // console.log(`\nCol ${x + 1} -------`)
            // console.log(tachyonElement)

            if (tachyonElement === 'S'){
                beamTracker[x] = 1;
            }

            if (tachyonElement === '^' && beamTracker[x] === 1){
                beamSplits++;
                beamTracker[x] = 0;
                beamTracker[x - 1] = 1;
                beamTracker[x + 1] = 1;
            }
        }
    }

    // console.log(beamTracker.join(''))
    return beamSplits;
}
