// Angular CDK Drag Utils source: https://github.com/angular/components/blob/master/src/cdk/drag-drop/drag-utils.ts

/**
 * Moves an item one index in an array to another.
 * @param arraySource Array in which to move the item.
 * @param fromIndex Starting index of the item.
 * @param toIndex Index to which the item should be moved.
 */

function clamp(value: number, max: number): number {
  return Math.max(0, Math.min(max, value));
}

export function moveItemInArray<T = any>(arraySource: T[], fromIndex: number, toIndex: number): T[] {
  const array = JSON.parse(JSON.stringify(arraySource));
  const from = clamp(fromIndex, array.length - 1);
  const to = clamp(toIndex, array.length - 1);

  if (from === to) {
    return array;
  }

  const target = array[from];
  const delta = to < from ? -1 : 1;

  for (let i = from; i !== to; i += delta) {
    array[i] = array[i + delta];
  }

  array[to] = target;
  return array;
}

/**
 * Moves an item from one array to another.
 * @param previousArraySource Array from which to transfer the item.
 * @param currentArraySource Array into which to put the item.
 * @param previousIndex Index of the item in its current array.
 * @param currentIndex Index at which to insert the item.
 */
export function transferArrayItem<T = any>(
  previousArraySource: T[],
  currentArraySource: T[],
  previousIndex: number,
  currentIndex: number
): { previousArray: T[]; currentArray: T[] } {
  const previousArray = JSON.parse(JSON.stringify(previousArraySource));
  const currentArray = JSON.parse(JSON.stringify(currentArraySource));

  const from = clamp(previousIndex, previousArray.length - 1);
  const to = clamp(currentIndex, currentArray.length);

  if (previousArray.length) {
    currentArray.splice(to, 0, previousArray.splice(from, 1)[0]);
  }

  return {
    previousArray,
    currentArray,
  };
}

/**
 * Copies an item from one array to another, leaving it in its
 * original position in current array.
 * @param previousArraySource Array from which to copy the item.
 * @param currentArraySource Array into which is copy the item.
 * @param previousIndex Index of the item in its current array.
 * @param currentIndex Index at which to insert the item.
 *
 */
export function copyArrayItem<T = any>(
  previousArraySource: T[],
  currentArraySource: T[],
  previousIndex: number,
  currentIndex: number
): { previousArray: T[]; currentArray: T[] } {
  const previousArray = JSON.parse(JSON.stringify(previousArraySource));
  const currentArray = JSON.parse(JSON.stringify(currentArraySource));

  const to = clamp(currentIndex, currentArray.length);

  if (previousArray.length) {
    currentArray.splice(to, 0, previousArray[previousIndex]);
  }

  return {
    previousArray,
    currentArray,
  };
}
