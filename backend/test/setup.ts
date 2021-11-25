import { rm, writeFile } from 'fs.promises'
import { join } from 'path'

// beforeAll(async () => {
//     const content = "DB_NAME=test.sqlite\nJWT_SECRET=SECRET";
//     try {
//         await writeFile(join(__dirname, '..', '.env.test'), content);
//     } catch(err) {}
// });

afterAll(async () => {
    try {
        await rm(join(__dirname, '..', '.env.test'));
    } catch(err) {}
});