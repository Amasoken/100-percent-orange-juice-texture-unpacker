const fs = require('fs');
const { initializeConfig } = require('../src/config');

(async () => {
    await fs.promises.access('./config.ini').catch((error) => {
        if (!error.code.includes('ENOENT')) throw error;

        console.log('config.ini not detected, copying from config.ini.example');
        return fs.promises.copyFile('./config.example.ini', './config.ini');
    });

    const config = await initializeConfig();
    console.log('Working config:', config);
})();
