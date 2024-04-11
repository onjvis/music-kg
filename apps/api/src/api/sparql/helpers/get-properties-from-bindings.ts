import { SCHEMA_PREDICATE, SparqlBinding, SparqlEntity, SparqlObject, XSD_DATATYPE } from '@music-kg/sparql-data';

export const getPropertiesFromBindings = <T extends SparqlEntity>(
  bindings: SparqlBinding[],
  predicates = SCHEMA_PREDICATE
): T => {
  const bindingsObject: SparqlEntity = {} as SparqlEntity;

  // If the subject ID is available, include it in the resulting object
  if (bindings?.[0]?.subject) {
    const uriParts: string[] = bindings?.[0]?.subject?.value?.split('/');
    bindingsObject.id = uriParts[uriParts.length - 1];
  }

  Object.entries(predicates).forEach(([key, value]) => {
    const boundObjects: SparqlObject[] = bindings
      .filter((binding: SparqlBinding) => binding.predicate.value === value.iri.value)
      .map((filteredBinding: SparqlBinding) => filteredBinding?.object);

    const boundValues = boundObjects?.map((object) => {
      if (value === SCHEMA_PREDICATE.image || value === SCHEMA_PREDICATE.sameAs) {
        return object?.value;
      } else if (object?.type === 'uri') {
        const uriParts: string[] = object?.value?.split('/');
        return uriParts[uriParts.length - 1];
      } else if (object?.type === 'literal') {
        switch (object?.datatype) {
          case XSD_DATATYPE.integer.iri.value:
            return Number(object?.value);
          case XSD_DATATYPE.date.iri.value:
          case XSD_DATATYPE.dateTime.iri.value:
          case XSD_DATATYPE.duration.iri.value:
          case XSD_DATATYPE.string.iri.value:
          default:
            return object?.value;
        }
      }
    });

    const property = boundValues?.length > 1 ? boundValues : boundValues[0];

    if (property) {
      bindingsObject[key] = property;
    }
  });

  return Object.keys(bindingsObject).length ? (bindingsObject as T) : undefined;
};
