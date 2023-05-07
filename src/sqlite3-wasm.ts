// This file should implement the API defined here:
// https://github.com/TryGhost/node-sqlite3/wiki/API

// It should create a web worker and the implementation of the API should pass messages to that
// worker which should fulfill the request and pass the result back as another message.

export function verbose() {}

type Callback = (err: Error | null) => void;

enum CommandName {
    Open = "Open",
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
    private workerState: WorkerState = WorkerState.Stopped;
    private worker;
    private commandSerial: number = 0;

    constructor(filename: string, mode: any, _callback?: Callback) {
        this.worker = new Worker(new URL('worker.js', import.meta.url), { type: 'module' });

        this.worker.addEventListener('message', ({ data }) => {
            console.log(`Received message from worker: ${data}`);
            if (data === 'ready' && this.workerState === WorkerState.Stopped) {
                this.workerState = WorkerState.Started;
            }

            if (this.workerState === WorkerState.Started) {
                const nextCommand = this.queue.shift();
                if (nextCommand) {
                    this.worker.postMessage(nextCommand);
                }
            }
        });

        this.worker.addEventListener('error', (err) => {
            console.log(`Received error from worker: ${err}`);
        });

        this.worker.addEventListener('messageerror', (event) => {
            console.log(`Received message error from worker: ${event}`);
        });

        this.enqueueCommand({
            command: CommandName.Open,
            serial: this.commandSerial,
            args: {
                filename,
                mode,
            }
        });
    }

    private enqueueCommand(command: Command) {
        this.queue.push(command);
        this.commandSerial++;
    }

    close(_callback: Callback) {}
    configure(_option: any, _value: any) {}
    run(_sql: string, ..._params: any[]) {}
    get(_sql: string, ..._params: any[]) {}
    all(_sql: string, ..._params: any[]) {}
    each(_sql: string, ..._params: any[]) {}
    exec(_sql: string, _callback?: Callback) {}
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
