import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { DataOrigin } from '@music-kg/data';

import { SpotifyIcon } from '../../../components/icons/spotify-icon';
import httpClient from '../../../services/http-client';

type BrowseListProps = {
  entityRoutePrefix: string;
  sparqlEndpoint: string;
  title: string;
};

type EntityItem = {
  id: string;
  origin: DataOrigin;
};

export const BrowseList = ({ entityRoutePrefix, sparqlEndpoint, title }: BrowseListProps) => {
  const [entities, setEntities] = useState<EntityItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const retrievedEntities: EntityItem[] = [];

      (
        await Promise.all(
          [DataOrigin.LOCAL, DataOrigin.SPOTIFY].map((origin: DataOrigin) =>
            httpClient
              .get<string[]>(`${sparqlEndpoint}?origin=${origin}`)
              .then((response) => response?.data.map((entity: string): EntityItem => ({ id: entity, origin })))
          )
        )
      ).forEach((entities: EntityItem[]) => retrievedEntities.push(...entities));

      setEntities(retrievedEntities);
    };

    fetchData().catch(console.error);
  }, [sparqlEndpoint]);

  return (
    <div className="flex flex-col gap-2">
      <h2>{title}</h2>
      {entities.map((entity: EntityItem) => (
        <div className="flex flex-row items-center gap-1" key={`${entity.origin}_${entity.id}`}>
          {entity.origin === DataOrigin.SPOTIFY && <SpotifyIcon size="1em" />}
          <Link className="text-blue-500 underline" to={`${entityRoutePrefix}/${entity.origin}/${entity.id}`}>
            {entity.id}
          </Link>
        </div>
      ))}
    </div>
  );
};
