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

console.log('= Cleaning Up Data');
const foodData = data.split('\n');
const { freshIDRanges, ingredientIDs } = cleanupData(foodData);


console.log('');
console.log('= Part 01 ====');

console.log(' -> Determining Fresh Ingredients in Inventory');
let freshIngredientIDs = solve(freshIDRanges, ingredientIDs);

let total = freshIngredientIDs.length;
console.log(' -> Total Fresh Ingredients: ' + total);


console.log('');
console.log('= Part 02 ====');

console.log(' -> Determining All Fresh Ingredients');
freshIngredientIDs = solve(freshIDRanges, ingredientIDs, true);

total = freshIngredientIDs;
console.log(' -> Total Fresh Ingredients: ' + total);


function solve(freshIDRanges, ingredientIDs, part2 = false){

    // Break references otherwise part 1 removes data that affects part 2
    freshIDRanges = [...freshIDRanges];

    if (part2){
        return freshIDRanges.reduce((count, freshIDRange)=> {

            const lowerBound = parseInt(freshIDRange.split('-')[0]);
            const upperBound = parseInt(freshIDRange.split('-')[1]);
            const freshIngredientsCount = (upperBound - lowerBound) + 1;

            count += freshIngredientsCount;
            return count;
        }, 0);
    }

    // part 1
    return ingredientIDs.reduce((freshIDs, ingredientID) => {

        // Since both sets of data are ordered, we'll remove fresh ID ranges
        // as we move past them. If there are none left, just return
        if (freshIDRanges.length === 0) return freshIDs;

        // Get the lowest range in our array
        let currentRange = freshIDRanges[0];
        let lowerBound = parseInt(currentRange.split('-')[0]);
        let upperBound = parseInt(currentRange.split('-')[1]);

        // As long as we have 1 item in the array and the ingredientID is above our
        // upper Bound, we should remove the current range and move to the next
        while (freshIDRanges.length > 1 && ingredientID > upperBound){
            freshIDRanges.shift();
            currentRange = freshIDRanges[0];
            lowerBound = parseInt(currentRange.split('-')[0]);
            upperBound = parseInt(currentRange.split('-')[1]);
        }

        if (ingredientID >= lowerBound && ingredientID <= upperBound){
            freshIDs.push(ingredientID);
        }

        return freshIDs;
    }, []);
}

// splits data and merges overlapping ID ranges
function cleanupData(foodData){

    // Split data into bands and ingredient IDs
    let freshIDRanges = [], ingredientIDs = [];
    let emptyLineHit = false;
    foodData.forEach(line => {
        // empty line indicates we're at the ingredientIDs
        if (line === ''){ return emptyLineHit = true; }

        // Push data to the appropriate array
        if (emptyLineHit){
            ingredientIDs.push(parseInt(line));
        } else {
            freshIDRanges.push(line);
        }
    })

    // Sort ingredient IDs
    ingredientIDs = ingredientIDs.sort((a, b) => a - b);

    // Sort fresh ID ranges by starting value
    freshIDRanges = freshIDRanges.sort((a, b) => a.split('-')[0] - b.split('-')[0]);

    // Remove ranges that have the same lower value but a smaller upper value than another
    let lastLowerBound;
    freshIDRanges = freshIDRanges.reduce((filteredRanges, freshIDRange) => {
        const currentLowerBound = parseInt(freshIDRange.split('-')[0]);
        const currentUpperBound = parseInt(freshIDRange.split('-')[1]);

        if (lastLowerBound === currentLowerBound){
            // Keep the range with the higher upper band
            const lastRangeIndex = filteredRanges.length - 1;
            const lastIDRange = filteredRanges[lastRangeIndex].split('-');
            const lastUpperBound = parseInt(lastIDRange[1]);


            if (lastUpperBound < currentUpperBound) {
                filteredRanges[lastRangeIndex] = freshIDRange;
            }

        } else {
            filteredRanges.push(freshIDRange);
        }

        lastLowerBound = currentLowerBound;

        return filteredRanges;
    }, []);

    // Merge overlapping fresh ranges
    let lastUpperBound;
    freshIDRanges = freshIDRanges.reduce((mergedRanges, freshIDRange) => {
        const currentLowerBound = parseInt(freshIDRange.split('-')[0]);
        const currentUpperBound = parseInt(freshIDRange.split('-')[1]);

        // Either the first range or no overlap, so just add to our final array
        if (!lastUpperBound || (currentLowerBound > lastUpperBound)) {
            mergedRanges.push(freshIDRange);

        // Overlap between ranges so merge
        } else {

            // Reconfigure the last range so it's upper bound is the larger of it and the current range
            const lastRangeIndex = mergedRanges.length - 1;
            const lastIDRange = mergedRanges[lastRangeIndex].split('-');

            const lastUpperBound = parseInt(lastIDRange[1]);
            if (lastUpperBound < currentUpperBound) {
                lastIDRange[1] = currentUpperBound;
                mergedRanges[lastRangeIndex] = lastIDRange.join('-');
            }
        }

        // Record the last upper bound for the next loop
        lastUpperBound = currentUpperBound;

        return mergedRanges;
    }, [])

    return { freshIDRanges, ingredientIDs }
}

function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}