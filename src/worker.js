import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

// TODO make this typescript

const log = (...args) => console.log(...args);
const error = (...args) => console.error(...args);

let sqlite3 = null;
let openDatabases = {};
let nextOpenDatabaseId = 0;
onmessage = (event) => {
    console.log('Worker received message: ');
    console.log(event.data);
    const { command, args } = event.data;

    // TODO a single worker, multiple databases?
    let result = null;
    let error = null;
    try {
    switch(command) {
    case 'IsReady':
        result = !!sqlite3;
        break;
    case 'Open':
        result = openDatabase(args.filename, args.mode);
        break;
    case 'Exec':
        exec(args.sql, args.dbId);
        break;
    }
    }
    catch (err) {
        error = err;
    }
    
    // Respond
    postMessage({
        command: event.data.command,
        serial: event.data.serial,
        error,
        result,
    });

    // Command handlers
    function openDatabase(filename, mode) {
        // TODO if a filename other than :memory: is used and OPFS is not available, error out.
        let db;
        if ('opfs' in sqlite3) {
            db = new sqlite3.oo1.OpfsDb(filename);
            log('OPFS is available, created persisted database at', db.filename);
        } else {
            db = new sqlite3.oo1.DB(filename, 'ct');
            log('OPFS is not available, created transient database', db.filename);
        }
        const dbId = nextOpenDatabaseId;
        openDatabases[nextOpenDatabaseId] = db;
        nextOpenDatabaseId++;
        return dbId;
    }

    function exec(sql, dbId) {
        const db = openDatabases[dbId];
        if (!db) {
            console.log(`Exec called on database id that is not open!`);
            return;
        }
        db.exec(sql);
    }
};

log('Loading and initializing SQLite3 module...');
sqlite3InitModule({
    print: log,
    printErr: error,
}).then((sqlite) => {
    sqlite3 = sqlite;
    log('Worker done initializing.');
    log('Running SQLite3 version', sqlite3.version.libVersion);
    postMessage({
        command: 'IsReady',
        serial: 0,
        error: null,
        result: true,
    });
});
