import easings from './easings';
import tween2 from './tween';
import { pool } from './pool';
import * as is from './is';

import Engine from './engine';
import Timeline from './timeline';

import { defaultOptions } from './settings';

const version = '__VERSION__';

const Tween = tween2;
Tween.pool = pool;
Tween.VERSION = version;
Tween.easings = easings;

Tween.update = function (now) {
  now = now || Date.now();
  pool.each((value) => {
    if (value.playing) {
      value.update(now);
    }
  });
};

Tween.killOf = (obj) => {
  if (obj instanceof Tween) {
    obj.kill();
  } else {
    const tweens = pool.find(obj);
    if (tweens) {
      if (is.arr(tweens)) {
        tweens.forEach((e) => e.kill());
      } else {
        tweens.kill();
      }
    }
  }
};

Tween.killAll = () => {
  pool.each((tween) => {
    tween.kill();
  });
  pool.removeAll();
};

function getTween(target, options) {
  return new Tween(
    new Engine(target, {
      ease: options.ease,
      duration: options.duration,
    }),
    Object.assign(defaultOptions, options)
  );
}

Tween.to = function (target, vars, options) {
  const tween = getTween(target, options);
  tween._engine.to(vars);
  tween.play();
  return tween;
};

Tween.from = function (target, vars, options) {
  const tween = getTween(target, options);
  tween._engine.from(vars);
  tween.play();
  return tween;
};

Tween.fromTo = function (target, fromVars, toVars, options) {
  const tween = getTween(target, options);
  tween._engine.fromTo(fromVars, toVars);
  tween.play();
  return tween;
};

Tween.Timeline = Timeline;

module.exports = Tween;
