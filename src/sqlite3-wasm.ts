// This file should implement the API defined here:
// https://github.com/TryGhost/node-sqlite3/wiki/API

// It should create a web worker and the implementation of the API should pass messages to that
// worker which should fulfill the request and pass the result back as another message.
const worker = new Worker(new URL('worker.js', import.meta.url), { type: 'module' });

export function verbose() {}

type Callback = (err: Error | null) => void;
type CommandCallback = (err: Error | null, result: any) => void;

enum CommandName {
    IsReady = "IsReady",
    Open = "Open",
    Close = "Close",
    Exec = "Exec",
}

interface Command {
    command: CommandName,
    serial: number,
    args: any,
}

enum WorkerState {
    Stopped,
    Started,
}

export class Database {
    private queue: Command[] = [];
    private callbacks: Map<number, CommandCallback> = new Map();
    private workerState: WorkerState = WorkerState.Stopped;
    private commandSerial: number = 1;
    private dbId?: number;

    constructor(filename: string, mode?: any, callback?: Callback) {
        worker.addEventListener('message', ({ data }) => {
            console.log(`Received message from worker: ${JSON.stringify(data)}`);
            if (data.command === 'IsReady' && data.result && this.workerState === WorkerState.Stopped) {
                this.workerState = WorkerState.Started;
            }

            console.log(`checking for callback for command serial ${data.serial}`);
            const callback = this.callbacks.get(data.serial);
            if (callback) {
                callback(data.error, data.result);
            }

            if (this.workerState === WorkerState.Started) {
                const nextCommand = this.queue.shift();
                if (nextCommand) {
                    worker.postMessage(nextCommand);
                }
            }
        });

        worker.addEventListener('error', (err) => {
            console.log(`Received error from worker: ${err}`);
        });

        worker.addEventListener('messageerror', (event) => {
            console.log(`Received message error from worker: ${event}`);
        });

        this.enqueueCommand(CommandName.IsReady, {}, (err: Error | null, result: any) => {
            if (err) {
                console.log(`Failed to check if SQLite worker is ready: ${err}`);
                return;
            }
            if (!result) {
                console.log(`SQLite worker is not ready.`);
                return;
            }
            this.enqueueCommand(CommandName.Open, {
                filename,
                mode,
            }, (err, result) => {
                if (err) {
                    console.log(`Failed to open database: ${err}`);
                    return;
                }
                this.dbId = result;
                if (callback) {
                    callback(null);
                }
            });
        });
    }

    private enqueueCommand(commandName: CommandName, args: any, callback?: CommandCallback) {
        this.queue.push({
            command: commandName,
            serial: this.commandSerial,
            args,
        });
        if (callback) {
            console.log(`Recording callback for command serial ${this.commandSerial}`);
            this.callbacks.set(this.commandSerial, callback);
        }
        this.commandSerial++;
    }

    close(_callback: Callback) {}
    configure(_option: any, _value: any) {}
    run(_sql: string, ..._params: any[]) {}
    get(_sql: string, ..._params: any[]) {}
    all(_sql: string, ..._params: any[]) {}
    each(_sql: string, ..._params: any[]) {}
    exec(sql: string, callback?: Callback) {
        this.enqueueCommand(CommandName.Exec, {
            sql,
            dbId: this.dbId,
        }, callback);
    }
    prepare(_sql: string, ..._params: any[]) {}
    map(_sql: string, _callback?: Callback) {}
    loadExtension(_path: string, _callback?: Callback) {}
    interrupt() {}
}

export class Statement {
    bind(..._params: any[]) {}
    reset(_callback?: () => void) {}
    finalize(_callback?: () => void) {}
    run(..._params: any[]) {}
    get(..._params: any[]) {}
    all(..._params: any[]) {}
    each(..._params: any[]) {}
    map(_sql: string, _callback: Callback) {}
}
