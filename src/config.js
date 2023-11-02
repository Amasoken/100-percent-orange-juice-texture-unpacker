const fs = require('fs');
const path = require('path');

const config = {
    GameDirectory: '',
    OutputDirectory: '',
    ConvertToPNG: false,
    RenameToDDS: true,
    ExportArchives: [],
    SearchExpression: new RegExp(''), // match every file by default
};

const DDSTRONK_PATH = './DDStronk.exe';

const ErrorMessages = {
    MissingConfig: `Couln't read the configuration file.
Please make sure config.ini exists in the project directory.

See config.example.ini for details.`,
    GameDirectory: `Couldn't access 100% Orange Juice directory.
Please provide game directory path in config.ini under [GameDirectory] and make sure you have the necessary permissions.

See config.example.ini for details.
`,
    OutputDirectory: `Couldn't access the output directory.
Please provide directory for exports in config.ini under [OutputDirectory] and make sure you have the necessary permissions.

See config.example.ini for details.
`,
    ConvertToPNG: `Couldn't find DDStronk.exe.
If you need to convert your exports to PNG files, please download DDStronk.
If you don't need to convert dds (dat) files to png, set [ConvertToPNG] to false in config.ini.

See config.example.ini for details.
`,
    ExportArchives: `Please provide archives for export under in config.ini under [ExportArchives].

See config.example.ini for available archives.
`,
    SearchExpression: `Please provide a valid search string in config.ini under [SearchExpression].

See config.example.ini for details.
`,
};

async function validateConfig() {
    // GameDirectory
    await fs.promises.access(path.resolve(config.GameDirectory, 'data', 'alphamasks.pak')).catch((error) => {
        console.log(ErrorMessages.GameDirectory);
        console.error(error);
        process.exit();
    });

    // OutputDirectory
    await fs.promises.access(path.resolve(config.OutputDirectory), fs.constants.W_OK).catch((error) => {
        console.log(ErrorMessages.OutputDirectory);
        console.error(error);
        process.exit();
    });

    // ConvertToPNG
    if (config.ConvertToPNG) {
        await fs.promises.access(DDSTRONK_PATH).catch((error) => {
            console.log(ErrorMessages.ConvertToPNG);
            console.error(error);
            process.exit();
        });
    }

    // ExportArchives
    for (const archive of config.ExportArchives) {
        await fs.promises.access(path.resolve(config.GameDirectory, 'data', archive)).catch((error) => {
            console.log("Couldn't find archive " + archive);
            console.log(ErrorMessages.ExportArchives);
            console.error(error);
            process.exit();
        });
    }
}

const isParamName = (value) => value.startsWith('[') && value.endsWith(']');

const parseBoolean = (value) => {
    if (!value || value.toLowerCase() === 'false') return false;
    return true;
};

const parseRegex = (value) => {
    const regexParams = [];

    const regexWithFlags = value.match(/\/(.*?)\/([gimsuy]*)$/);
    if (regexWithFlags) {
        const [, pattern, flags] = regexWithFlags;
        regexParams.push(pattern, flags);
    } else {
        regexParams.push(value);
    }

    // SearchExpression
    try {
        return new RegExp(...regexParams);
    } catch (error) {
        console.log(ErrorMessages.SearchExpression);
        console.error(error);
        process.exit();
    }
};

async function loadConfig() {
    const configString = await fs.promises
        .readFile('./config.ini')
        .then((data) => data.toString())
        .catch((error) => {
            console.log(ErrorMessages.MissingConfig);
            console.error(error);
            process.exit();
        });

    const configValues = configString
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !['#', ';'].includes(line[0]));

    let currentKey;

    for (const line of configValues) {
        if (isParamName(line)) {
            currentKey = line.substring(1, line.length - 1);
        } else if (currentKey in config) {
            switch (currentKey) {
                case 'ConvertToPNG':
                case 'RenameToDDS':
                    config[currentKey] = parseBoolean(line);
                    break;

                case 'ExportArchives':
                    if (!config[currentKey].includes(line)) config[currentKey].push(line);
                    break;

                case 'SearchExpression':
                    config[currentKey] = parseRegex(line);
                    break;

                default:
                    config[currentKey] = line;
                    break;
            }
        }
    }
}

async function initializeConfig() {
    console.log('Initializing config...');
    await loadConfig();
    await validateConfig();
    Object.freeze(config);

    console.log('Initialized');
    return config;
}

module.exports = {
    initializeConfig,
};
