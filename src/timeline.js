import Tween from './tween';
import * as is from './is';
import Engine from './engine';
import { defaultOptions } from './settings';
class TimelineEngine {
  constructor(options) {
    this.tweens = [];
    this.seekPointer = 0;
    this.options = options;
    this.keys = [];
  }
  get ignoreCheckKey() {
    return this.options.ignoreCheckKey;
  }
  get duration() {
    return this.options.duration;
  }
  set duration(value) {
    this.options.duration = value;
  }
  reset() {
    const tweens = this.tweens;
    for (let i = tweens.length - 1; i >= 0; i--) {
      const e = tweens[i];
      e.reset();
      e.running = false;
    }
  }
  seek(duration, reverse, force) {
    reverse = reverse || false;
    force = force || false;
    let changed = false;
    if (reverse) {
      duration = this.duration - duration;
    }
    this.tweens.forEach((e) => {
      const running = e.start <= duration && e.end >= duration;
      if (running) {
        console.log('running', e);
        const seek = Math.min(e.duration, Math.max(0, duration - e.start));
        e.seek(reverse ? e.duration - seek : seek, reverse, force) && (changed = true);
        e.running = true;
      } else if (e.running || force) {
        e.running = false;
        if (reverse && e.start > duration) {
          e.seek(0, false) && (changed = true);
        } else if (!reverse && e.end < duration) {
          e.seek(e.duration, false) && (changed = true);
        }
      }
    });
    console.log('_updateEngineSeek', duration, changed);
    return changed;
  }

  _parse(to, from) {
    const operator = /^(\+=|-=)/.exec(to);
    if (!operator) return to;
    const x = +from;
    const y = +(to.replace(operator[0], ''));
    switch (operator[0]) {
      case '+=': return x + y;
      case '-=': return x - y;
      default:
        throw new Error('格式错误');
    }
  }

  _add(target, duration, position) {
    position = position || position === 0 ? position : this.seekPointer;
    let d = duration;
    let ease = defaultOptions.ease;
    if (is.obj(duration)) {
      d = duration.duration;
      ease = duration.ease;
    }
    duration = d;
    const engine = new Engine(target, {
      ease,
      duration,
    });
    if (!is.num(position)) {
      position = this._parse(position, this.seekPointer);
    }
    engine.running = false;
    engine.start = position;
    engine.end = position + duration;
    this.duration = Math.max(this.seekPointer, engine.end);
    this.seekPointer = engine.end;
    return engine;
  }

  _updateKeys(engine) {
    if (this.ignoreCheckKey) return;
    let item = null;
    const target = engine.target;
    this.keys.forEach((e) => {
      if (e.target === target) {
        item = e;
      }
    });
    if (!item) {
      item = {
        target,
        keys: [],
      };
      this.keys.push(item);
    }
    engine._keys.forEach((key) => {
      if (item.keys.indexOf(key) === -1) {
        item.keys.push(key);
      }
    });
  }

  _keys(target) {
    let keys = null;
    this.keys.forEach((e) => {
      if (e.target === target) {
        keys = e.keys;
      }
    });
    return keys;
  }

  init() {
    if (this.ignoreCheckKey) return;
    // 这里为了把key进行重新计算
    this.tweens.forEach((e) => {
      const keys = this._keys(e.target);
      console.log(e.target, keys);
      keys && keys.forEach((key) => {
        if (e._keys.indexOf(key) === -1) {
          this.seek(e.start, false, true);
          e._from[key] = e.target[key];
          this.seek(e.end, false, true);
          e._to[key] = e.target[key];
          e._keys.push(key);
        }
      });
    });
  }

  to(target, vars, duration, position) {
    const engine = this._add(target, duration, position);
    this.seek(engine.start, false, true);
    engine.to(vars);
    engine.running = false;
    this._updateKeys(engine);
    this.tweens.push(engine);
    this.reset();
    console.log(target);
  }

  from(target, vars, duration, position) {
    const engine = this._add(target, duration, position);
    this.seek(engine.start, false, true);
    engine.from(vars);
    console.log(engine);
    this._updateKeys(engine);
    this.tweens.push(engine);
    this.reset();
  }

  fromTo(target, fromVars, toVars, duration, position) {
    const engine = this._add(target, duration, position);
    engine.fromTo(fromVars, toVars);
    this._updateKeys(engine);
    this.tweens.push(engine);
  }
}
class Timeline extends Tween {
  constructor(options) {
    options = Object.assign({
      autoKill: false,
    }, options);
    super(null, options);
    this._engine = new TimelineEngine(this.options);
    this._inited = false;
  }

  init() {
    if (!this._inited) {
      this._inited = true;
      this._engine.init();
    }
  }

  /**
  * 播放
  * @param {boolean} reset - 是否重置
  */
  play(reset) {
    this.init();
    super.play(reset);
  }

  to(target, vars, duration, position) {
    this._engine.to(target, vars, duration, position);
    this.seek(0);
    this._inited = false;
  }

  from(target, vars, duration, position) {
    this._engine.from(target, vars, duration, position);
    this.seek(0);
    this._inited = false;
  }

  fromTo(target, fromVars, toVars, duration, position) {
    this._engine.fromTo(target, fromVars, toVars, duration, position);
    this.seek(0);
    this._inited = false;
  }
}

export default Timeline;
