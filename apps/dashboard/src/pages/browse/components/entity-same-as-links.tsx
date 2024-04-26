import { isMusicKgIri } from '../utils/is-music-kg-iri';
import { mapExternalUrl2property } from '@music-kg/data';
import { AppRoute } from '../../../models/enums/app-route.enum';
import { getMusicKGEntityLink } from '../utils/get-music-kg-entity-link';
import { CustomLink } from './custom-link';
import { FlexRow } from '../../../components/flex-row';

type EntitySameAsLinksProps = {
  entityRoutePrefix: AppRoute;
  links: string[];
};

export const EntitySameAsLinks = ({ entityRoutePrefix, links }: EntitySameAsLinksProps) => {
  return (
    <FlexRow
      label={links?.length > 1 ? 'SameAs Links' : 'SameAs Link'}
      element={
        <div className="flex flex-col items-end gap-1">
          {links.map((link: string) => {
            const linkIsMusicKGIri: boolean = isMusicKgIri(link);
            const linkTitle: string = linkIsMusicKGIri ? link : mapExternalUrl2property(link) ?? link;
            const to: string = linkIsMusicKGIri ? `${entityRoutePrefix}/${getMusicKGEntityLink(link)}` : link;

            return (
              <CustomLink
                key={`sameAsLink:${link}`}
                capitalize={!linkIsMusicKGIri}
                linkTitle={linkTitle}
                newTab={!linkIsMusicKGIri}
                to={to}
              />
            );
          })}
        </div>
      }
    />
  );
};
