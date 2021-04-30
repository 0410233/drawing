
// 圆孔
function RoundSlot(parameters) {
  Slot.call(this, parameters);
}

RoundSlot.classExtend(Slot, {
  // 画孔
  draw: function(canvas) {
    const r = this._params.size*PPI/2;

    this.getCentres(canvas.width/PPI, canvas.height/PPI)
      .forEach(function(coords) {
        canvas.center(coords[0]*PPI, coords[1]*PPI).circle(r);
      });

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

  // 获取名称（标签）
  getName: function() {
    return 'Round';
  },

  // 文字描述
  getDescription: function() {
    const params = this._params;
    const pattern = params.pattern == 'd90' ? 'Straight' : 'Staggered';
    return params.size + '" Diameter '+params.centers+'" '+pattern+' Centers';
  },

  // 孔面积
  getSlotArea: function() {
    const r = this._params.size/2;
    return PI*r*r;
  },
});
