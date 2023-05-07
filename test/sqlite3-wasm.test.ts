import { describe, it, expect } from 'vitest';

import { Database } from '../src/sqlite3-wasm';

describe('sqlite3-wasm', () => {
    it('does something cool', async () => {
        let db;
        await new Promise((resolve, reject) => {
            db = new Database(':memory:', undefined, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(null);
                }
            });
        });
        await new Promise((resolve, reject) => {
            db.exec('create table foo(id int, desc text);', resolve);
        });
        expect(true).to.be.true;
    });
});
