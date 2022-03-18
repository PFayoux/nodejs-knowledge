# Commonjs

## The first module ecosystem of Node.js

Common.js has been created to provide a unified way of defining module in javascript and it has been the first specification of module use in Node.js before it add the possibility to use the EcmaScript Module.

## Syntax

To define Common.js module, you will need to use the expression `module.exports` and `exports` that will be use to which attribute of your module will be available publicly by other modules that import it.

To import a module you will need to use the `require` method, that takes in parameters the path to the module you want to import.

Let's see an example :

```
// log.js

// import promises from the module fs
const { promises } = require('fs')

// define a private attribute unaccessible to other modules
const logPath = process.env.path || "./message.log"

// export the levels
exports.levels = {
  debug: "Debug",
  info: "Info",
  warn: "Warning",
  error: "Error"
}

// export the log method
exports.log = async (message, level) => {
  await promises.appendFile(logPath, `${level} : ${message}`)
}

// default export
module.exports = {
  debug: (message) => log(message, levels.debug),
  info: (message) => log(message, levels.info),
  warn: (message) => log(message, levels.warn),
  error: (message) => log(message, levels.error)
}
```

 - `const { promises } = require('fs')` is used to import the `promises` attributes of the module `fs`.
 - The `logPath` constant will not be accessible to other module that might import our module, because we don't export it.
 - The `levels` and `log` are exported through `exports` which means they will not be exported as default attribute of the module, to import them the developer will need to do `const {levels, log} = require('./log.js')`.
  - In `module.exporst` we define the default exported attribute of our module, they can be imported doing `const log = require('./log.js)`.


## Circular Dependency

Common.js will have trouble if you have circular dependency between your modules. 

```
moduleA :
{ loading: true, b: { loading: true, a: { loading: false } } }

 moduleB :
{ loading: true, a: { loading: false } }
```
