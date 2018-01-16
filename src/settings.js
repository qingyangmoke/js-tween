import easings from './easings';

export const defaultOptions = {
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
  ease: easings.swing,
  ignoreCheckKey: false,
  autoKill: true,
  repeatDelay: 0,
  yoyo: false,
};

