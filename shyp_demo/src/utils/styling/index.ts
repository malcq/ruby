function isArray(val: any): boolean {
  return val instanceof Array;
}

function isObject(val: any): boolean {
  return val !== null && typeof val === 'object';
}

export default function getClassName(...args) {
  return args.reduce((className, arg, index) => {
    if (typeof arg === 'string') {
      return `${className} ${arg}`;
    }
    if (isObject(arg) && !isArray(arg)) {
      const argClassName = Object.keys(arg)
        .reduce((acc, key) => {
          if (arg[key]) {
            return `${acc} ${key}`;
          }
          return acc;
        }, '');
      return `${className} ${argClassName}`;
    }
    throw new Error(`Invalid type(${typeof arg}) of ${index} argument in an utils/styling function "getClassName".`);
  }, '');
}

