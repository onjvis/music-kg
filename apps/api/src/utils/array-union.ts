export const arrayUnion = <T>(arrayA: T[], arrayB: T[]): T[] => {
  return [...new Set([...arrayA, ...arrayB])];
};
