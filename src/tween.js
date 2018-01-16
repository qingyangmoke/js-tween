
import { pool, newId } from './pool';
import { defaultOptions } from './settings';

const EVENT_UPDATE = 'update';
const EVENT_LOOP = 'loop';
const EVENT_COMPLETE = 'complete';

// idle
const STATE_IDLE = 0;
// 播放
const STATE_PLAYING = 1;
// 暂停
const STATE_PAUSED = 2;

class Tween {
  constructor(tweenData, options) {
    this.options = Object.assign(defaultOptions, options || {});
    this.id = newId();
    this._engine = tweenData;
    this._elapsedMS = 0;
    this._seekSegment = -1;
    this._state = STATE_IDLE;
    this._pausedTime = 0;
    this._startTime = 0;
    this._killed = false;
    this._lastTime = 0;
    this._playback = false;
    // 快进的倍数 立马生效
    this._timeScale = 1;
  }

  /**
   * 时间的缩放 取值必须 >0 否则无效
   * @param {number} value - 缩放的倍数 1是默认 <1快进 >1慢放
   */
  timeScale(value) {
    if (value <= 0) return;
    this._timeScale = value;
  }

  _invoke(name, args) {
    const options = this.options;
    options[name] && options[name](args);
  }

  get paused() {
    return this._state === STATE_PAUSED;
  }

  get playing() {
    return this._state === STATE_PLAYING;
  }

  reset() {
    const self = this;
    self._state = STATE_IDLE;
    self._engine.reset(0);
    self._elapsedMS = 0;
    self._killed = false;
    self._playback = false;
    self._seekSegment = -1;
    // self._timeScale = 1;
  }

  /**
   * 回放功能
   */
  playback() {
    const self = this;
    self.pause();
    self._killed = false;
    self._playback = true;
    self.resume();
  }

  /**
   * 播放
   * @param {boolean} reset - 是否重置
   */
  play(reset) {
    if (this._killed) return;
    const self = this;
    const now = Date.now();
    self._lastTime = now;
    if (!reset && self.paused) {
      self._startTime += now - self._pausedTime;
      self._state = STATE_PLAYING;
    } else {
      if (!reset && self.playing) return;
      self.reset();
      self._startTime = now + self.options.delay;
      self._state = STATE_PLAYING;
    }
    pool.add(self);
  }

  pause(force) {
    const self = this;
    if (!force && !self.playing && this.paused) {
      return;
    }
    self._pausedTime = Date.now();
    self._state = STATE_PAUSED;
    pool.remove(self);
  }

  resume() {
    const self = this;
    self.play(self._state === STATE_IDLE);
  }

  stop(reset) {
    const self = this;
    self._state = STATE_IDLE;
    self._timeScale = 1;
    if (reset) {
      self.reset();
    }
    pool.remove(self);
  }

  toggle() {
    const self = this;
    if (self.paused) {
      self.resume();
    } else if (this.playing) {
      self.pause();
    } else {
      self.play();
    }
  }

  seek(duration) {
    const now = Date.now();
    this._lastTime = now;
    this._seekSegment = -1;
    this._updateSeek(now, true);
  }

  kill() {
    const self = this;
    if (self._killed) return;
    self._killed = true;
    pool.remove(self);
  }

  update(now) {
    const self = this;
    if (self._killed) return;
    if (self._state !== STATE_PLAYING) return;
    self._updateSeek(now);
  }

  _updateSeek(now, user) {
    const self = this;
    console.log(now - self._lastTime);
    const elapsedMS = (now - self._lastTime) / self._timeScale;
    self._lastTime = now;
    self._elapsedMS += self._playback ? -elapsedMS : elapsedMS;

    const { delay, duration, repeatDelay, yoyo, repeat, autoKill } = self.options;
    const durationWidthDelay = duration + repeatDelay;
    let seekAll = self._elapsedMS - delay;
    let seekSegment = seekAll % durationWidthDelay;

    console.log(elapsedMS, self._elapsedMS, seekAll, seekSegment);
    if (seekAll < 0) {
      seekSegment = 0;
      seekAll = 0;
    }

    let seekRepeat = Math.floor(seekAll / durationWidthDelay);

    let isYoyo = false;
    if (yoyo) {
      isYoyo = seekRepeat % 2 !== 0;
    }

    if (seekSegment >= duration) {
      seekRepeat++;
      seekSegment = duration;
    }

    if (self._seekSegment !== seekSegment) {
      console.log(self._elapsedMS, seekAll, seekSegment, duration, seekRepeat, isYoyo);
      if (self._engine.seek(seekSegment, isYoyo) || self._seekSegment === -1) {
        self._invoke(EVENT_UPDATE);
      }
      self._seekSegment = seekSegment;
    }

    if (!user) {
      if (self._playback) {
        if (seekAll <= 0) {
          self.stop();
          self._invoke(EVENT_COMPLETE);
          if (autoKill) {
            self.kill();
          }
          console.log('_playback complete', seekAll);
          self._playback = false;
        }
      } else {
        if (seekRepeat < repeat || repeat === -1) {
          self._startTime = now + repeatDelay;
          self._invoke(EVENT_LOOP, seekRepeat);
        } else {
          self.stop();
          self._invoke(EVENT_COMPLETE);
          if (autoKill) {
            self.kill();
          }
          console.log('complete', seekAll, seekRepeat);
        }
      }
    }
  }
  replay() {
    this.play(true);
  }
}

export default Tween;
