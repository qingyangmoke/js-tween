class Engine {
  constructor(obj, { ease, duration }) {
    const self = this;
    self.target = obj;
    self.duration = duration;
    self.ease = ease;
    self.pos = -1;
  }

  _v(fromVars, toVars, baseVars) {
    const self = this;
    const from = {};
    const to = {};
    const keys = [];
    const target = self.target;
    for (const key in baseVars) {
      if ((key in target) && self._valid(target[key])) {
        from[key] = fromVars[key] || (fromVars[key] === 0 ? 0 : target[key]);
        to[key] = toVars[key] || (toVars[key] === 0 ? 0 : target[key]);
        keys.push(key);
      }
    }
    self._from = from;
    self._to = to;
    self._keys = keys;
    return self;
  }

  from(vars) {
    return this._v(vars, this.target, vars);
  }

  to(vars) {
    return this._v(this.target, vars, vars);
  }

  fromTo(fromVars, toVars) {
    return this._v(fromVars, toVars, fromVars);
  }

  _valid(value) {
    value = +value;
    return value === value;
  }

  reset() {
    this.seek(0, false, true);
  }

  _set(progress, reverse) {
    console.log('[engine] -> update:', progress, reverse, this.duration);
    const self = this;
    progress = self.ease(progress);
    if (reverse) {
      progress = 1 - progress;
    }
    self._keys.forEach((key) => {
      const from = self._from[key];
      const to = self._to[key];
      self.target[key] = from + (to - from) * progress;
    });
  }

  seek(duration, reverse, force) {
    console.log('[engine] -> seek1:', duration, reverse, force);
    const self = this;
    const seek = reverse ? self.duration - duration : duration;
    if (self.pos === seek && !force) return false;
    this.pos = seek;
    console.log('[engine] -> seek2:', duration, reverse);
    self._set(duration / self.duration, reverse);
    return true;
  }
}

export default Engine;
