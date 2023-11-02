const { initializeConfig } = require('./src/config');
const { exportTextures } = require('./src/exportTextures');

(async () => {
    const config = await initializeConfig();
    console.log('Working config:', config);

    await exportTextures(config);
})();
