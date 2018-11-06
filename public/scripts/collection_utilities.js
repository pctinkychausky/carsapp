/* eslint-disable no-debugger */

/*******************************
* @param array - the array/collection to be added to
* @param itemId - the id of the item/object you wish to find
* @throws ITEM_NOT_FOUND_IN_ARRAY - if item is not in the array
* @returns item from the array
*******************************/
export const getItemById = (array, itemId) => {
  const item = array.find(item => {
    return item._id === itemId;
  });
  if (item === -1) {
    throw new Error('ITEM_NOT_FOUND_IN_ARRAY');
  }
  return item;
};

/*******************************
* @param array - the array/collection to be added to
* @param itemId - the id of the item/object who's index you wish to find
* @throws ITEM_NOT_FOUND_IN_ARRAY - if item is not in the array
* @returns Index of item in array
*******************************/
export const getIndexById = (array, itemId) => {
  const index = array.findIndex(item => {
    return item._id === itemId;
  });
  if (index === -1) {
    throw new Error('ITEM_NOT_FOUND_IN_ARRAY');
  }
  return index;
};


/*******************************
* @param array (Array) - the array/collection to be added to
* @param item (Object/String/Number) - the item/object you wish to remove
* @throws (by proxy) ITEM_NOT_FOUND_IN_ARRAY - if item is not in the array
* @returns A new array, without the item in.
*******************************/
export const removeItemById = (array, id) => {
  const index = getIndexById(array, id);
  return [
    ...array.slice(0, index),
    ...array.slice(index + 1),
  ];
};

/*******************************
* @param array (Array) - the array to be added to
* @param oldItemId (String) - the id of the item you want to update
* @param updates (Object) - the updates you wish to apply
* @returns A new array, with the updated item in.
*******************************/
export const updateItemById = (array, oldItemID, updates) => {
  const oldItemIndex = getIndexById(array, oldItemID);
  const oldItem = array[oldItemIndex];
  const newItem = {
    ...oldItem,
    ...updates,
  };
  return [
    ...array.slice(0, oldItemIndex),
    newItem,
    ...array.slice(oldItemIndex + 1),
  ];
};