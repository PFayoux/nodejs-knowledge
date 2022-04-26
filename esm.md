# EcmaScript Module

## 

## Syntax

Instead of `require`, `module.exports` and `exports` like it is for Common.js, ECMAScript Module use `import ... from ...` to import modules, and `export` to expose attributes, but ECMAScript add a new way of exposing attributes with the concept of default export.

Let's see an example. 

If we take the previous example, to import the `fs` module we could do the following : 

```javascript
import fs from 'fs'
```

```javascript
import * as fs from 'fs'
```

```javascript
import { promises } from 'fs'
```

```javascript
const fs = await import('fs')
```

To expose the attributes, if we wanted our module to have the same behaviour as the common.js definition, we would do this instead of the `module.exports` :

```javascript
  export {
    debug: (message) => log(message, levels.debug),
    info: (message) => log(message, levels.info),
    warn: (message) => log(message, levels.warn),
    error: (message) => log(message, levels.error)
  }
```

Or this would do also the same

```javascript
  export const debug = (message) => log(message, levels.debug)
  export const info = (message) => log(message, levels.info)
  export const warn = (message) => log(message, levels.warn)
  export const error = (message) => log(message, levels.error)
```

This is what we call the "named export" in ESM, and this is what is done in Common.js.

ECMAScript introduce another type of export called "default export" which doesn't exist in Common.js. 

```javascript
const debug = (message) => log(message, levels.debug)
const info = (message) => log(message, levels.info)
const warn = (message) => log(message, levels.warn)
const error = (message) => log(message, levels.error)

const moduleExport = {
  debug
  info
  warn
  error
}

export default moduleExport
```

We can mixe named export and default export : 

```javascript
export const debug = (message) => log(message, levels.debug)
export const info = (message) => log(message, levels.info)
export const warn = (message) => log(message, levels.warn)
export const error = (message) => log(message, levels.error)

const moduleExport = {
  debug
  info
  warn
  error
}

export default moduleExport
```

 ## Circular Dependency
