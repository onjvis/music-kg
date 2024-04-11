import { IriTerm, Triple } from 'sparqljs';

import {
  CreateAlbumRequest,
  CreateArtistRequest,
  CreateRecordingRequest,
  CreateUserRequest,
  EntityData,
} from '@music-kg/data';
import {
  iri,
  iriWithPrefix,
  MUSIC_KG_ALBUMS_PREFIX,
  MUSIC_KG_ARTISTS_PREFIX,
  MUSIC_KG_RECORDINGS_PREFIX,
  MUSIC_KG_USERS_PREFIX,
  SparqlEntity,
} from '@music-kg/sparql-data';

import { createAlbum } from '../routes/albums/create-album';
import { getAlbumByExternalUrl } from '../routes/albums/get-album';
import { createArtist } from '../routes/artists/create-artist';
import { getArtistByExternalUrl } from '../routes/artists/get-artist';
import { createRecording } from '../routes/recordings/create-recording';
import { getRecordingByExternalUrl } from '../routes/recordings/get-recording';
import { createUser } from '../routes/users/create-user';
import { getUserByExternalUrl } from '../routes/users/get-user';
import { replaceBaseUri } from './replace-base-uri';

export const getSecondaryEntityTriples = async (
  subject: IriTerm,
  predicate: IriTerm,
  objectPrefix: string,
  entities: EntityData[]
): Promise<Triple[]> => {
  const createdTriples: Triple[] = [];

  for (const entity of entities) {
    if (entity?.id) {
      createdTriples.push(handleEntityId(subject, predicate, objectPrefix, entity));
    } else if (entity?.externalUrls) {
      createdTriples.push(await handleEntityExternalUrls(subject, predicate, objectPrefix, entity));
    } else if (entity?.name) {
      createdTriples.push(await handleEntityName(subject, predicate, objectPrefix, entity));
    } else {
      throw new Error('getSecondaryEntityTriples: EMPTY ENTITY DATA ERROR: Entity data is empty object.');
    }
  }

  return createdTriples;
};

const handleEntityId = (subject: IriTerm, predicate: IriTerm, objectPrefix: string, entityData: EntityData): Triple => {
  return { subject, predicate, object: iriWithPrefix(objectPrefix, entityData?.id) };
};

const handleEntityExternalUrls = async (
  subject: IriTerm,
  predicate: IriTerm,
  objectPrefix: string,
  entityData: EntityData
): Promise<Triple> => {
  const getEntityByExternalUrl = getEntityByExternalUrlFunction(objectPrefix);
  const createEntity = getCreateEntityFunction(objectPrefix);

  const entity = await getEntityByExternalUrl(entityData?.externalUrls?.spotify ?? entityData?.externalUrls?.wikidata);

  if (entity) {
    return { subject, predicate, object: iriWithPrefix(objectPrefix, entity.id) };
  } else if (entityData?.name) {
    const createdEntity: string = await createEntity({
      name: entityData?.name,
      externalUrls: entityData?.externalUrls,
    });
    return { subject, predicate, object: iri(createdEntity) };
  } else {
    throw new Error('handleEntityExternalUrls: CREATE ENTITY ERROR: Entity does not have a name.');
  }
};

const handleEntityName = async (
  subject: IriTerm,
  predicate: IriTerm,
  objectPrefix: string,
  entityData: EntityData
): Promise<Triple> => {
  const createEntity = getCreateEntityFunction(objectPrefix);
  const createdEntity: string = await createEntity({ name: entityData?.name });
  return { subject, predicate, object: iri(createdEntity) };
};

const getEntityByExternalUrlFunction = (prefix: string): ((externalUrl: string) => Promise<SparqlEntity>) => {
  switch (prefix) {
    case replaceBaseUri(MUSIC_KG_ALBUMS_PREFIX):
      return getAlbumByExternalUrl;
    case replaceBaseUri(MUSIC_KG_ARTISTS_PREFIX):
      return getArtistByExternalUrl;
    case replaceBaseUri(MUSIC_KG_RECORDINGS_PREFIX):
      return getRecordingByExternalUrl;
    case replaceBaseUri(MUSIC_KG_USERS_PREFIX):
      return getUserByExternalUrl;
  }
};

const getCreateEntityFunction = (
  prefix: string
): ((
  request: CreateAlbumRequest | CreateArtistRequest | CreateRecordingRequest | CreateUserRequest
) => Promise<string>) => {
  switch (prefix) {
    case replaceBaseUri(MUSIC_KG_ALBUMS_PREFIX):
      return createAlbum;
    case replaceBaseUri(MUSIC_KG_ARTISTS_PREFIX):
      return createArtist;
    case replaceBaseUri(MUSIC_KG_RECORDINGS_PREFIX):
      return createRecording;
    case replaceBaseUri(MUSIC_KG_USERS_PREFIX):
      return createUser;
  }
};
