import { rm, writeFile } from 'fs.promises'
import { join } from 'path'
import { getConnection } from 'typeorm'

// global.beforeEach(async () => {
//     try {
//         await rm(join(__dirname, '..', 'test.sqlite'));
//     } catch(err) {}
// });

// global.afterEach(async () => {
//     const conn = getConnection();
//     await conn.close();
// });


global.beforeAll(async () => {
    const content = "DB_NAME=test.sqlite\nJWT_SECRET=SECRET\n";
    try {
        await writeFile(join(__dirname, '..', '.env.test', content));
    } catch(err) {}
})

global.afterAll(async () => {
    try {
        await rm('../.env.test');
    } catch(err) {}
})

