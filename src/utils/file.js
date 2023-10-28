const fs = require('fs');
const JSZip = require('jszip');
const { execSync } = require('child_process');

const createDirectory = (directoryPath) => {
    return fs.promises
        .mkdir(directoryPath)
        .then(() => console.log('Created folder [' + directoryPath + ']'))
        .catch((error) => {
            if (error.code.includes('EEXIST')) {
                console.log('Folder already exists [' + directoryPath + ']');
            } else {
                throw error;
            }
        });
};

async function getZipContents(archivePath) {
    const file = await fs.promises.readFile(archivePath).catch((error) => {
        console.log('Error reading file ' + archivePath);
        console.error(error);
    });
    if (!file) return null;

    const zip = await JSZip.loadAsync(file).catch((error) => {
        console.log('Error reading archive ' + archivePath + "; make sure it's a zip archive");
        console.error(error);
    });
    if (!zip) return null;

    return zip;
}

function convertImageToPNG(imagePath) {
    execSync(`DDStronk.exe "${imagePath}"`);
    return fs.promises.access(imagePath.replace(/\.dat$/, '.png')).then(() => fs.promises.unlink(imagePath));
}

module.exports = {
    createDirectory,
    getZipContents,
    convertImageToPNG,
};
