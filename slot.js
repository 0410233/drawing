
// Slot 基类
function Slot() {
  //
}

Slot.prototype = {
  constructor: Slot,

  // 初始化
  // 由已知参数计算其它必要参数
  init: function(params) {
    params.size = n(params.size);
    params.centers = n(params.centers);
    params.hori_gutter = n(params.hori_gutter);
    params.vert_gutter = n(params.vert_gutter);

    this._params = params;

    this.calculateSize();
    this.calculateDistance();

    return this;
  },

  // 计算孔尺寸
  calculateSize: function() {
    const params = this._params;

    params.width = params.width == null ? params.size : n(params.width);
    params.height = params.height == null ? params.size : n(params.height);

    return this;
  },

  // 计算孔距
  calculateDistance: function() {
    const params = this._params;

    const centers = params.centers;
    const width = params.width;
    const height = params.height;
    const gutterX = params.hori_gutter;
    const gutterY = params.vert_gutter;

    switch (params.pattern) {
      case 'd60':
        params.dx = centers*cos(60*RAD)*2;
        params.dy = centers*sin(60*RAD)*2;
        break;

      case 'd45':
        params.dx = centers*cos(45*RAD)*2;
        params.dy = centers*sin(45*RAD)*2;
        break;

      case 'hori':
        params.dx = width+gutterX;
        params.dy = (height+gutterY)*2;
        break;

      case 'vert':
        params.dx = (width+gutterX)*2;
        params.dy = height+gutterY;
        break;

      case 'd90':
        params.dx = centers || (width+gutterX);
        params.dy = centers || (height+gutterY);
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
      if (params.hori_gutter <= 0 || params.vert_gutter <= 0) {
        return '中心距必须大于 0';
      }
    }

    return '';
  },

  // 最小孔间距（中心距离）
  getMinCenters: function() {
    return this._params.size;
  },

  // 获取每列第一个中心点
  getCentres: function(width, height) {
    const params = this._params;
    const finish = params.finish_type;
    const h = params.height/2;
    const w = params.width/2;
    const dx = params.dx;
    const dy = params.pattern == 'd90' ? params.dy : params.dy/2;

    const xCoords = [w, w];
    if (params.pattern != 'd90') {
      xCoords[1] += dx/2;
    }

    if (finish == 'unfinished') {
      xCoords[1] += dx;
    }

    const finishMode = 'finished_square' ? 1 : 0;

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
    const count = params.pattern == 'd90' ? 1 : 2;
    return this.getSlotArea()*count/(params.dx*params.dy);
  },

  // 获取每平方英寸开孔数
  getHolesPerSquareInch: function() {
    return this.getOpenArea()/this.getSlotArea();
  },


  /////////////////////////////////////////////////////////////////////////////////////////////////

  // // 计算起始点
  // prepareOrigin: function() {
  //   const params = this._params;
  //   this._origin = [params.width/2, params.height/2];

  //   return this;
  // },

  // // 计算相邻坐标偏移量
  // prepareDelta: function() {
  //   const centers = this._params.centers;
  //   this._delta = [[centers, 0]];
  //   switch (this._params.pattern) {
  //     case 'd60':
  //       this._delta.push(
  //         [-1*centers*cos(60*RAD), -1*centers*sin(60*RAD)],
  //         [-1*centers*cos(60*RAD), centers*sin(60*RAD)]
  //       );
  //       break;

  //     case 'd45':
  //       this._delta.push(
  //         [-1*centers*cos(45*RAD), -1*centers*sin(45*RAD)],
  //         [-1*centers*cos(45*RAD), centers*sin(45*RAD)]
  //       );
  //       break;

  //     case 'd90':
  //       this._delta.push(
  //         [0, -centers],
  //         [-centers, 0],
  //         [0, centers]
  //       );
  //       break;
  //   }
  //   return this;
  // },

  // // 获取指定范围内所有可用的坐标
  // getCentres: function(width, height) {
  //   const points = [];
  //   const cache = {};

  //   const origin = this._origin.slice();
  //   points.push(origin);
  //   cache[origin.join(',')] = true;

  //   let related = [], fresh = [origin];
  //   while (true) {
  //     related = [];
  //     fresh.forEach(coords => {
  //       related = related.concat(this.relatedCentrePoints(coords[0], coords[1]));
  //     });

  //     fresh = [];
  //     related.forEach(coords => {
  //       coords = [n(coords[0].toFixed(6)), n(coords[1].toFixed(6))];
  //       const key = coords.join(',');
  //       if (!cache[key] && this.isValidCentre(coords[0], coords[1], width, height)) {
  //         cache[key] = true;
  //         points.push(coords);
  //         fresh.push(coords)
  //       }
  //     });

  //     if (! fresh.length) {
  //       break;
  //     }
  //   }

  //   return points;
  // },

  // // 获取与指定坐标相邻的坐标
  // getRelatedCentrePoints: function(x, y) {
  //   return this._delta.map(delta => [x+delta[0], y+delta[1]]);
  // },

  // isValidCentre: function(x, y, width, height) {
  //   const minX = this._params.width/2;
  //   const minY = this._params.height/2;

  //   return (Math.abs(x) < minX || Math.abs(x-width) < minX) && (Math.abs(y) < minY || Math.abs(y-height) < minY);
  // },

};
