import Tween from '../src/tween';
describe('Tween API:', function () {
  describe('#Tween.seek()', function () {
    it('arrayEqual([1, 2, 3], [1, 2, 3]) should return true', function () {
      const tween = new Tween({ x: 0, y: 0 }, {
        duration: 100
      });
      const.seek(100);
    });
  });
});
