/* runs in console with 
    node csv-combiner.js ./fixtures/accessories.csv ./fixtures/clothing.csv > combined.csv */

const csv = require('fast-csv');
const fs = require('fs');

/*   I plan to expand on this section so that it works with any number of files   */
// // get files from command line
// const args = process.argv.slice(2);
// // remove path so the filename can be used as a table header
// const trimmedArgs = args.map(el => el.split('/').pop());

// the non extensible way until the above is completed
const file1 = process.argv[2];
const file2 = process.argv[3];
// const file3 = process.argv[4];   // for a third file, also add "file3" to the array on line 52

/*  need to redo this and chain .then, also needs an error handler */
// function to merge multiple files, and output to a single file
function concatFiles(csvFilePaths, outputFilePath) {
    const promises = csvFilePaths.map(path => {
        return new Promise(resolve => {
            const dataArray = [];
            return csv
                .parseFile(path, { headers: true })
                .on('data', function(data) {
                    dataArray.push(data);
                })
                .on('end', function() {
                    resolve(dataArray);
                });
        });
    });
    return Promise.all(promises)
        .then(results => {
            /* need to add more options in order to read the ` \"Gingham\" ` inside clothing.csv  
                for now I only included lines 1-7 in the clothing.csv file so that it will work */
            const csvStream = csv.format({ headers: ['email_hash', 'category', 'filename']});
            const writeStream = fs.createWriteStream(outputFilePath);

            /*  need to append the filename row, I plan on using lines 8-11 for this  */
            csvStream.pipe(writeStream);
            results.forEach(result => {
                result.forEach(data => {
                    csvStream.write(data);
                });
            });
            csvStream.end();
        });
}

concatFiles([file1, file2], 'combined.csv')
