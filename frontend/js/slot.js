
// Slot 基类
function Slot() {
  //
}

Slot.prototype = {
  constructor: Slot,

  // 初始化
  // 由已知参数计算其它必要参数
  init: function(params) {
    params.size = toNumber(params.size);
    params.centers = toNumber(params.centers);
    params.gap_x = toNumber(params.gap_x);
    params.gap_y = toNumber(params.gap_y);

    this._params = params;

    this.calculateSize();
    this.calculateDistance();

    return this;
  },

  // 计算孔尺寸
  calculateSize: function() {
    const params = this._params;

    params.width = params.width == null ? params.size : toNumber(params.width);
    params.height = params.height == null ? params.size : toNumber(params.height);

    return this;
  },

  // 计算 dx/dy
  // dx: 水平方向相邻孔间距
  // dy: 垂直方向相邻行间距
  calculateDistance: function() {
    const params = this._params;

    const centers = params.centers;
    const width = params.width;
    const height = params.height;
    const gapX = params.gap_x;
    const gapY = params.gap_y;

    switch (params.pattern) {
      case 'd60':
        params.dx = centers*cos(60*RAD)*2;
        params.dy = centers*sin(60*RAD);
        break;

      case 'd45':
        params.dx = centers*cos(45*RAD)*2;
        params.dy = centers*sin(45*RAD);
        break;

      case 'hori':
        params.dx = width+gapX;
        params.dy = height+gapY;
        break;

      case 'vert':
        params.dx = (width+gapX)*2;
        params.dy = (height+gapY)/2;
        break;

      case 'd90':
        params.dx = centers || (width+gapX);
        params.dy = centers || (height+gapY);
        break;
    }

    return this;
  },

  // 验证参数
  validate: function() {
    const params = this._params;

    // 验证尺寸
    if (!params.width || !params.height) {
      return '尺寸无效';
    }

    // 验证形制
    if (this.getAvailablePatterns().indexOf(params.pattern) < 0) {
      return '形制无效';
    }

    // 验证间距
    if (params.centers) {
      const min = this.getMinCenters();
      if (params.centers <= min) {
        return render('中心距必须大于 {min}', {min: min.toFixed(2)});
      }
    } else {
      if (params.gap_x <= 0 || params.gap_y <= 0) {
        return '中心距必须大于 0';
      }
    }

    return '';
  },

  // 最小孔间距（中心距离）
  getMinCenters: function() {
    return this._params.size;
  },

  // 获取所有孔的中心点的坐标
  getCentres: function(width, height) {
    const params = this._params;
    const finish = params.finish_type;
    const h = params.height/2;
    const w = params.width/2;
    const dx = params.dx;
    const dy = params.dy;

    const xCoords = [w, w];
    if (params.pattern != 'd90') {
      xCoords[1] += dx/2;
    }

    if (finish == 'unfinished') {
      xCoords[1] += dx;
    }

    const finishMode = finish == 'square' ? 1 : 0;

    const centres = [];
    let row = 0, x = 0, y = h;
    while (y+h <= height) {
      if (row%2 == finishMode && y+dy+h > height) {
        break;
      }
      x = xCoords[row%2];
      while (x-w < width) {
        centres.push([x,y]);
        x += dx;
      }
      y += dy;
      row += 1;
    }

    return centres;
  },

  // 画孔
  draw: function() {
    throw render('{method} 方法必须重写', {method: arguments.callee.name});
  },

  getAvailableProps: function() {
    throw render('{method} 方法必须重写', {method: arguments.callee.name});
  },

  getAvailablePatterns: function() {
    throw render('{method} 方法必须重写', {method: arguments.callee.name});
  },

  // 获取名称（标签）
  getName: function() {
    throw render('{method} 方法必须重写', {method: arguments.callee.name});
  },

  // 获取文字描述
  getDescription: function() {
    throw render('{method} 方法必须重写', {method: arguments.callee.name});
  },

  // 获取孔面积
  getSlotArea: function() {
    throw render('{method} 方法必须重写', {method: arguments.callee.name});
  },

  // 获取开孔率
  getOpenArea: function() {
    const params = this._params;
    return this.getSlotArea()/(params.dx*params.dy);
  },

  // 获取每平方英寸开孔数
  getHolesPerSquareInch: function() {
    const params = this._params;
    return 1/(params.dx*params.dy);
  },
};
