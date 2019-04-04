import * as Stream from 'stream';

// Based on Ruben Verborgh's https://github.com/RubenVerborgh/solid-server-ts/blob/master/src/ldp

/**
 * A representation of a resource.
 */
export default interface IRepresentation extends Stream.Readable {
}
