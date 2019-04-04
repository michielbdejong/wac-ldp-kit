/**
 * An identifier of a resource.
 */

// Based on Ruben Verborgh's https://github.com/RubenVerborgh/solid-server-ts/blob/master/src/ldp

export default interface IResourceIdentifier {
  path: string;
  domain: string;
  isAcl: boolean;
}
