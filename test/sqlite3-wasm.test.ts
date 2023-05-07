import { describe, it, expect } from 'vitest';

import { Database } from '../src/sqlite3-wasm';

describe('sqlite3-wasm', () => {
    it('does something cool', async () => {
        let db;
        console.log(`waiting to open database`);
        await new Promise((resolve, reject) => {
            db = new Database(':memory:', undefined, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(null);
                }
            });
        });
        console.log(`watiging for exec`);
        await new Promise((resolve, reject) => {
            db.exec('create table foo(id int, desc text);', (err, result) => {
                console.log(`ummm, err: ${err}, result: ${result}`);
                resolve();
            });
        });
        expect(true).to.be.true;
    });
});
