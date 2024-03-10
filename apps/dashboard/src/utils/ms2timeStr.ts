export const ms2timeStr = (durationMs: number): string => {
  const date: Date = new Date(durationMs);
  const hours: number = date.getUTCHours();
  const minutes: number = date.getUTCMinutes();
  const seconds: number = date.getUTCSeconds();

  return [...(hours ? [hours] : []), ...[minutes, seconds].map((time) => time.toString().padStart(2, '0'))].join(':');
};
