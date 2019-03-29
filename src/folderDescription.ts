export default function toTurtle(fileNames: Array<string>) : string {
  return `@prefix : <#>.
@prefix pub: <>.
@prefix ldp: <http://www.w3.org/ns/ldp#>.
@prefix terms: <http://purl.org/dc/terms/>.
@prefix XML: <http://www.w3.org/2001/XMLSchema#>.
@prefix test: <test/>.
@prefix st: <http://www.w3.org/ns/posix/stat#>.

`
  fileNames.map(filename => `${filename}:
    a ldp:BasicContainer, ldp:Container;
    terms:modified "2018-11-02T11:42:41Z"^^XML:dateTime;
    ldp:contains test:;
    st:mtime 1541158961.318;
    st:size 4096.
`).join('\r\n')
}
