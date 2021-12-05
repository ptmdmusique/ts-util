export function generateRandomArray<T>(
  generator: () => T,
  amount: number
): Array<T> {
  const result: T[] = [];
  for (let i = 0; i < amount; i++) {
    result.push(generator());
  }

  return result;
}
