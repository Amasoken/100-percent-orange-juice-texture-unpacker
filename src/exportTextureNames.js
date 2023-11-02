const fs = require('fs');
const path = require('path');
const { getZipContents } = require('./utils/file');

const OUTPUT_FILE = './TEXTURE_LIST.txt';

const formatTextureList = (archiveName, textureNames) => {
    return `=======================
Archive: ${archiveName}
=======================
${textureNames.join('\n')}
\n\n`;
};

async function exportTextureNames(config) {
    await fs.promises.writeFile(OUTPUT_FILE, '');

    const gameDataDirPath = path.resolve(config.GameDirectory, 'data');
    const files = await fs.promises.readdir(gameDataDirPath);
    const archives = files.filter((name) => config.ExportArchives.includes(name));

    for (const archiveFullName of archives) {
        console.log('Parsing ' + archiveFullName);

        const zip = await getZipContents(path.resolve(gameDataDirPath, archiveFullName));
        if (!zip) continue;

        const fileNames = Object.keys(zip.files).reduce((allNames, currentName) => {
            currentName = currentName.replace(/\d/g, '#');
            if (!allNames.includes(currentName)) allNames.push(currentName);

            return allNames;
        }, []);

        await fs.promises.appendFile(OUTPUT_FILE, formatTextureList(archiveFullName, fileNames));
    }

    console.log('Done!');
    console.log('Parsed archives: ' + config.ExportArchives.join(', '));
    console.log('Output file: ' + path.resolve(OUTPUT_FILE));
}

module.exports = {
    exportTextureNames,
};
