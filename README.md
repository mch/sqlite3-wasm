# SQLite Client for Browser Apps

> A wrapper library around WASM builds of SQLite and SQLCipher that is compatible with the [sqlite3](https://github.com/mapbox/node-sqlite3/) API.

The goal here is to provide a nicer way of working with SQLite WASM that is compatible with other node libraries like [sqlite](https://www.npmjs.com/package/sqlite), which although it is intended for Node.js, is a nice API that should hopefully work in the browser as well with this library through its [custom driver functionality](https://github.com/kriasoft/node-sqlite#with-a-custom-driver).

This library wraps the web worker version of the SQLite WASM build, enabling the use of the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) to store databases in the Origin Private File System (OPFS). See [SQLite Wasm in the browser backed by the Origin Private File System](https://developer.chrome.com/blog/sqlite-wasm-in-the-browser-backed-by-the-origin-private-file-system/) for an example.

Since the use of the OPFS requires HTTPS, a Caddyfile is provided to set the appropriate headers when using Caddy as a reverse proxy in front of vite.

## Browser Support
This works best in Chrome for now. There seem to be incompatibilities or unimplemented features in Firefox that prevent this from working.

## Run Sample program
In one terminal, start vite:
```
npm run dev
```

In another start caddy:
```
caddy run
```

Access the test page here: https://localhost:8443/

You may have to allow your browser to accept the self signed certificate.

## Run Tests
The tests use an experimental feature of vitest to run in an actual browser, since this library depends on some pretty new features.
```
npm run test
```
