
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

    const x = i(this._centerX - width/2);
    const y = i(this._centerY - height/2);

    context.save();
    context.fillStyle = this._fillStyle;
    context.fillRect(x, y, i(width), i(height));
    context.restore();

    return this;
  },

  // 圆形
  circle: function circle(r) {
    const context = this.context;

    const x = i(this._centerX);
    const y = i(this._centerY);
    r = i(r);

    context.save();
    context.beginPath();
    context.fillStyle = this._fillStyle;
    context.arc(x, y, r, 0, 2*Math.PI);
    context.closePath();
    context.fill();
    context.restore();

    return this;
  },

  // 六边形
  hex: function hex(r) {
    const context = this.context;

    const x = i(this._centerX);
    const y = i(this._centerY - r);

    const rcos = i(r*Math.cos(Math.PI/6));
    const rsin = i(r/2);

    r = i(r);

    context.save();
    context.fillStyle = this._fillStyle;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + rcos, y + rsin);
    context.lineTo(x + rcos, y + rsin + r);
    context.lineTo(x, y + 2*r);
    context.lineTo(x - rcos, y + rsin + r);
    context.lineTo(x - rcos, y + rsin);
    context.closePath();
    context.fill();
    context.restore();

    return this;
  },

  // 圆形端孔
  roundRect: function roundRect(width, height, radius) {
    const context = this.context;

    const x = this._centerX;
    const y = this._centerY - height/2;

    context.save();
    context.fillStyle = this._fillStyle;
    context.beginPath();
    context.moveTo(i(x), i(y));
    context.arcTo(i(x+width/2), i(y), i(x+width/2), i(y+height/2), i(radius));
    context.arcTo(i(x+width/2), i(y+height), i(x), i(y+height), i(radius));
    context.arcTo(i(x-width/2), i(y+height), i(x-width/2), i(y+height/2), i(radius));
    context.arcTo(i(x-width/2), i(y), i(x), i(y), i(radius));
    context.closePath();
    context.fill();
    context.restore();

    return this;
  },

  // // 批量勾画孔型
  // printSlots: function printSlots(slot) {
  //   this.clear();
  //   slot.onCanvas(this);

  //   let count = 0;
  //   while (slot.draw(this)) {
  //     if (++count > 5) {
  //       // break;
  //     }
  //   }

  //   return this;
  // },

  // 清空画布
  clear: function clear() {
    this.context.clearRect(0, 0, this.width, this.height);

    return this;
  },
};
