import { rm, writeFile } from 'fs.promises'
import { join } from 'path'

global.beforeAll(async () => {
    const content = "DB_NAME=test.sqlite\nJWT_SECRET=SECRET\n";
    try {
        await writeFile(join(__dirname, '..', '.env.test'), content);
    } catch(err) {}
})

global.afterAll(async () => {
    try {
        await rm(join(__dirname, '..', '.env.test'));
    } catch(err) {}
})

