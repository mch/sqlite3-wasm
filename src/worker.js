import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

const log = (...args) => console.log(...args);
const error = (...args) => console.error(...args);

const start = function (sqlite3) {
    // Your SQLite code here.
};

log('Loading and initializing SQLite3 module...');
sqlite3InitModule({
    print: log,
    printErr: error,
}).then((sqlite3) => {
    log('Worker done initializing.');
    onmessage = (event) => {
        console.log('Worker received message: ');
        console.log(event.data);

        if (event.data.command === 'Open') {
            // TODO if a filename other than :memory: is used and OPFS is not available, error out.

            log('Running SQLite3 version', sqlite3.version.libVersion);
            let db;
            if ('opfs' in sqlite3) {
                db = new sqlite3.oo1.OpfsDb('/mydb.sqlite3');
                log('OPFS is available, created persisted database at', db.filename);
            } else {
                db = new sqlite3.oo1.DB('/mydb.sqlite3', 'ct');
                log('OPFS is not available, created transient database', db.filename);
            }
        }

        postMessage({
            command: event.data.command,
            serial: event.data.serial,
            error: null,
        });
    };

    postMessage('ready');
});


