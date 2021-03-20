
// 圆孔
function RoundSlot(parameters) {
  Slot.call(this, parameters);
}

RoundSlot.classExtend(Slot, {
  // 画孔
  draw: function(canvas) {
    const r = this._params.size*PPI/2;

    this.getCentrePoints(canvas.width/PPI, canvas.height/PPI)
      .forEach(point => canvas.center(point[0]*PPI, point[1]*PPI).circle(r));

    return this;
  },

  // 文字描述
  description: function() {
    const params = this._params;
    const pattern = params.pattern == 'd90' ? 'Straight' : 'Staggered';
    return `${params.size}" Diameter ${params.centers}" ${pattern} Centers`;
  },

  // 孔面积
  slotArea: function() {
    const r = this._params.size/2;
    return PI*r*r;
  },
});
