import { createReadStream } from 'fs'
  
const readable = createReadStream("input.txt");

readable.on('readable', () => {
  let chunk;
  
  while (null !== (chunk = readable.read())) {
  
    console.log(`read: ${chunk}`);
  }
});
  
console.log("Done...");