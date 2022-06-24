# Streams in Node.js

## Why Stream are nice TL;DR

When consuming data in a programming language, you have two differents apparoach : 
- Either you read all the data at once, load it in your memory and then process it, but then that means that your process could take a lot of memory.
- Either you read chunk of data per chunk of data, and manage to process it chunk by chunk, that way the memory usage will not exceed the size of a chunk.

Those two different apparoach are Buffer versus Stream. A Stream will enable reading data from a source and/or writing in a source chunk by chunk.

What make streams very powerful is that they can read chunk of data from any resources including Javascript object.

In this article we will present the different base abstract classes available in the `stream` core module.

## Readable Stream

`Readable` is the abstract classes that enable the creation of a `Readable` stream which allow reading from a resource.
There is two apparoaches to receive data from a `Readable` stream` the **non-flowing** and the **flowing** mode.

### Non-flowing mode

By default the **non-flowing** mode (or **pause** mode) is used. When there is data available to read, the stream will send a `'redable'` event. We can then attach a listener to listen to this `'readable'` event and then read in a loop the data present in the internal buffer of the stream until it's emptied. This buffer can be read synchronously by using the `read()` method. It will returns a `Buffer` object representing the chunk of data.

E.g :

```javascript
import { createReadStream } from 'fs'
  
const readable = createReadStream("input.txt");
  
readable.on('readable', () => {
  let chunk;

  while (null !== (chunk = readable.read())) {
    console.log(`read: ${chunk}`);
  }
});
  
console.log("Done...");
```

### Flowing mode


### Using async iterator 

### Readable steams from iterable

### Implementing Readable streams


## Writable Stream

## Duplex Stream

## Transform Stream

## Passthrough Stream
