
function Canvas(element) {
  if (typeof element == 'string') {
    element = document.querySelector(element);
  }
  if (! element instanceof HTMLCanvasElement) {
    throw '请指定 canvas 元素或其选择器';
  }

  const rect = element.getBoundingClientRect();
  element.width = rect.width;
  element.height = rect.height;

  this.canvas = element;
  this.context = element.getContext('2d');

  this.width = rect.width;
  this.height = rect.height;

  this._fillStyle = '#000000';
  this._strokeStyle = '#000000';

  this._centerX = 0;
  this._centerY = 0;
}

Canvas.prototype = {
  constructor: Canvas,

  // 指定填充样式
  fillStyle: function fillStyle(fillStyle) {
    this._fillStyle = fillStyle;

    return this;
  },

  // 指定线条样式
  strokeStyle: function strokeStyle(strokeStyle) {
    this._strokeStyle = strokeStyle;

    return this;
  },

  // 指定中心点
  center: function center(x, y) {
    this._centerX = parseFloat(x) || 0;
    this._centerY = parseFloat(y) || 0;

    return this;
  },

  // 矩形
  rect: function rect(width, height) {
    const context = this.context;

    const x = this._centerX;
    const y = this._centerY;

    context.save();
    context.fillStyle = this._fillStyle;
    context.fillRect(toInt(x-width/2), toInt(y-height/2), toInt(width), toInt(height));
    context.restore();

    return this;
  },

  // 圆形
  circle: function circle(r) {
    const context = this.context;

    const x = this._centerX;
    const y = this._centerY;

    context.save();
    context.beginPath();
    context.fillStyle = this._fillStyle;
    context.arc(toInt(x), toInt(y), toInt(r), 0, 2*Math.PI);
    context.closePath();
    context.fill();
    context.restore();

    return this;
  },

  // 六边形
  hex: function hex(r) {
    const context = this.context;

    const x = this._centerX;
    const y = this._centerY;
    const a = 60*RAD;

    context.save();
    context.fillStyle = this._fillStyle;
    context.beginPath();

    context.moveTo(toInt(x), toInt(y));
    for (let i = 0; i <= 6; i++) {
      context.lineTo(toInt(x + r*cos(i*a)), toInt(y + r*sin(i*a)));
    }

    context.closePath();
    context.fill();
    context.restore();

    return this;
  },

  // 圆形端孔
  roundRect: function roundRect(width, height, radius) {
    const context = this.context;

    const x = this._centerX;
    const y = this._centerY;
    const dx = width/2;
    const dy = height/2;

    context.save();
    context.fillStyle = this._fillStyle;
    context.beginPath();
    context.moveTo(toInt(x), toInt(y-dy));
    context.arcTo(toInt(x+dx), toInt(y-dy), toInt(x+dx), toInt(y), radius);
    context.arcTo(toInt(x+dx), toInt(y+dy), toInt(x), toInt(y+dy), radius);
    context.arcTo(toInt(x-dx), toInt(y+dy), toInt(x-dx), toInt(y), radius);
    context.arcTo(toInt(x-dx), toInt(y-dy), toInt(x), toInt(y-dy), radius);
    context.closePath();
    context.fill();
    context.restore();

    return this;
  },

  // 清空画布
  clear: function clear() {
    this.context.clearRect(0, 0, this.width, this.height);

    return this;
  },
};
