import * as is from './is';

let TWEENS = {};
function _remove(tween) {
  if (!has(tween)) return;
  TWEENS[tween.id] = null;
  delete TWEENS[tween.id];
}

function each(func) {
  for (const key in TWEENS) {
    if (is.ownProperty(TWEENS, key)) {
      func(TWEENS[key]);
    }
  }
}

function find(obj) {
  if (!obj) return null;
  if (is.str(obj)) {
    return TWEENS[obj];
  }
  const result = [];
  each((value) => {
    if (value.obj === obj) {
      result.push(obj);
    }
  });
  return result;
}

function has(tween) {
  return tween.id in TWEENS;
}

function add(tween) {
  if (has(tween)) return;
  TWEENS[tween.id] = tween;
}

function remove(tween) {
  if (is.arr(tween)) {
    tween.forEach((e) => {
      _remove(e);
    });
  } else {
    return _remove(tween);
  }
}

function removeAll() {
  TWEENS = {};
}

let ids = 0;
export function newId() {
  return (++ids).toString();
}

export const pool = {
  removeAll,
  remove,
  add,
  has,
  find,
  each,
};

