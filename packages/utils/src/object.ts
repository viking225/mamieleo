type Obj = Record<string, any>


export function deepMerge(obj1: Obj, obj2: Obj): Obj {
    const merged = { ...obj1, ...obj2 };
  
    for (const key in merged) {
      if (merged.hasOwnProperty(key)) {

        if (typeof merged[key] !== 'object') {
          merged[key] = obj2[key];
        }
        if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object' ){
          
            const firstElement = obj1[key] 
            const secondElement = obj2[key]
          
            merged[key] = deepMerge(firstElement, secondElement);
        }
      }
    }
  
    return merged;
  }
