 # EcmaScript Module

 ## 

 ## Syntax

 Instead of `require`, `module.exports` and `exports` like it is for Common.js, ECMAScript Module use `import`, `import ... from ...` to import modules, and `export` to expose attributes, but ECMAScript add a new way of exposing attributes with the concept of default export.

Let's see an example. We will take the same module has before but this time we will use ECMAScript Module syntax :

```
// log.js

import { promises } from 'fs'

const logPath = process.env.path || "./message.log"

const levels = {
  debug: "Debug",
  info: "Info",
  warn: "Warning",
  error: "Error"
}

export const log = async (message, level) => {
  await promises.appendFile(logPath, `${level} : ${message}`)
}

export default = {
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
```
exports.attribute = 'my_attribute_value'

module.exports = {
  otherAttribute: 'other_attribute_value'
}
```

When executing the code below, the module will not export anything because we are just changing the reference of `exports`
```
exports.objectAttribute = {
  anyAttribute: 'any_attribute_value'
}
```

 ## Circular Dependency
