export const stripSecondsFromTimeString = (time: string): string => {
  const parts = time.split(':');
  return `${parts[0]}:${parts[1]}`;
};
