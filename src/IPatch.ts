import IRepresentation from './IRepresentation';

// Based on Ruben Verborgh's https://github.com/RubenVerborgh/solid-server-ts/blob/master/src/ldp

/**
 * A patch describes modifications to a resource.
 */
export default interface IPatch {
  apply(representation: IRepresentation): void;
}
