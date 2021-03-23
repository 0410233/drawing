
// 方孔
function SquareSlot(parameters) {
  Slot.call(this, parameters);
}

SquareSlot.classExtend(Slot, {
  props: ['size','centers'],
  patterns: ['d60','d45','d90'],

  // 最小孔间距（中心距离）
  getMinCenters: function() {
    const size = this._params.size;
    switch (this._params.pattern) {
      case 'd60':
        return size/sin(60*RAD);
      case 'd45':
        return size/sin(45*RAD);
      case 'd90':
        return size;
    }
    return 0;
  },

  // 在下一个绘制点绘制
  draw: function(canvas) {
    const r = this._params.size*PPI;

    this.getCentres(canvas.width/PPI, canvas.height/PPI)
      .forEach(point => canvas.center(point[0]*PPI, point[1]*PPI).rect(r, r));

    return this;
  },

  // 可用属性
  getAvailableProps: function() {
    return ['size','centers'];
  },

  // 可用形制
  getAvailablePatterns: function() {
    return ['d60','d45','d90'];
  },

  // 文字描述
  getDescription: function() {
    const params = this._params;
    const pattern = params.pattern == 'd90' ? 'Straight' : 'Staggered';
    return `${params.size}" Square ${params.centers}" ${pattern} Centers`;
  },

  // 孔面积
  getSlotArea: function() {
    const size = this._params.size;
    return size*size;
  },
});
