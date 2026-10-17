function isOutdated(date: number | null) {
  if (date === null) return true;
  return Date.now() - date > 10 * 1000;
}

export default isOutdated;
