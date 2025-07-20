//this function compares two objects in deep level i.e the keys and the values
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null)
    return false;

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) {
        return false;
      }
    }
    return true;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}


let replaceEmptyStringsWithNull = (obj) => {
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      replaceEmptyStringsWithNull(obj[key]);
    } else if (obj[key] === '') {
      obj[key] = null;
    }
  }
  return obj;
}

module.exports = {
  deepEqual,
  replaceEmptyStringsWithNull
}
