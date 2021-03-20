
// 六角
function HexSlot(parameters) {
  Slot.call(this, parameters);
}

HexSlot.classExtend(Slot, {
  // 最小孔间距（中心距离）
  minCenters: function() {
    const size = this._params.size;
    switch (this._params.pattern) {
      case 'd60':
        return size;
      case 'd45':
        return size/cos((60-45)*RAD);
      case 'd90':
        return size/sin(60*RAD);
    }
    return Infinity;
  },

  prepareValues: function() {
    this._radius = this._params.size/(2*sin(60*RAD));

    return this;
  },

  // 计算起始点
  prepareOrigin: function() {
    this._origin = [this._params.size/2, this._radius];

    return this;
  },

  // 画孔
  draw: function(canvas) {
    const r = this._radius*PPI;

    this.getCentrePoints(canvas.width/PPI, canvas.height/PPI)
      .forEach(point => canvas.center(point[0]*PPI, point[1]*PPI).hex(r));

    return this;
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
