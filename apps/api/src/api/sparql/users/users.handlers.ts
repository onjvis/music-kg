import axios from 'axios';
import { Request, Response } from 'express';
import { IriTerm, SelectQuery, Triple, Update, VariableTerm } from 'sparqljs';

import { CreateUserRequest, ErrorResponse, GetUserResponse } from '@music-kg/data';
import {
  GetSparqlUserResponse,
  iri,
  literal,
  MUSIC_KG_USERS_PREFIX,
  prefix2graph,
  RDF_PREDICATE,
  RDF_PREFIX,
  SCHEMA_PREDICATE,
  SCHEMA_PREFIX,
  SCHEMA_TYPE,
  variable,
  XSD_DATATYPE,
} from '@music-kg/sparql-data';

import { replaceBaseUri, sparqlGenerator } from '../sparql.helpers';

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
    { subject: userSubject, predicate: RDF_PREDICATE.type, object: SCHEMA_TYPE.Person },
    { subject: userSubject, predicate: SCHEMA_PREDICATE.name, object: literal(body?.name, XSD_DATATYPE.string) },
    { subject: userSubject, predicate: SCHEMA_PREDICATE.email, object: literal(body?.email, XSD_DATATYPE.string) },
  ];
  const prefixes = {
    rdf: RDF_PREFIX,
    schema: SCHEMA_PREFIX,
  };

  // create SPARQL request
  const queryObject: Update = {
    type: 'update',
    updates: [{ updateType: 'insert', insert: [{ type: 'graph', triples, name: prefix2graph(usersPrefix) }] }],
    prefixes,
  };

  const query: string = sparqlGenerator.stringify(queryObject);

  try {
    await axios.post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, {
      headers: { 'Content-Type': 'application/sparql-update' },
    });
    res.set('Location', userSubject?.value).sendStatus(201);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const getUser = async (req: Request, res: Response<GetUserResponse | ErrorResponse>): Promise<void> => {
  const id: string = req.params.id;

  if (res.locals.decoded?.id !== id) {
    res.sendStatus(403);
    return;
  }

  const usersPrefix: string = replaceBaseUri(MUSIC_KG_USERS_PREFIX);

  const userIri: IriTerm = iri(usersPrefix, id);
  const predicateVariable: VariableTerm = variable('predicate');
  const objectVariable: VariableTerm = variable('object');

  // create SPARQL request
  const queryObject: SelectQuery = {
    queryType: 'SELECT',
    variables: [predicateVariable, objectVariable],
    from: { default: [prefix2graph(usersPrefix)], named: [] },
    where: [{ type: 'bgp', triples: [{ subject: userIri, predicate: predicateVariable, object: objectVariable }] }],
    type: 'query',
    prefixes: {},
  };

  const query: string = sparqlGenerator.stringify(queryObject);

  try {
    const { data } = await axios.get<GetSparqlUserResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, {
      params: { query },
    });
    const bindings = data.results.bindings;
    const name: string = bindings.find((binding) => binding.predicate.value === SCHEMA_PREDICATE.name.value)?.object
      ?.value;
    const email: string = bindings.find((binding) => binding.predicate.value === SCHEMA_PREDICATE.email.value)?.object
      ?.value;
    !name || !email
      ? res.status(404).send({ message: `The user id ${id} does not have a profile in the RDF database.` })
      : res.status(200).send({ id, name, email });
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
