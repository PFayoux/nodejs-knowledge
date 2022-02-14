# The reactor pattern

## I/O operation

I/O operations are known to be the slowest among the fundamental operations of a computer. Because accessing data on a disk cost much more than accessing the intern memory of a processor or accessing the RAM.

## Blocking I/O

Doing blocking I/O means that when a thread do an I/O request it will block until the operation has completed preventing it to do any other job during this time.

## Non-blocking I/O

Another way is using Non-blocking I/O, here when doing an I/O request, the operating system will return immediately a predefined constant indicating there is no data available to return at that moment, and when the data will be ready it will return it.

A simple way to deal with this is to do **busy-waiting**, as long as the data isn't available for the I/O operation the thread will do some job and retry later to see if the data has been available.

For example : 

```
files = [fileA, fileB, fileC]
while(!files.isEmpty()) {
  for(file of files) {
    // try to read the file
    content = file.read()
    if (content === NO_DATA_AVAILABLE) {
      // there is no data to read at the moment
      continue
    }
  
    if (data === FILE_CLOSED) {
       // the file has been closed, remove if from the list
       files.remove(file)
    } else {
      // some content was received, process it
      consume(file)
    }
  }
}
```

The problem, with this approach is that the thread will consume a lot of CPU for iterating over resources (files) waiting for them to be accessible. Polling algorithms usually result in a huge amount of wasted CPU time.


## Event demultiplexing

A synchronous event demultiplexer will watch for multiple resources and return a new set of events when a read or write operations over one of those resources compeletes.  Which means that when a resource is ready to be read or write, the synchronous event demultiplexer will return a new set of events, so any new operations can be done on this available resource.

Example of an algorithm using the synchronous event demultiplexer :

```
watchedResources.add(socket, FOR_READ)
watchedResources.add(file, FOR_READ)

// wait for resources to be available, and return events when operations have finished
while(events = demultiplexer.watch(watchedResources)) {
  // event loop
  for (event of events) {
    // this read will never block because at that time we know the resource is available
    data = event.resource.read()
    if (data === Resource_CLOSED) {
      // the resource was closed, removed it from watched list
      demultiplexer.unwatch(event.resource)    
    } else {
      // data was received, process it
      consume(data)
    }
  }
}
```

That way we can manage I/O operation without blocking the thread, or doing **busy-waiting** and we can manage multiple I/O tasks concurrently.

## The reactor pattern

The reactor pattern is reproducing the same behaviour of the previous algorithm, but it would associate for each event an handler (or callback).
The handler will be invoked as soon as an event is produced, and it will be processed by the event loop.

If we look back at our previous example it would mean calling `event.callback(data)` instead of the `consume(data)`.

![Reactor pattern schema](./image/reactor-pattern.svg)

## Libuv

**Libuv** is the I/O engine of node.js and it implement the reactor pattern. Since operating systems have different way to deal with I/O operations, **Libuv** was created to have a reliable and consistent way to manage I/O operation disregarding the operating system it is running on.

Learn more at nodejsdp.link/uvbook


*This content and it's example were inspired from **Node.js Design Patterns** written by Mario Casciaro and Luciano Mammino
