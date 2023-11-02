const fs = require('fs');
const JSZip = require('jszip');
const { exec } = require('child_process');

function createDirectory(directoryPath) {
    return fs.promises.mkdir(directoryPath).catch((error) => {
        if (error.code.includes('EEXIST')) {
            console.log('Folder already exists [' + directoryPath + ']');
        } else {
            throw error;
        }
    });
}

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

function deleteDataFiles(directoryPath) {
    const datMask = '*.d??'; // both .dat and .dds files
    const command = `cd "${directoryPath}" && rm -f ${datMask}`;

    return new Promise((resolve, reject) => {
        exec(command, (error) => {
            if (error) reject(error);
            else resolve();
        });
    });
}
function convertToPNG(directoryPath) {
    return new Promise((resolve, reject) => {
        // 10MB max buffer to avoid "stdout maxBuffer length exceeded" error when converting
        exec(`DDStronk.exe "${directoryPath}"`, { maxBuffer: 1024 * 1024 * 10 }, (error) => {
            if (error) reject(error);
            else resolve();
        });
    });
}

module.exports = {
    createDirectory,
    getZipContents,
    convertToPNG,
    deleteDataFiles,
};
