type Obj = Record<string, any>
type Arr = any[]


function mergeObjects<T extends Obj, D extends Obj>(first: T, second: D) {

  const merged = { ...first, ...second } satisfies T & D;

    console.log('Merged first layer: ', merged)

    for (const key in merged) {
      if (second.hasOwnProperty(key)) {

        console.log('Keys types: ', `${typeof first[key]} | ${typeof second[key]}`)
        const property = key as keyof (T & D)

        if (typeof merged[key] !== 'object') {
          merged[property] = second[key];
        }
        else if (typeof first[key] === 'object' && typeof second[key] === 'object' ){
            merged[property] = mergeProperties(first[key], second[key]);
        }
      }
    }
  
    console.log('result merge: ', merged)
    return merged;
}

function mergeArrays<T extends Arr, D extends Arr>(first: T, second: D) {
  return [...first, ...second]
}

export function deepMerge<T extends Obj, D extends Obj>(first: T, second: D) {
  return mergeObjects(first, second)
}


function mergeProperties<T extends Obj, D extends Obj>(first: T, second: D) {
    
  if (Array.isArray(first) && Array.isArray(second)) {
    return mergeArrays(first, second)
  }

  return mergeObjects(first, second)

}
