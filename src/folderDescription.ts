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
