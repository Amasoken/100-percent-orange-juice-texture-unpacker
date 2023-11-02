const { initializeConfig } = require('../src/config');
const { exportTextureNames } = require('../src/exportTextureNames');

(async () => {
    const config = await initializeConfig();
    console.log('Working config:', config);

    await exportTextureNames(config);
})();
