import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

// TODO make this typescript

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
    log('Running SQLite3 version', sqlite3.version.libVersion);

    let db;
    onmessage = (event) => {
        console.log('Worker received message: ');
        console.log(event.data);
        const { command, args } = event.data;

        // TODO a single worker, multiple databases?
        switch(command) {
        case 'Open':
            openDatabase(args.filename, args.mode);
            break;
        case 'Exec':
            exec(args.sql);
            break;
        }

        // Respond
        postMessage({
            command: event.data.command,
            serial: event.data.serial,
            error: null,
        });

        // Command handlers
        function openDatabase(filename, mode) {
            // TODO if a filename other than :memory: is used and OPFS is not available, error out.
            if ('opfs' in sqlite3) {
                db = new sqlite3.oo1.OpfsDb(filename);
                log('OPFS is available, created persisted database at', db.filename);
            } else {
                db = new sqlite3.oo1.DB(filename, 'ct');
                log('OPFS is not available, created transient database', db.filename);
            }
        }

        function exec(sql) {
            db.exec(sql);
        }
    };

    postMessage('ready');
});
