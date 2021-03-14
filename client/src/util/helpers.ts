export function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
    return false;
    }

    for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
        areObjects && !deepEqual(val1, val2) ||
        !areObjects && val1 !== val2
    ) {
        return false;
    }
    }

    return true;
}

function isObject(object) {
    return object != null && typeof object === 'object';
}

/**
 * make a copy of the array, then replace the first target found with the replacement
 * if there isn't a replacement, then just remove the item instead,
 * 
 * only first target is replaced
 * 
 * return false if the target isn't in the array.
 */
export function findAndReplace(array: any[], target, replacement?:any|null) {
    let newArray = [...array];
    for(let i=0; i< newArray.length; i++) {
        const item = newArray[i];
        if(item === target) {
            if(replacement) {
                newArray[i] = replacement;
            } else {
                newArray.splice(i, 1);
            }
            return newArray;
        }
    }
    return false;
}