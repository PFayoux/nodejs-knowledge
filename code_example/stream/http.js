import {Readable} from 'stream'

const response = await fetch('https://jolimoi.com')

const readableStream = new Readable(response.body)

readableStream.on('readable', () => { 
  let chunk
  console.log('New data available')
  while((chunk = readableStream.read()) !== null) {
    console.log(
      `Chunk read : ${chunk.length} bytes: "${chunk.toString()}"`
    )
  }
})