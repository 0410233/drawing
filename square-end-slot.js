
// 方头孔
function SquareEndSlot(parameters) {
  Slot.call(this, parameters);
}

SquareEndSlot.classExtend(Slot, {

  // 画孔
  draw: function() {
    const width = this._params.width*PPI;
    const height = this._params.height*PPI;

    this.getCentres(canvas.width/PPI, canvas.height/PPI)
      .forEach(point => canvas.center(point[0]*PPI, point[1]*PPI).rect(width, height));

    return this;
  },

  // 可用属性
  getAvailableProps: function() {
    return ['width','height','gap_y','gap_x'];
  },

  // 可用形制
  getAvailablePatterns: function() {
    return ['hori','vert','d90'];
  },

  // 文字描述
  getDescription: function() {
    const params = this._params;
    const msg = render('{width}" X {height}" Rectangular Slot with {gap_y}" Side Bars and {gap_x} End Bars', params);
    switch (params.pattern) {
      case 'vert':
        return msg+', End Staggered';
      case 'hori':
        return msg+', Side Staggered';
      case 'd90':
        return msg+', Straight Centers';
    }
  },

  // 孔面积
  getSlotArea: function() {
    return this._params.width*this._params.height;
  },
});
