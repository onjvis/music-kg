import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import httpClient from '../../../services/http-client';

type BrowseListProps = {
  entityRoutePrefix: string;
  sparqlEndpoint: string;
  title: string;
};

export const BrowseList = ({ entityRoutePrefix, sparqlEndpoint, title }: BrowseListProps) => {
  const [entities, setEntities] = useState<string[]>([]);

  useEffect(() => {
    httpClient.get(sparqlEndpoint).then((response) => setEntities(response?.data));
  }, [sparqlEndpoint]);

  return (
    <div className="flex flex-col gap-2">
      <h2>{title}</h2>
      {entities.map((entity) => (
        <Link className="text-blue-500 underline" key={entity} to={`${entityRoutePrefix}/${entity}`}>
          {entity}
        </Link>
      ))}
    </div>
  );
};
