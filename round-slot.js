
// 圆孔
function RoundSlot(parameters) {
  Slot.call(this, parameters);
}

RoundSlot.classExtend(Slot, {
  // 文字描述
  description: function() {
    const params = this._params;
    const pattern = params.pattern == 'd90' ? 'Straight' : 'Staggered';
    return `${params.size}" Diameter ${params.centers}" ${pattern} Centers`;
  },

  // 画孔
  draw: function() {
    this._canvas.center(this._centerX, this._centerY).circle(this._params.size/2);

    return this.next();
  },

  // 孔面积
  slotArea: function() {
    const size = this._params.size;
    return Math.PI*size*size/4;
  },
});
