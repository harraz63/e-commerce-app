export const parseExpiry = (value: string) => {
  if (!value) return 600000; // default 10 minutes
  if (value.endsWith("m")) return parseInt(value) * 60 * 1000;
  if (value.endsWith("s")) return parseInt(value) * 1000;
  if (value.endsWith("h")) return parseInt(value) * 60 * 60 * 1000;
  return parseInt(value); // assume ms
};
