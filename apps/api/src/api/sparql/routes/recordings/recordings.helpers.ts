export const ms2Duration = (durationMs: number): string => {
  const date: Date = new Date(durationMs);
  const hours: number = date.getUTCHours();
  const minutes: number = date.getUTCMinutes();
  const seconds: number = date.getUTCSeconds();

  return `PT${hours ? hours + 'H' : ''}${minutes ? minutes + 'M' : ''}${seconds ? seconds + 'S' : ''}`;
};
