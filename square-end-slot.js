
// 方头孔
function SquareEndSlot(parameters) {
  Slot.call(this, parameters);
}

SquareEndSlot.classExtend(Slot, {

  // 验证尺寸
  validateSize: function() {
    const params = this._params;
    params.width = toNumber(params.width);
    params.height = toNumber(params.height);

    if (params.width <= 0 || params.height <= 0) {
      throw __('孔径无效');
    }
  },

  // 验证形制
  validatePattern: function() {
    const paterns = ['vert','hori','d90'];
    if (paterns.indexOf(this._params.pattern) < 0) {
      throw __('形制无效');
    }
  },

  // 验证间距
  validateCenters: function() {
    const params = this._params;
    params.vert_gutter = toNumber(params.vert_gutter);
    params.hori_gutter = toNumber(params.hori_gutter);

    if (params.vert_gutter <= 0 || params.hori_gutter <= 0) {
      throw __('间距必须大于 0');
    }
  },

  prepareValues: function() {
    const params = this._params;
    this._distanceX = params.width+params.hori_gutter;
    this._distanceY = params.height+params.vert_gutter;

    return this;
  },

  // 计算起始点
  prepareOrigin: function() {
    const params = this._params;
    this._origin = [-params.width/2, -params.height/2];

    return this;
  },

  // 计算相邻坐标偏移量
  prepareDelta: function() {
    const dx = this._distanceX;
    const dy = this._distanceY;
    switch (this._params.pattern) {
      case 'hori':
        this._delta = [
          [dx, 0],
          [-dx/2, -dy],
          [-dx/2, dy],
        ];
        break;

      case 'vert':
        this._delta = [
          [0, dy],
          [-dx, -dy/2],
          [dx, -dy/2],
        ];
        break;

      case 'd90':
        this._delta = [
          [dx, 0],
          [0, -dy],
          [-dx, 0],
          [0, dy],
        ];
        break;
    }

    return this;
  },

  // 画孔
  draw: function() {
    const width = this._params.width*PPI;
    const height = this._params.height*PPI;

    this.getCentrePoints(canvas.width/PPI, canvas.height/PPI)
      .forEach(point => canvas.center(point[0]*PPI, point[1]*PPI).rect(width, height));

    return this;
  },

  // 文字描述
  description: function() {
    const params = this._params;
    const patterns = {
      vert: 'End Staggered',
      hori: 'Side Staggered',
      d90: 'Straight Centers',
    };
    return `${params.width}" X ${params.height}" Rectangular Slot with ${params.vert_gutter}" Side Bars and ${params.hori_gutter} End Bars, ${patterns[params.pattern]}`;
  },

  // 孔面积
  slotArea: function() {
    return this._params.width*this._params.height;
  },

  // 开孔率
  openArea: function() {
    return this.slotArea()/(this._distanceX*this._distanceY);
  },
});
