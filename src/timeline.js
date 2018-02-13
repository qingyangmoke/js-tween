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
  // get ignoreCheckKey() {
  //   return this.options.ignoreCheckKey;
  // }
  get duration() {
    return this.options.duration;
  }
  set duration(value) {
    this.options.duration = value;
  }
  reset() {
    // 反向重置
    const tweens = this.tweens;
    for (let i = tweens.length - 1; i >= 0; i--) {
      const e = tweens[i];
      e.reset();
      e.running = false;
    }
  }
  seek(duration, reverse, force, target) {
    reverse = reverse || false;
    force = force || false;
    let changed = false;
    if (reverse) {
      duration = this.duration - duration;
    }
    this.tweens.forEach((e) => {
      if (target && e.target !== target) return;
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

  init() {
    // this.seek(0, false, true);
  }

  to(target, vars, duration, position) {
    const engine = this._add(target, duration, position);
    this.seek(engine.start, false, true, target);
    engine.to(vars);
    this.tweens.push(engine);
    this.reset();
    console.log(target);
  }

  from(target, vars, duration, position) {
    const engine = this._add(target, duration, position);
    this.seek(engine.start, false, true, target);
    engine.from(vars);
    console.log(engine);
    this.tweens.push(engine);
    this.reset();
  }

  fromTo(target, fromVars, toVars, duration, position) {
    const engine = this._add(target, duration, position);
    engine.fromTo(fromVars, toVars);
    this.tweens.push(engine);
  }
  wait(time) {
    this.seekPointer += time;
    this.duration = Math.max(this.seekPointer, this.duration);
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
    return this;
  }

  to(target, vars, duration, position) {
    this._engine.to(target, vars, duration, position);
    this.seek(0);
    this._inited = false;
    return this;
  }

  from(target, vars, duration, position) {
    this._engine.from(target, vars, duration, position);
    this.seek(0);
    this._inited = false;
    return this;
  }

  fromTo(target, fromVars, toVars, duration, position) {
    this._engine.fromTo(target, fromVars, toVars, duration, position);
    this.seek(0);
    this._inited = false;
    return this;
  }

  wait(duration) {
    this._engine.wait(duration);
    return this;
  }
}

export default Timeline;
