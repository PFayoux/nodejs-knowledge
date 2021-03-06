# Commonjs

## The first module system of Node.js

The CommonJS specification has been created to define a module system for JavaScript in browserLess environments. Node.js implemented this specification to provide a first module system before the ECMAScript modules specification existed.

## Syntax

The concept behind a module is that it can import other modules and expose some attributes like functions, variables, objects... In CommonJS, we will use `require` to import other modules and `module.exports` or `exports` to expose attributes. Any code not assigned to `module.exports` or `exports` will remain private.

Let's see an example :

```javascript
// log.js

const { promises } = require('fs')

const logPath = process.env.path || "./message.log"

const levels = {
  debug: "Debug",
  info: "Info",
  warn: "Warning",
  error: "Error"
}

const log = async (message, level) => {
  await promises.appendFile(logPath, `${level} : ${message}`)
}

module.exports = {
  debug: (message) => log(message, levels.debug),
  info: (message) => log(message, levels.info),
  warn: (message) => log(message, levels.warn),
  error: (message) => log(message, levels.error)
}
```

 - `const { promises } = require('fs')` is used to import the `promises` object of the module `fs`.
 - The `logPath`, `levels`, and `log` will not be accessible to other modules that might import our module because we don't export them.
 - In `module.exports`, we define the exported attribute of our module.

`exports` is a reference to `module.exports`, so beware when you are using it because there are a couple of things that will not work, e.g. :

When executing the code below, the `module.exports` will override the attribute set with `exports`, only `otherAttribute` will be exported.

```javascript
exports.attribute = 'my_attribute_value'

module.exports = {
  otherAttribute: 'other_attribute_value'
}
```

When executing the code below, the module will not export anything because we are just changing the reference of `exports`

```javascript
exports.objectAttribute = {
  anyAttribute: 'any_attribute_value'
}
```

## Loading modules asynchronously

As we saw, in CommonJS `require`, `module.exports`, and `exports` can be called whenever you want. It means that you can `require` a module at any time in the code or even load it asynchronously.

For example, you could require a module inside the core of a method :

```javascript
function my_method () {
  const myModule = require('my-module')
  ...
}
```

A module could export a promise, which mean it should be loaded asynchronously.

For example, we could define a asynchronous module like this : 

```javascript
async function createModuleAttributes () { 
  return Promise.resolve({
    anyAttribute: 'any_attribute_value'
  })
}
```

It would be loaded like this :

```javascript
require('my-module').then(myModule => {
  myModule.anyAttribute
  ...
})
```

Or inside an async method :

```javascript
async function myAsyncMethod () {
  const myModule = await require('my-module')
  ...
}
```

## Circular Dependency

With CommonJS, modules are loaded at the execution of the file. 

For example, if we have a *main.js* file like this : 


```javascript
const module1 = require(./module1.js)

// do any code

```

1. it will first call `require(./module1)`
2. then it will execute the code from *module1.js*
3. when *module1.js* will have finished, it will return its `module.exports`
4. it will define a `const module1` that will be a reference to the `module.exports` from *module1.js*
10. it will continue code execution, which can be another `require`

The method `require` will keep a cache to avoid loading twice the same module, and this also avoids having an infinite loop in case of circular dependency. The cache can be accessed through `require.cache`.

However, with CommonJS, circular dependency will still not be resolved correctly. You can look at the example in the folder *code_example/circular_dependency/commonjs*. If you try to run it with `nodejs index.js`, you will see the following result : 

```javascript
moduleA :
{ loading: true, b: { loading: true, a: { loading: false } } }

 moduleB :
{ loading: true, a: { loading: false } }
```

When requiring the *moduleA* the first time in *index.js*, everything exported before the `require('./moduleB')` will be set in the cache. 

In this case, it will be `{ loading: false }`, so when *moduleA* is requiring *moduleB*, *moduleB* can only see this attribute when requiring *moduleA*.

After *moduleB* has finished its execution, the cache will store the following attributes for the *moduleB* exports : 

```javascript
{ loading: true, a: { loading: false } }
```

This is what *moduleA* will get for *moduleB*.

When *moduleA* is finishing its execution, it replaces its `module.exports` with a new set of attributes containing the *moduleB* in cache : 

```javascript
{ loading: true, b: { loading: true, a: { loading: false } } }
```

The cache for *moduleA* or *moduleB* will never be updated after that. Any other modules requiring those will always receive the attributes stored in the cache.

Learn more at [documentation of CommonJS modules](https://nodejs.org/api/modules.html#modules-commonjs-modulesNode.js)
