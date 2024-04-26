export const getMusicKGEntityLink = (link: string): string => {
  const linkParts: string[] = link.split('/');
  const origin: string = linkParts[linkParts.length - 2];
  const entityId: string = linkParts[linkParts.length - 1];

  return `${origin}/${entityId}`;
};
