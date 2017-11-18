/**
 * Concats two arrays
 * @param itemsA first array argument
 * @param itemsB second array argument
 */
export const concat = (itemsA: any[], itemsB: any[]) => itemsA.concat(itemsB);

/**
 * Executes a flatMap modifier function to each elements of the array
 * @param λ the flatMap function
 * @param collection the array to apply the flatMap funtion to
 */
export const flatMap = (λ: (item: any) => any, collection: any[]) => collection.map(λ).reduce(concat, []);

/**
 * Flattens an array with nested arrays
 * @param collection the array argument
 */
export const flatten = (collection: any[]) => flatMap(items => {
  if (items.constructor === Array) {
    return flatMap(item => item, items);
  } else {
    return items;
  }
}, collection);
