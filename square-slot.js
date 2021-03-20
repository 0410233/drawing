
// 方孔
function SquareSlot(parameters) {
  Slot.call(this, parameters);
}

SquareSlot.classExtend(Slot, {
  // 最小孔间距（中心距离）
  minCenters: function() {
    const size = this._params.size;
    const rad = Math.PI/180;
    switch (this._params.pattern) {
      case 'd60':
        return size/Math.sin(60*rad);
      case 'd45':
        return size/Math.sin(45*rad);
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
  draw: function() {
    const size = this._params.size;
    this._canvas.center(this._centerX, this._centerY).rect(size, size);

    return this.next();
  },

  // 孔面积
  slotArea: function() {
    return this._params.size*this._params.size;
  },
});
