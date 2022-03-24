# Commonjs

## The first module system of Node.js

The Common.js specification has been created to define a module system for JavaScript in browserLess environments. Node.js implemented this specification to provide a first module system, before the ECMAScript modules specification was created and then implemented by Node.js starting from version 13.2 .

## Syntax

The concept behind a module is that it can load other module, and for this in common.js we will use the method `require`, and it can expose some content like function, variable, object ... for this we will use `module.exports` or `exports`. Any code which is not assigned to any of `module.exports` or `exports` will remain private.

Let's see an example :

```
// log.js

const { promises } = require('fs')

const logPath = process.env.path || "./message.log"

levels = {
  debug: "Debug",
  info: "Info",
  warn: "Warning",
  error: "Error"
}

log = async (message, level) => {
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
 - The `logPath`, `levels` and `log` will not be accessible to other module that might import our module, because we don't export them.
 - In `module.exports` we define the exported attribute of our module`.

`exports` is a reference to `module.exports` so beware when you are using it, because there is a couple things that will not work, e.g. :

When executing the code below, the `module.exports` will override the attribute set with `exports`, so only `otherAttribute` will be exported.
```
exports.attribute = 'my_attribute_value'

module.exports = {
  otherAttribute: 'other_attribute_value'
}
```

When executing the code below, the module will not export anything, because we are just changing the reference of `exports`
```
exports.objectAttribute = {
  anyAttribute: 'any_attribute_value'
}
```

## Circular Dependency

In the specification of Common.js module are loaded at execution of file. 

So for example if we have a *main.js* file like this : 
```
const module1 = require(./module1.js)

// do any code

```

1. it will first call `require(./module1)`
2. then it will execute the code from *module1.js*
3. when *module1.js* will have finish it will return it's `module.exports`
4. it will define a `const module1` that will be a reference to `module.exports` from *module1.js*
10. it will continue code execution, which can be other `require`

When running a `require` a cache will be keept to avoid loading twice the same module, and this also avoid having an infinite loop in case of circular dependency. The cache can be accessed with `require.cache`.

However cicurlar dependency will still not be resolved correctly. You can have a look at the example in the folder *code_example/commonjs*, if you try to run it with `nodejs index.js`, you will see the following result : 

```
moduleA :
{ loading: true, b: { loading: true, a: { loading: false } } }

 moduleB :
{ loading: true, a: { loading: false } }
```

The reason is that when requiring the *moduleA* the first time in *index.js*, everything that is exported before the `require('./moduleB')` will be set in the cache. In this case it's the `{ loading: false }̀  , so when *moduleA* is requiring *moduleB*, *moduleB* can only see the values set in the cache. When *moduleA* will finish it's first execution, it then replace it's `module.exports` with a new object, but the cache will still point to the original one, and it's value will not be updated.

Learn more at [https://nodejs.org/api/modules.html#modules-commonjs-modules](Node.js documentation of Common.js modules)