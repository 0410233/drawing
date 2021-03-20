
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
    if (!this._params.size || this._params.size <= 0) {
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
    const min = this.minCenters();
    if (!this._params.centers || this._params.centers <= min) {
      throw render(__('中心距必须大于 {min}'), {min: min});
    }
  },

  // 最小孔间距（中心距离）
  minCenters: function() {
    return this._params.size;
  },

  // 准备绘制
  prepare: function() {
    this.prepareValues();
    this.prepareOffset();
    this.prepareLayout();
  },

  // 计算中间值（如果有的话）
  prepareValues: function() {
    return this;
  },

  // 计算横向和纵向孔间距，以及初始偏移
  prepareOffset: function() {
    const size = this._params.size;
    const centers = this._params.centers;
    const rad = Math.PI/180;
    switch (this._params.pattern) {
      case 'd60':
        this._distanceX = centers*Math.cos(60*rad)*2;
        this._distanceY = centers*Math.sin(60*rad);
        this._offset = [size/2, size/2+this._distanceX/2];
        break;
      case 'd45':
        this._distanceX = centers*Math.cos(45*rad)*2;
        this._distanceY = centers*Math.sin(45*rad);
        this._offset = [size/2, size/2+this._distanceX/2];
        break;
      case 'd90':
        this._distanceX = centers;
        this._distanceY = centers;
        this._offset = [size/2, size/2];
        break;
    }

    return this;
  },

  // 初始化布局参数
  prepareLayout: function() {
    const size = this._params.size;
    this._centerX = size/2;
    this._centerY = size/2;
    this._row = 0;

    return this;
  },

  // 指定画布
  onCanvas: function(canvas) {
    this._canvas = canvas;
    this._maxwidth = canvas.width;
    this._maxheight = canvas.height;

    return this;
  },

  // 计算下一个绘制点
  next: function() {
    this._centerX += this._distanceX;
    if (this._centerX > this._maxwidth) {
      this._row += 1;
      this._centerX = this._offset[this._row%2];
      this._centerY += this._distanceY;
    }
    if (this._centerX > this._maxwidth || this._centerY > this._maxheight) {
      return false;
    }
    return true;
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
    const rad = Math.PI/180;
    const slotArea = this.slotArea();
    switch (this._params.pattern) {
      case 'd60':
        return (slotArea/2)/(centers*centers*Math.cos(60*rad)*Math.sin(60*rad));
      case 'd45':
        return (slotArea/2)/(centers*centers*Math.cos(45*rad)*Math.sin(45*rad));
      case 'd90':
        return slotArea/(centers*centers);
    }
  },

  // 每平方英寸开孔数
  holesPerSquareInch: function() {
    return this.openArea()/this.slotArea();
  },
};
