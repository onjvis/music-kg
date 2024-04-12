// Inspired by https://stackoverflow.com/a/29153059
export const duration2ms = (duration: string): number => {
  const iso8601DurationRegex = /PT(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;
  const matches = duration.match(iso8601DurationRegex);

  return (Number(matches?.[1] ?? 0) * 3600 + Number(matches?.[2] ?? 0) * 60 + Number(matches?.[3] ?? 0)) * 1000;
};
