import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe.skip(`SQLite worker messaging protocol`, () => {

    let worker;

    beforeAll(async () => {
        console.log('loading worker');
        worker = new Worker(new URL('worker.js', import.meta.url), { type: 'module' });
        console.log('waiting for worker to be ready');
        worker.onmessage = (msg) => {
            console.log(`message: ${msg}`);
        }
        // await new Promise((resolve, reject) => {
        //     const readyHandler = (message) => {
        //         console.log(`go message`);
        //         if (message === 'ready') {
        //             worker.removeEventListener(readyHandler);
        //             resolve(null);
        //         }
        //     };
        //     worker.addEventListener('message', readyHandler);
        // });
    });

    afterAll(() => {
        console.log(`Terminating worker`);
        worker.terminate();
        console.log(`Worker terminated.`);
    });

    it('emits a ready message after loading sqlite', async () => {
        // TODO the same worker is shared between this file and the other test file right now...
        const messageData = new Promise((resolve) => {
            worker.addEventListener('message', (message) => {
                console.log('message');
                console.log(message);
                resolve(message.data);
            });
        });
        worker.postMessage({
            command: 'Open',
            serial: 0,
            args: {
                filename: 'test.db',
            }
        });
        expect(await messageData).to.eql('ready');
    })
});

