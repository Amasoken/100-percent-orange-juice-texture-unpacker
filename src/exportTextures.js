const fs = require('fs');
const path = require('path');
const { createDirectory, getZipContents, convertToPNG, deleteDataFiles } = require('./utils/file');

async function exportTextures(config) {
    let exportCount = 0;
    let errorCount = 0;
    const conversionPromises = [];

    const exportDate = new Date();
    const exportDirName = 'EXPORT_' + exportDate.toISOString().replace(/-|:/g, '.').replace('T', '_').replace('Z', '');

    const exportDirPath = path.resolve(config.OutputDirectory, exportDirName);
    const gameDataDirPath = path.resolve(config.GameDirectory, 'data');

    await createDirectory(path.resolve(exportDirPath));
    const files = await fs.promises.readdir(gameDataDirPath);
    const archives = files.filter((name) => config.ExportArchives.includes(name));

    for (const archiveFullName of archives) {
        console.log('\n=====\nParsing [' + archiveFullName + ']...');
        const archiveName = archiveFullName.split('.pak')[0];
        const currentExportDirPath = path.resolve(exportDirPath, archiveName);
        await createDirectory(currentExportDirPath);

        const zip = await getZipContents(path.resolve(gameDataDirPath, archiveFullName));
        if (!zip) {
            errorCount++;
            continue;
        }

        const filteredImages = zip.filter((relativePath) => config.SearchExpression.test(relativePath));
        console.log('Extracting images from [' + archiveFullName + ']...');

        for (const image of filteredImages) {
            const imageData = await image.async('nodebuffer');

            let imageName = image.name;
            if (config.RenameToDDS) imageName = imageName.replace(/\.dat$/, '.dds');

            const imageFullPath = path.resolve(currentExportDirPath, imageName);
            await fs.promises.writeFile(imageFullPath, imageData);

            exportCount++;
        }

        if (config.ConvertToPNG) {
            console.log('Converting [' + archiveFullName + '] to png...');
            const promise = convertToPNG(currentExportDirPath).then(() => deleteDataFiles(currentExportDirPath));
            conversionPromises.push(promise);
        }
    }

    if (config.ConvertToPNG) console.log('\n=====\nWaiting for png conversion to finish...');

    Promise.all(conversionPromises).then(() => {
        console.log('\n=====\nDone!');
        console.log('Exported ' + exportCount + ' images.');
        if (errorCount) console.log('Encountered ' + errorCount + ' errors.');
        console.log('Check your exports in ' + exportDirPath);
    });
}

module.exports = {
    exportTextures,
};
