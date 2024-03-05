export function getIntFromUrnId(str) {
  return str.split(':').pop();
}
