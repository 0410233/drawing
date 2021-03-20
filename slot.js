
// Slot 基类
function Slot(parameters) {
  this._params = parameters || {};

  this.validate();
  this.prepare();
}

Slot.prototype = {
  constructor: Slot,

  // 验证参数
  validate: function() {
    this.validateSize();
    this.validatePattern();
    this.validateCenters();
  },

  // 验证尺寸
  validateSize: function() {
    const params = this._params;
    params.size = toNumber(params.size);
    if (params.size <= 0) {
      throw __('孔径无效');
    }
  },

  // 验证形制
  validatePattern: function() {
    const paterns = ['d60','d45','d90'];
    if (paterns.indexOf(this._params.pattern) < 0) {
      throw __('形制无效');
    }
  },

  // 验证间距
  validateCenters: function() {
    const params = this._params;
    params.centers = toNumber(params.centers);

    const min = this.minCenters();
    if (params.centers <= min) {
      throw render(__('中心距必须大于 {min}'), {min: min.toFixed(2)});
    }
  },

  // 最小孔间距（中心距离）
  minCenters: function() {
    return this._params.size;
  },

  // 准备绘制
  prepare: function() {
    this.prepareValues();
    this.prepareOrigin();
    this.prepareDelta();

    return this;
  },

  prepareValues: function() {
    return this;
  },

  // 计算起始点
  prepareOrigin: function() {
    const size = this._params.size/2;
    this._origin = [size, size];

    return this;
  },

  // 计算相邻坐标偏移量
  prepareDelta: function() {
    const centers = this._params.centers;
    this._delta = [[centers, 0]];
    switch (this._params.pattern) {
      case 'd60':
        this._delta.push(
          [-1*centers*cos(60*RAD), -1*centers*sin(60*RAD)],
          [-1*centers*cos(60*RAD), centers*sin(60*RAD)]
        );
        break;

      case 'd45':
        this._delta.push(
          [-1*centers*cos(45*RAD), -1*centers*sin(45*RAD)],
          [-1*centers*cos(45*RAD), centers*sin(45*RAD)]
        );
        break;

      case 'd90':
        this._delta.push(
          [0, -centers],
          [-centers, 0],
          [0, centers]
        );
        break;
    }
    return this;
  },

  // 获取指定范围内所有可用的坐标
  getCentrePoints: function(width, height) {
    const points = [];
    const cache = {};

    const origin = this._origin.slice();
    points.push(origin);
    cache[origin.join(',')] = true;

    let related = [], fresh = [origin];
    while (true) {
      related = [];
      fresh.forEach(coords => {
        related = related.concat(this.relatedCentrePoints(coords[0], coords[1]));
      });

      fresh = [];
      related.forEach(coords => {
        coords = [toNumber(coords[0].toFixed(6)), toNumber(coords[1].toFixed(6))];
        const key = coords.join(',');
        if (!cache[key] && this.isValidCentrePoint(coords[0], coords[1], width, height)) {
          cache[key] = true;
          points.push(coords);
          fresh.push(coords)
        }
      });

      if (! fresh.length) {
        break;
      }
    }

    return points;
  },

  isValidCentrePoint: function(x, y, width, height) {
    return x >= 0 && x <= width && y >= 0 && y <= height;
  },

  // 获取与指定坐标相邻的坐标
  relatedCentrePoints: function(x, y) {
    return this._delta.map(delta => [x+delta[0], y+delta[1]]);
  },

  // 画孔
  draw: function() {
    throw render(__('{method} 方法必须重写'), {method: arguments.callee.name});
  },

  // 文字描述
  description: function() {
    throw render(__('{method} 方法必须重写'), {method: arguments.callee.name});
  },

  // 孔面积
  slotArea: function() {
    throw render(__('{method} 方法必须重写'), {method: arguments.callee.name});
  },

  // 开孔率
  openArea: function() {
    const centers = this._params.centers;
    const slotArea = this.slotArea();
    switch (this._params.pattern) {
      case 'd60':
        return (slotArea/2)/(centers*centers*cos(60*RAD)*sin(60*RAD));
      case 'd45':
        return (slotArea/2)/(centers*centers*cos(45*RAD)*sin(45*RAD));
      case 'd90':
        return slotArea/(centers*centers);
    }
  },

  // 每平方英寸开孔数
  holesPerSquareInch: function() {
    return this.openArea()/this.slotArea();
  },
};
