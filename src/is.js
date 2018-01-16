export function arr(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
}

export function str(value) {
  return typeof value === 'string';
}

export function obj(value) {
  return typeof value === 'object';
}

export function num(value) {
  return typeof value === 'number';
}

export function ownProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
