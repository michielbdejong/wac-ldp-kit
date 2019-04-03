import * as Stream from 'stream'
import IRepresentation from './IRepresentation'

const NEWLINE = '\r\n'

function stringToStream ( text: string ) : Stream {
  const stream = new Stream.Readable()
  stream._read = () => {}
  stream.push(text)
  stream.push(null)
  return stream
}

function toTurtle (containerUrl: string, fileNames: Array<string>) : string {
  console.log('folderDescription', fileNames)

  const prefixes = [
    '@prefix ldp: <http://www.w3.org/ns/ldp#>.',
  ]
  const memberRefs = fileNames.map(filename => `<${filename}>`)
  const containerItem = [
    `<${containerUrl}>`,
    `    ldp:contains ${memberRefs.join(', ')};`
  ].join(NEWLINE)
  return [
    prefixes.join(NEWLINE),
    containerItem,
  ].join(NEWLINE + NEWLINE) + NEWLINE
}

function toJsonLd (containerUrl: string, fileNames: Array<string>) : string {
  return JSON.stringify({
    "@id": containerUrl,
    "contains": fileNames.map(fileName => containerUrl + fileName),
    "@context":{
      "contains":{
        "@id":"http://www.w3.org/ns/ldp#contains",
        "@type":"@id"
      },
      "ldp":"http://www.w3.org/ns/ldp#",
    }
  })
}

export default function toFolderDescription (containerUrl, fileNames, headers): IRepresentation {
  console.log(headers)
  const contentType = 'application/ld+json'
  console.log('toFolderDescription', containerUrl, fileNames, contentType)
  if (contentType === 'application/ld+json') {
     return {
       body: stringToStream(toJsonLd(containerUrl, fileNames)),
       contentType: 'application/ld+json'
     } as IRepresentation
  } else {
    return {
      body: stringToStream(toTurtle(containerUrl, fileNames)),
      contentType: 'text/turtle'
    } as IRepresentation
  }
}
