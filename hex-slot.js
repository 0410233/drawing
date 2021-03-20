
// 六角
function HexSlot(parameters) {
  Slot.call(this, parameters);
}

HexSlot.classExtend(Slot, {
  // 最小孔间距（中心距离）
  minCenters: function() {
    const size = this._params.size;
    const rad = Math.PI/180;
    switch (this._params.pattern) {
      case 'd60':
        return size;
      case 'd45':
        return size/Math.cos((60-45)*rad);
      case 'd90':
        return size/Math.sin(60*rad);
    }
    return Infinity;
  },

  prepareValues: function() {
    this._radius = this._params.size/(2*Math.sin(60*Math.PI/180));

    return this;
  },

  // 初始化布局参数
  prepareLayout: function() {
    this._centerX = this._params.size/2;
    this._centerY = this._radius;
    this._row = 0;

    return this;
  },

  // 画孔
  draw: function() {
    this._canvas.center(this._centerX, this._centerY).hex(this._radius);

    return this.next();
  },

  // 文字描述
  description: function() {
    const params = this._params;
    const pattern = params.pattern == 'd90' ? 'Straight' : 'Staggered';
    return `${params.size}" Hex ${params.centers}" ${pattern} Centers`;
  },

  // 孔面积
  slotArea: function() {
    return (this._radius*(this._params.size/2)/2)*6;
  },
});
