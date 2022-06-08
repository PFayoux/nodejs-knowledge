# EcmaScript Module

## The second module system of Node.js

ECMAScript Module (ESM) has been created after CommonJS and solve most of the issue CommonJS had.

## Syntax

Instead of `require`, `module.exports` and `exports` like it is for CommonJS, ECMAScript Module use `import ... from ...` to import modules, and `export` to expose attributes, but ECMAScript Module add a new way of exposing attributes with the concept of default export.

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

To expose our logger methods, if we wanted our module to have the same behaviour as the CommonJS definition, we would do this instead of the `module.exports` :

```javascript
  export {
    debug: (message) => log(message, levels.debug),
    info: (message) => log(message, levels.info),
    warn: (message) => log(message, levels.warn),
    error: (message) => log(message, levels.error)
  }
```

Or this would do also the same :

```javascript
  export const debug = (message) => log(message, levels.debug)
  export const info = (message) => log(message, levels.info)
  export const warn = (message) => log(message, levels.warn)
  export const error = (message) => log(message, levels.error)
```

This is what we call the "named export" in ECMAScript Module, and this is what is done in CommonJS.

ECMAScript Module introduce another type of export called "default export" which doesn't exist in CommonJS. 

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

## Loading modules asynchronously

With ECMAScript Module `import ... from ...` will be resolved before any execution of file. So it can't be used to load a module during the execution, for example if you want to load a module conditionally or asynchronously.

To load a module at execution time, you can use the `import` method, it very similar to `require` in CommonJS. Furthermore ECMAScript Module add the possibilty to use `await` directly in the global scope, so it makes thing much more elegant if you need to deal with asynchronous module.

For example, you could do : 

```javascript
const myModule = await import('my-module')
```

 ## Circular Dependency

The strengh of ECMAScript Module is that it solves the issue CommonJS had with circular dependency.

If you look at the example in the folder *code_example/circular_dependency/esm*, you will see we do the same circular dependency between `moduleA` and `moduleB`.

If you execute the code, you will see the following : 

```bash
moduleA :
<ref *1> [Module: null prototype] {
  b: [Module: null prototype] { a: [Circular *1], loading: true },
  loading: true
}

 moduleB :
<ref *1> [Module: null prototype] {
  a: [Module: null prototype] { b: [Circular *1], loading: true },
  loading: true
}
```

What we see here is that both modules are correctly resolved, the `loading` property are correctly setted to `true`. 

We can see that for `ModuleA` and `ModuleB` the circular dependency has been detected and for `a` witin `ModuleA.b` is an actual reference to the `ModuleA` in the current scope. That's why it is marked with `a: [Circular *1]`.

Also trying to use `JSON.stringify()` to serialize the module would not work because of this reference.

To understand how ECMAScript Module resolve modules here are the following steps of the process :

 1. Construction (or parsing) : Recursively read all imported modules files. Basically looks at all the `import` that has been made starting from the source file and recursively go deeper into the dependencies.

 2. Instantiation : Create a named reference in memory for all entities which are exported. Also create a reference for each `export` and `import` statement and track relationship between them (**linking**). Still no JS code has been executed yet.

 3. Evaluation : Node.js finally execute the code so all entities are properly setted.

 After those three steps modules are correctly loaded and the program can execute properly.

