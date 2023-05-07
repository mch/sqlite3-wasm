import { describe, it, expect } from 'vitest';

import { Database } from '../src/sqlite3-wasm';

describe('sqlite3-wasm', () => {
    it('does something cool', async () => {
        await new Promise((resolve, reject) => {
            const db = new Database(':memory:', undefined, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(null);
                }
            });
        });
        expect(true).to.be.true;
    });
});
