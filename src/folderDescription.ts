const NEWLINE = '\r\n'

export default function toTurtle(fileNames: Array<string>) : string {
  console.log('folderDescription', fileNames)

  const prefixes = [
    '@prefix ldp: <http://www.w3.org/ns/ldp#>.',
  ]
  const memberRefs = fileNames.map(filename => `<${filename}>`)
  const containerItem = [
    `<http://localhost:8080>`,
    `    ldp:contains ${memberRefs.join(', ')};`
  ].join(NEWLINE)
  return [
    prefixes.join(NEWLINE),
    containerItem,
  ].join(NEWLINE + NEWLINE) + NEWLINE
}

function toJsonLd(fileNames: Array<string>) : string {
  return JSON.stringify({
    "@id":"http://localhost:8090/",
    "contains":"http://localhost:8090/1c8054ae-14c8-4773-8c8a-a5472d086ea9",
    "@context":{
      "contains":{
        "@id":"http://www.w3.org/ns/ldp#contains",
        "@type":"@id"
      },
      "ldp":"http://www.w3.org/ns/ldp#",
    }
  })
}
