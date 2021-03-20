
// 方孔
function SquareSlot(parameters) {
  Slot.call(this, parameters);
}

SquareSlot.classExtend(Slot, {
  // 最小孔间距（中心距离）
  minCenters: function() {
    const size = this._params.size;
    switch (this._params.pattern) {
      case 'd60':
        return size/Math.sin(60*RAD);
      case 'd45':
        return size/Math.sin(45*RAD);
      case 'd90':
        return size;
    }
    return Infinity;
  },

  // 文字描述
  description: function() {
    const params = this._params;
    const pattern = params.pattern == 'd90' ? 'Straight' : 'Staggered';
    return `${params.size}" Square ${params.centers}" ${pattern} Centers`;
  },

  // 在下一个绘制点绘制
  draw: function(canvas) {
    const r = this._params.size*PPI;

    this.getCentrePoints(canvas.width/PPI, canvas.height/PPI)
      .forEach(point => canvas.center(point[0]*PPI, point[1]*PPI).rect(r, r));

    return this;
  },

  // 孔面积
  slotArea: function() {
    const size = this._params.size;
    return size*size;
  },
});
