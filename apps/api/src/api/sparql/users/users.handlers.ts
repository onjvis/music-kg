import axios from 'axios';
import { Request, Response } from 'express';
import { IriTerm, Triple } from 'sparqljs';

import { CreateUserRequest, ErrorResponse } from '@music-kg/data';
import {
  GetSparqlResponse,
  iri,
  literal,
  MUSIC_KG_USERS_PREFIX,
  Person,
  prefix2graph,
  RDF_PREDICATE,
  RDF_PREFIX,
  SCHEMA_PREDICATE,
  SCHEMA_PREFIX,
  SCHEMA_TYPE,
  XSD_DATATYPE,
} from '@music-kg/sparql-data';

import { createSparqlGetQuery, createSparqlUpdateQuery } from '../create-sparql-query';
import { getPropertiesFromBindings } from '../get-properties-from-bindings';
import { replaceBaseUri } from '../sparql.helpers';

export const createUser = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const body: CreateUserRequest = req.body as CreateUserRequest;
  if (!body?.id || !body?.email || !body?.name) {
    res.status(400).send({
      message: 'The request body is missing one or more of the following required properties: id, email, name.',
    });
    return;
  } else if (res.locals.decoded?.id !== body?.id) {
    res.sendStatus(403);
    return;
  }

  const usersPrefix: string = replaceBaseUri(MUSIC_KG_USERS_PREFIX);

  const userSubject: IriTerm = iri(usersPrefix, body?.id);
  const triples: Triple[] = [
    { subject: userSubject, predicate: RDF_PREDICATE.type.iri, object: SCHEMA_TYPE.Person.iri },
    { subject: userSubject, predicate: SCHEMA_PREDICATE.name.iri, object: literal(body?.name, XSD_DATATYPE.string) },
    { subject: userSubject, predicate: SCHEMA_PREDICATE.email.iri, object: literal(body?.email, XSD_DATATYPE.string) },
  ];
  const prefixes = {
    rdf: RDF_PREFIX,
    schema: SCHEMA_PREFIX,
  };

  const query: string = createSparqlUpdateQuery({
    graph: prefix2graph(usersPrefix),
    prefixes,
    triples,
  });

  try {
    await axios.post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, {
      headers: { 'Content-Type': 'application/sparql-update' },
    });
    res.set('Location', userSubject?.value).sendStatus(201);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const getUser = async (req: Request, res: Response<Person | ErrorResponse>): Promise<void> => {
  const id: string = req.params.id;

  if (res.locals.decoded?.id !== id) {
    res.sendStatus(403);
    return;
  }

  const usersPrefix: string = replaceBaseUri(MUSIC_KG_USERS_PREFIX);
  const userIri: IriTerm = iri(usersPrefix, id);

  const query: string = createSparqlGetQuery({
    graph: prefix2graph(usersPrefix),
    subject: userIri,
  });

  try {
    const { data } = await axios.get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, {
      params: { query },
    });

    const user: Person = getPropertiesFromBindings<Person>(data.results.bindings);

    !user
      ? res.status(404).send({ message: `The user with id ${id} does not have a profile in the RDF database.` })
      : res.status(200).send({ ...user, id });
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
