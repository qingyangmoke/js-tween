/*!
 * js-tween
 * Description: tween 动画缓动库
 * Author: 清扬陌客
 * Version: v0.0.1
 * Github: https://github.com/qingyangmoke/js-tween.git
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Tween"] = factory();
	else
		root["Tween"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _easings = __webpack_require__(2);

	var _easings2 = _interopRequireDefault(_easings);

	var _tween = __webpack_require__(3);

	var _tween2 = _interopRequireDefault(_tween);

	var _pool = __webpack_require__(4);

	var _is = __webpack_require__(5);

	var is = _interopRequireWildcard(_is);

	var _engine = __webpack_require__(7);

	var _engine2 = _interopRequireDefault(_engine);

	var _timeline = __webpack_require__(8);

	var _timeline2 = _interopRequireDefault(_timeline);

	var _settings = __webpack_require__(6);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var version = '0.0.1';

	var Tween = _tween2.default;
	Tween.pool = _pool.pool;
	Tween.VERSION = version;
	Tween.easings = _easings2.default;

	Tween.update = function (now) {
	  now = now || Date.now();
	  _pool.pool.each(function (value) {
	    if (value.playing) {
	      value.update(now);
	    }
	  });
	};

	Tween.killOf = function (obj) {
	  if (obj instanceof Tween) {
	    obj.kill();
	  } else {
	    var tweens = _pool.pool.find(obj);
	    if (tweens) {
	      if (is.arr(tweens)) {
	        tweens.forEach(function (e) {
	          return e.kill();
	        });
	      } else {
	        tweens.kill();
	      }
	    }
	  }
	};

	Tween.killAll = function () {
	  _pool.pool.each(function (tween) {
	    tween.kill();
	  });
	  _pool.pool.removeAll();
	};

	function getTween(target, options) {
	  return new Tween(new _engine2.default(target, {
	    ease: options.ease,
	    duration: options.duration
	  }), Object.assign(_settings.defaultOptions, options));
	}

	Tween.to = function (target, vars, options) {
	  var tween = getTween(target, options);
	  tween._engine.to(vars);
	  return tween;
	};

	Tween.from = function (target, vars, options) {
	  var tween = getTween(target, options);
	  tween._engine.from(vars);
	  return tween;
	};

	Tween.fromTo = function (target, fromVars, toVars, options) {
	  var tween = getTween(target, options);
	  tween._engine.fromTo(fromVars, toVars);
	  return tween;
	};

	Tween.Timeline = _timeline2.default;

	module.exports = Tween;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var pow = Math.pow;
	var cos = Math.cos;
	var sin = Math.sin;
	var sqrt = Math.sqrt;
	var PI = Math.PI;
	// Based on easing equations from Robert Penner (http://www.robertpenner.com/easing)
	var baseEasings = {
	  Sine: function Sine(p) {
	    return 1 - cos(p * PI / 2);
	  },
	  Circ: function Circ(p) {
	    return 1 - sqrt(1 - p * p);
	  },
	  Elastic: function Elastic(p) {
	    return p === 0 || p === 1 ? p : -pow(2, 8 * (p - 1)) * sin(((p - 1) * 80 - 7.5) * PI / 15);
	  },
	  Back: function Back(p) {
	    return p * p * (3 * p - 2);
	  },
	  Bounce: function Bounce(p) {
	    var pow2 = void 0,
	        bounce = 4;
	    while (p < ((pow2 = pow(2, --bounce)) - 1) / 11) {}
	    return 1 / pow(4, 3 - bounce) - 7.5625 * pow((pow2 * 3 - 2) / 22 - p, 2);
	  }
	};
	var keys = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];
	keys.forEach(function (name, i) {
	  baseEasings[name] = function (p) {
	    return pow(p, i + 2);
	  };
	});

	var easings = {
	  linear: function linear(p) {
	    return p;
	  },
	  swing: function swing(p) {
	    return 0.5 - cos(p * PI) / 2;
	  }
	};

	var _loop = function _loop(name) {
	  var easeIn = baseEasings[name];
	  easings['easeIn' + name] = easeIn;
	  easings['easeOut' + name] = function (p) {
	    return 1 - easeIn(1 - p);
	  };
	  easings['easeInOut' + name] = function (p) {
	    return p < 0.5 ? easeIn(p * 2) / 2 : 1 - easeIn(p * -2 + 2) / 2;
	  };
	};

	for (var name in baseEasings) {
	  _loop(name);
	}

	exports.default = easings;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _pool = __webpack_require__(4);

	var _settings = __webpack_require__(6);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var EVENT_UPDATE = 'update';
	var EVENT_LOOP = 'loop';
	var EVENT_COMPLETE = 'complete';

	// idle
	var STATE_IDLE = 0;
	// 播放
	var STATE_PLAYING = 1;
	// 暂停
	var STATE_PAUSED = 2;

	var Tween = function () {
	  function Tween(tweenData, options) {
	    _classCallCheck(this, Tween);

	    this.options = Object.assign(_settings.defaultOptions, options || {});
	    this.id = (0, _pool.newId)();
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


	  _createClass(Tween, [{
	    key: 'timeScale',
	    value: function timeScale(value) {
	      if (value <= 0) return;
	      this._timeScale = value;
	    }
	  }, {
	    key: '_invoke',
	    value: function _invoke(name, args) {
	      var options = this.options;
	      options[name] && options[name](args);
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      var self = this;
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

	  }, {
	    key: 'playback',
	    value: function playback() {
	      var self = this;
	      self.pause();
	      self._killed = false;
	      self._playback = true;
	      self.resume();
	    }

	    /**
	     * 播放
	     * @param {boolean} reset - 是否重置
	     */

	  }, {
	    key: 'play',
	    value: function play(reset) {
	      if (this._killed) return;
	      var self = this;
	      var now = Date.now();
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
	      _pool.pool.add(self);
	    }
	  }, {
	    key: 'pause',
	    value: function pause(force) {
	      var self = this;
	      if (!force && !self.playing && this.paused) {
	        return;
	      }
	      self._pausedTime = Date.now();
	      self._state = STATE_PAUSED;
	      _pool.pool.remove(self);
	    }
	  }, {
	    key: 'resume',
	    value: function resume() {
	      var self = this;
	      self.play(self._state === STATE_IDLE);
	    }
	  }, {
	    key: 'stop',
	    value: function stop(reset) {
	      var self = this;
	      self._state = STATE_IDLE;
	      self._timeScale = 1;
	      if (reset) {
	        self.reset();
	      }
	      _pool.pool.remove(self);
	    }
	  }, {
	    key: 'toggle',
	    value: function toggle() {
	      var self = this;
	      if (self.paused) {
	        self.resume();
	      } else if (this.playing) {
	        self.pause();
	      } else {
	        self.play();
	      }
	    }
	  }, {
	    key: 'seek',
	    value: function seek(duration) {
	      var now = Date.now();
	      this._lastTime = now;
	      this._seekSegment = -1;
	      this._updateSeek(now, true);
	    }
	  }, {
	    key: 'kill',
	    value: function kill() {
	      var self = this;
	      if (self._killed) return;
	      self._killed = true;
	      _pool.pool.remove(self);
	    }
	  }, {
	    key: 'update',
	    value: function update(now) {
	      var self = this;
	      if (self._killed) return;
	      if (self._state !== STATE_PLAYING) return;
	      self._updateSeek(now);
	    }
	  }, {
	    key: '_updateSeek',
	    value: function _updateSeek(now, user) {
	      var self = this;

	      var elapsedMS = (now - self._lastTime) / self._timeScale;
	      self._lastTime = now;
	      self._elapsedMS += self._playback ? -elapsedMS : elapsedMS;

	      var _self$options = self.options,
	          delay = _self$options.delay,
	          duration = _self$options.duration,
	          repeatDelay = _self$options.repeatDelay,
	          yoyo = _self$options.yoyo,
	          repeat = _self$options.repeat,
	          autoKill = _self$options.autoKill;

	      var durationWidthDelay = duration + repeatDelay;
	      var seekAll = self._elapsedMS - delay;
	      var seekSegment = seekAll % durationWidthDelay;

	      if (seekAll < 0) {
	        seekSegment = 0;
	        seekAll = 0;
	      }

	      var seekRepeat = Math.floor(seekAll / durationWidthDelay);

	      var isYoyo = false;
	      if (yoyo) {
	        isYoyo = seekRepeat % 2 !== 0;
	      }

	      if (seekSegment >= duration) {
	        seekRepeat++;
	        seekSegment = duration;
	      }

	      if (self._seekSegment !== seekSegment) {
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
	          }
	        }
	      }
	    }
	  }, {
	    key: 'replay',
	    value: function replay() {
	      this.play(true);
	    }
	  }, {
	    key: 'paused',
	    get: function get() {
	      return this._state === STATE_PAUSED;
	    }
	  }, {
	    key: 'playing',
	    get: function get() {
	      return this._state === STATE_PLAYING;
	    }
	  }]);

	  return Tween;
	}();

	exports.default = Tween;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.pool = undefined;
	exports.newId = newId;

	var _is = __webpack_require__(5);

	var is = _interopRequireWildcard(_is);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var TWEENS = {};
	function _remove(tween) {
	  if (!has(tween)) return;
	  TWEENS[tween.id] = null;
	  delete TWEENS[tween.id];
	}

	function each(func) {
	  for (var key in TWEENS) {
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
	  var result = [];
	  each(function (value) {
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
	    tween.forEach(function (e) {
	      _remove(e);
	    });
	  } else {
	    return _remove(tween);
	  }
	}

	function removeAll() {
	  TWEENS = {};
	}

	var ids = 0;
	function newId() {
	  return (++ids).toString();
	}

	var pool = exports.pool = {
	  removeAll: removeAll,
	  remove: remove,
	  add: add,
	  has: has,
	  find: find,
	  each: each
	};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.arr = arr;
	exports.str = str;
	exports.obj = obj;
	exports.num = num;
	exports.ownProperty = ownProperty;
	function arr(value) {
	  return Object.prototype.toString.call(value) === '[object Array]';
	}

	function str(value) {
	  return typeof value === 'string';
	}

	function obj(value) {
	  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
	}

	function num(value) {
	  return typeof value === 'number';
	}

	function ownProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.defaultOptions = undefined;

	var _easings = __webpack_require__(2);

	var _easings2 = _interopRequireDefault(_easings);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var defaultOptions = exports.defaultOptions = {
	  /**
	   * 动画时长 ms
	   */
	  duration: 500,
	  /**
	   * 重复次数 -1 无限循环
	   */
	  repeat: 0,
	  /**
	   * 动画开始前的延迟时间 ms
	   */
	  delay: 0,
	  /**
	   * 动画缓动函数 Tween.easings
	   */
	  ease: _easings2.default.swing,
	  ignoreCheckKey: false,
	  autoKill: true,
	  repeatDelay: 0,
	  yoyo: false
	};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Engine = function () {
	  function Engine(obj, _ref) {
	    var ease = _ref.ease,
	        duration = _ref.duration;

	    _classCallCheck(this, Engine);

	    var self = this;
	    self.target = obj;
	    self.duration = duration;
	    self.ease = ease;
	    self.pos = -1;
	  }

	  _createClass(Engine, [{
	    key: '_v',
	    value: function _v(fromVars, toVars, baseVars) {
	      var self = this;
	      var from = {};
	      var to = {};
	      var keys = [];
	      var target = self.target;
	      for (var key in baseVars) {
	        if (key in target && self._valid(target[key])) {
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
	  }, {
	    key: 'from',
	    value: function from(vars) {
	      return this._v(vars, this.target, vars);
	    }
	  }, {
	    key: 'to',
	    value: function to(vars) {
	      return this._v(this.target, vars, vars);
	    }
	  }, {
	    key: 'fromTo',
	    value: function fromTo(fromVars, toVars) {
	      return this._v(fromVars, toVars, fromVars);
	    }
	  }, {
	    key: '_valid',
	    value: function _valid(value) {
	      value = +value;
	      return value === value;
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      this.seek(0, false, true);
	    }
	  }, {
	    key: '_set',
	    value: function _set(progress, reverse) {
	      var self = this;
	      progress = self.ease(progress);
	      if (reverse) {
	        progress = 1 - progress;
	      }
	      self._keys.forEach(function (key) {
	        var from = self._from[key];
	        var to = self._to[key];
	        self.target[key] = from + (to - from) * progress;
	      });
	    }
	  }, {
	    key: 'seek',
	    value: function seek(duration, reverse, force) {
	      var self = this;
	      var seek = reverse ? self.duration - duration : duration;
	      if (self.pos === seek && !force) return false;
	      this.pos = seek;

	      self._set(duration / self.duration, reverse);
	      return true;
	    }
	  }]);

	  return Engine;
	}();

	exports.default = Engine;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _tween = __webpack_require__(3);

	var _tween2 = _interopRequireDefault(_tween);

	var _is = __webpack_require__(5);

	var is = _interopRequireWildcard(_is);

	var _engine = __webpack_require__(7);

	var _engine2 = _interopRequireDefault(_engine);

	var _settings = __webpack_require__(6);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TimelineEngine = function () {
	  function TimelineEngine(options) {
	    _classCallCheck(this, TimelineEngine);

	    this.tweens = [];
	    this.seekPointer = 0;
	    this.options = options;
	    this.keys = [];
	  }

	  _createClass(TimelineEngine, [{
	    key: 'reset',
	    value: function reset() {
	      var tweens = this.tweens;
	      for (var i = tweens.length - 1; i >= 0; i--) {
	        var e = tweens[i];
	        e.reset();
	        e.running = false;
	      }
	    }
	  }, {
	    key: 'seek',
	    value: function seek(duration, reverse, force) {
	      reverse = reverse || false;
	      force = force || false;
	      var changed = false;
	      if (reverse) {
	        duration = this.duration - duration;
	      }
	      this.tweens.forEach(function (e) {
	        var running = e.start <= duration && e.end >= duration;
	        if (running) {
	          var seek = Math.min(e.duration, Math.max(0, duration - e.start));
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

	      return changed;
	    }
	  }, {
	    key: '_parse',
	    value: function _parse(to, from) {
	      var operator = /^(\+=|-=)/.exec(to);
	      if (!operator) return to;
	      var x = +from;
	      var y = +to.replace(operator[0], '');
	      switch (operator[0]) {
	        case '+=':
	          return x + y;
	        case '-=':
	          return x - y;
	        default:
	          throw new Error('格式错误');
	      }
	    }
	  }, {
	    key: '_add',
	    value: function _add(target, duration, position) {
	      position = position || position === 0 ? position : this.seekPointer;
	      var d = duration;
	      var ease = _settings.defaultOptions.ease;
	      if (is.obj(duration)) {
	        d = duration.duration;
	        ease = duration.ease;
	      }
	      duration = d;
	      var engine = new _engine2.default(target, {
	        ease: ease,
	        duration: duration
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
	  }, {
	    key: '_updateKeys',
	    value: function _updateKeys(engine) {
	      if (this.ignoreCheckKey) return;
	      var item = null;
	      var target = engine.target;
	      this.keys.forEach(function (e) {
	        if (e.target === target) {
	          item = e;
	        }
	      });
	      if (!item) {
	        item = {
	          target: target,
	          keys: []
	        };
	        this.keys.push(item);
	      }
	      engine._keys.forEach(function (key) {
	        if (item.keys.indexOf(key) === -1) {
	          item.keys.push(key);
	        }
	      });
	    }
	  }, {
	    key: '_keys',
	    value: function _keys(target) {
	      var keys = null;
	      this.keys.forEach(function (e) {
	        if (e.target === target) {
	          keys = e.keys;
	        }
	      });
	      return keys;
	    }
	  }, {
	    key: 'init',
	    value: function init() {
	      var _this = this;

	      if (this.ignoreCheckKey) return;
	      // 这里为了把key进行重新计算
	      this.tweens.forEach(function (e) {
	        var keys = _this._keys(e.target);

	        keys && keys.forEach(function (key) {
	          if (e._keys.indexOf(key) === -1) {
	            _this.seek(e.start, false, true);
	            e._from[key] = e.target[key];
	            _this.seek(e.end, false, true);
	            e._to[key] = e.target[key];
	            e._keys.push(key);
	          }
	        });
	      });
	    }
	  }, {
	    key: 'to',
	    value: function to(target, vars, duration, position) {
	      var engine = this._add(target, duration, position);
	      this.seek(engine.start, false, true);
	      engine.to(vars);
	      engine.running = false;
	      this._updateKeys(engine);
	      this.tweens.push(engine);
	      this.reset();
	    }
	  }, {
	    key: 'from',
	    value: function from(target, vars, duration, position) {
	      var engine = this._add(target, duration, position);
	      this.seek(engine.start, false, true);
	      engine.from(vars);

	      this._updateKeys(engine);
	      this.tweens.push(engine);
	      this.reset();
	    }
	  }, {
	    key: 'fromTo',
	    value: function fromTo(target, fromVars, toVars, duration, position) {
	      var engine = this._add(target, duration, position);
	      engine.fromTo(fromVars, toVars);
	      this._updateKeys(engine);
	      this.tweens.push(engine);
	    }
	  }, {
	    key: 'ignoreCheckKey',
	    get: function get() {
	      return this.options.ignoreCheckKey;
	    }
	  }, {
	    key: 'duration',
	    get: function get() {
	      return this.options.duration;
	    },
	    set: function set(value) {
	      this.options.duration = value;
	    }
	  }]);

	  return TimelineEngine;
	}();

	var Timeline = function (_Tween) {
	  _inherits(Timeline, _Tween);

	  function Timeline(options) {
	    _classCallCheck(this, Timeline);

	    options = Object.assign({
	      autoKill: false
	    }, options);

	    var _this2 = _possibleConstructorReturn(this, (Timeline.__proto__ || Object.getPrototypeOf(Timeline)).call(this, null, options));

	    _this2._engine = new TimelineEngine(_this2.options);
	    _this2._inited = false;
	    return _this2;
	  }

	  _createClass(Timeline, [{
	    key: 'init',
	    value: function init() {
	      if (!this._inited) {
	        this._inited = true;
	        this._engine.init();
	      }
	    }

	    /**
	    * 播放
	    * @param {boolean} reset - 是否重置
	    */

	  }, {
	    key: 'play',
	    value: function play(reset) {
	      this.init();
	      _get(Timeline.prototype.__proto__ || Object.getPrototypeOf(Timeline.prototype), 'play', this).call(this, reset);
	    }
	  }, {
	    key: 'to',
	    value: function to(target, vars, duration, position) {
	      this._engine.to(target, vars, duration, position);
	      this.seek(0);
	      this._inited = false;
	    }
	  }, {
	    key: 'from',
	    value: function from(target, vars, duration, position) {
	      this._engine.from(target, vars, duration, position);
	      this.seek(0);
	      this._inited = false;
	    }
	  }, {
	    key: 'fromTo',
	    value: function fromTo(target, fromVars, toVars, duration, position) {
	      this._engine.fromTo(target, fromVars, toVars, duration, position);
	      this.seek(0);
	      this._inited = false;
	    }
	  }]);

	  return Timeline;
	}(_tween2.default);

	exports.default = Timeline;

/***/ })
/******/ ])
});
;