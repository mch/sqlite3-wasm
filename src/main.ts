import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

import { Database, Statement } from './sqlite3-wasm';

const db = new Database('test.db', null, (err) => {
    console.log(`Database constructor callback called with err: ${err}`);
    db.exec('create table foo(id int, desc text);', (err) => {
        console.log(`created table, ${err}`);
        db.exec('insert into foo values(1, \'potato\');', (err) => {
            console.log(`inserted row ${err}`);
        });
    })
});

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
