import { rm, writeFile } from 'fs.promises'

global.beforeAll(async () => {
    const content = "DB_NAME=test.sqlite\nJWT_SECRET=SECRET\n";
    try {
        await writeFile('../.env.test', content);
    } catch(err) {}
})

global.afterAll(async () => {
    try {
        await rm('../.env.test');
    } catch(err) {}
})

