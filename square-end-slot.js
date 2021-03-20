
// 方头孔
function SquareEndSlot(parameters) {
  Slot.call(this, parameters);
}

SquareEndSlot.classExtend(Slot, {

  // 验证尺寸
  validateSize: function() {
    if (!this._params.width || this._params.width <= 0 ||
      !this._params.height || this._params.height <= 0) {
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
    if (this._params.vert_gutter <= 0 || this._params.hori_gutter <= 0) {
      throw __('间距必须大于 0');
    }
  },

  // 计算横向和纵向孔间距，以及初始偏移
  prepareOffset: function() {
    const params = this._params;

    this._distanceX = params.width+params.hori_gutter;
    this._distanceY = params.height+params.vert_gutter;

    switch (this._params.pattern) {
      case 'hori':
        this._offset = [params.width/2, params.width/2+this._distanceX/2];
        break;
      case 'vert':
        this._offset = [params.height/2, params.height/2+this._distanceY/2];
        break;
      case 'd90':
        this._offset = [params.width/2, params.width/2];
        break;
    }

    return this;
  },

  // 初始化布局参数
  prepareLayout: function() {
    const params = this._params;
    this._centerX = params.width/2;
    this._centerY = params.height/2;
    this._row = 0;

    return this;
  },

  // 计算下一个绘制点
  next: function() {
    const vert = this._params.pattern === 'vert';

    const row = vert ? '_centerY' : '_centerX';
    const col = vert ? '_centerX' : '_centerY';
    const rowmax = vert ? this._maxheight : this._maxwidth;
    const colmax = vert ? this._maxwidth : this._maxheight;
    const rowOffset = vert ? this._distanceY : this._distanceX;
    const colOffset = vert ? this._distanceX : this._distanceY;

    this[row] += rowOffset;
    if (this[row] > rowmax) {
      this._row += 1;
      this[row] = this._offset[this._row%2];
      this[col] += colOffset;
    }

    if (this[row] > rowmax || this[col] > colmax) {
      return false;
    }
    return true;
  },

  // 画孔
  draw: function() {
    this._canvas.center(this._centerX, this._centerY).rect(this._params.width, this._params.height);

    return this.next();
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
