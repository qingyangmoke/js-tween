
declare interface TweenEasing {
  static easeInSine(p: number): number
  static easeOutSine(p: number): number
  static easeInOutSine(p: number): number

  static easeInCirc(p: number): number;
  static easeOutCirc(p: number): number;
  static easeInOutCirc(p: number): number;

  static easeInElastic(p: number): number;
  static easeOutElastic(p: number): number;
  static easeInOutElastic(p: number): number;

  static easeInBack(p: number): number;
  static easeOutBack(p: number): number;
  static easeInOutBack(p: number): number;

  static easeInBounce(p: number): number;
  static easeOutBounce(p: number): number;
  static easeInOutBounce(p: number): number;

  static easeInQuad(p: number): number;
  static easeOutQuad(p: number): number;
  static easeInOutQuad(p: number): number;

  static easeInCubic(p: number): number;
  static easeOutCubic(p: number): number;
  static easeInOutCubic(p: number): number;

  static easeInQuart(p: number): number;
  static easeOutQuart(p: number): number;
  static easeInOutQuart(p: number): number;

  static easeInQuint(p: number): number;
  static easeOutQuint(p: number): number;
  static easeInOutQuint(p: number): number;

  static easeInExpo(p: number): number;
  static easeOutExpo(p: number): number;
  static easeInOutExpo(p: number): number;

  static linear(p: number): number;

  static swing(p: number): number;
}

declare interface TweenOptions {
  duration?: number = 500;
  repeat?: number = 0;
  delay?: number = 0;
  ease?: (n) => number = easings.swing;
  ignoreCheckKey?: boolean = false;
  autoKill?: boolean = true;
  repeatDelay?: number = 0;
  yoyo?: boolean = false;
}

declare class Tween {
  constructor(tweenData, options?: TweenOptions);
  readonly paused: boolean;
  readonly playing: boolean;

  timeScale(value: number);

  /**
   * 回放功能
   */
  playback();

  play(reset?: boolean);

  pause(force?: boolean);

  resume();

  stop(reset?: boolean);

  toggle();

  seek(duration: number);

  kill();

  replay();
}

declare class TweenTimeline extends Tween {
  constructor(options?: TweenOptions);

  to(target: any, vars: Object, duration: number, position?: number);

  from(target: any, vars: Object, duration: number, position?: number);

  fromTo(target: any, fromVars: Object, toVars: Object, duration: number, position?: number);
}

declare namespace Tween {
  function update(now?: number = Date.now());
  function killOf(obj: Tween | any);
  function to(target: any, vars: Object, options?: TweenOptions);
  function from(target: any, vars: Object, options?: TweenOptions);
  function fromTo(target: any, fromVars: Object, toVars: Object, options?: TweenOptions);
  const Timeline: TweenTimeline;
  const VERSION: String;
  const easings: TweenEasing;
}

