import { IriTerm, Triple } from 'sparqljs';

import {
  CreateAlbumRequest,
  CreateArtistRequest,
  CreateRecordingRequest,
  CreateUserRequest,
  DataOrigin,
  EntityData,
  EntityType,
} from '@music-kg/data';
import { iri, iriWithPrefix, SparqlEntity } from '@music-kg/sparql-data';

import { createAlbum, getAlbumByExternalUrl } from '../routes/albums/features';
import { createArtist, getArtistByExternalUrl } from '../routes/artists/features';
import { createRecording, getRecordingByExternalUrl } from '../routes/recordings/features';
import { createUser, getUserByExternalUrl } from '../routes/users/features';
import { generateUniqueId } from '../features/generate-unique-id';

const ALLOWED_ENTITY_DATA_TYPES: EntityType[] = ['album', 'artist', 'track', 'user'];

export const getSecondaryEntityTriples = async (
  subject: IriTerm,
  predicate: IriTerm,
  objectPrefix: string,
  entities: EntityData[],
  origin: DataOrigin
): Promise<Triple[]> => {
  const createdTriples: Triple[] = [];

  for (const entity of entities) {
    if (!entity?.type || !ALLOWED_ENTITY_DATA_TYPES.includes(entity?.type)) {
      throw new Error(
        'getSecondaryEntityTriples: ENTITY DATA ERROR: Entity data is missing type or the given type is not allowed.'
      );
    }

    const entityOrigin: DataOrigin = entity?.type === 'user' ? DataOrigin.LOCAL_USERS : origin;

    if (entity?.id) {
      createdTriples.push(handleEntityId(subject, predicate, objectPrefix, entity));
    } else if (entity?.externalUrls) {
      createdTriples.push(await handleEntityExternalUrls(subject, predicate, objectPrefix, entity, entityOrigin));
    } else if (entity?.name) {
      createdTriples.push(await handleEntityName(subject, predicate, entity, entityOrigin));
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
  entityData: EntityData,
  origin: DataOrigin
): Promise<Triple> => {
  const getEntityByExternalUrl = getEntityByExternalUrlFunction(entityData);
  const createEntity = getCreateEntityFunction(entityData);

  const entity: SparqlEntity = await getEntityByExternalUrl(
    entityData?.externalUrls?.spotify ?? entityData?.externalUrls?.wikidata,
    origin
  );

  if (entity) {
    return { subject, predicate, object: iriWithPrefix(objectPrefix, entity.id) };
  } else if (entityData?.name) {
    const createdEntity: string = await createEntity(
      {
        name: entityData?.name,
        externalUrls: entityData?.externalUrls,
        ...(entityData?.type === 'user' ? { id: await generateUniqueId(DataOrigin.LOCAL_USERS) } : {}),
      },
      origin
    );
    return { subject, predicate, object: iri(createdEntity) };
  } else {
    throw new Error('handleEntityExternalUrls: CREATE ENTITY ERROR: Entity does not have a name.');
  }
};

const handleEntityName = async (
  subject: IriTerm,
  predicate: IriTerm,
  entityData: EntityData,
  origin: DataOrigin
): Promise<Triple> => {
  const createEntity = getCreateEntityFunction(entityData);
  const createdEntity: string = await createEntity(
    {
      name: entityData?.name,
      ...(entityData?.type === 'user' ? { id: await generateUniqueId(DataOrigin.LOCAL_USERS) } : {}),
    },
    origin
  );
  return { subject, predicate, object: iri(createdEntity) };
};

const getEntityByExternalUrlFunction = (
  entityData: EntityData
): ((externalUrl: string, origin: DataOrigin) => Promise<SparqlEntity>) => {
  console.log(entityData);

  switch (entityData.type) {
    case 'album':
      return getAlbumByExternalUrl;
    case 'artist':
      return getArtistByExternalUrl;
    case 'track':
      return getRecordingByExternalUrl;
    case 'user':
      return getUserByExternalUrl;
  }
};

const getCreateEntityFunction = (
  entityData: EntityData
): ((
  request: CreateAlbumRequest | CreateArtistRequest | CreateRecordingRequest | CreateUserRequest,
  origin: DataOrigin
) => Promise<string>) => {
  switch (entityData?.type) {
    case 'album':
      return createAlbum;
    case 'artist':
      return createArtist;
    case 'track':
      return createRecording;
    case 'user':
      return createUser;
  }
};
