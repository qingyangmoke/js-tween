const pow = Math.pow;
const cos = Math.cos;
const sin = Math.sin;
const sqrt = Math.sqrt;
const PI = Math.PI;
// Based on easing equations from Robert Penner (http://www.robertpenner.com/easing)
const baseEasings = {
  Sine(p) {
    return 1 - cos(p * PI / 2);
  },
  Circ(p) {
    return 1 - sqrt(1 - p * p);
  },
  Elastic(p) {
    return p === 0 || p === 1
      ? p
      : -pow(2, 8 * (p - 1)) * sin(((p - 1) * 80 - 7.5) * PI / 15);
  },
  Back(p) {
    return p * p * (3 * p - 2);
  },
  Bounce(p) {
    let pow2,
      bounce = 4;
    while (p < ((pow2 = pow(2, --bounce)) - 1) / 11) { }
    return 1 / pow(4, 3 - bounce) - 7.5625 * pow((pow2 * 3 - 2) / 22 - p, 2);
  },
};
const keys = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];
keys.forEach((name, i) => {
  baseEasings[name] = function (p) {
    return pow(p, i + 2);
  };
});

const easings = {
  linear(p) {
    return p;
  },
  swing(p) {
    return 0.5 - cos(p * PI) / 2;
  },
};
for (const name in baseEasings) {
  const easeIn = baseEasings[name];
  easings[`easeIn${name}`] = easeIn;
  easings[`easeOut${name}`] = function (p) {
    return 1 - easeIn(1 - p);
  };
  easings[`easeInOut${name}`] = function (p) {
    return p < 0.5
      ? easeIn(p * 2) / 2
      : 1 - easeIn(p * -2 + 2) / 2;
  };
}
easings.default = easings.swing;
export default easings;
