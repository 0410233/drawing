
// 六角
function HexSlot(parameters) {
  Slot.call(this, parameters);
}

HexSlot.classExtend(Slot, {

  // 计算孔尺寸
  calculateSize: function() {
    const params = this._params;

    params.width = params.size;
    params.height = params.size/sin(60*RAD);

    return this;
  },

  // 最小孔间距（中心距离）
  getMinCenters: function() {
    const params = this._params;
    const width = params.width;
    const height = params.height;
    switch (params.pattern) {
      case 'd60':
        return width;
      case 'd45':
        return width/cos((60-45)*RAD);
      case 'd90':
        return height;
    }
    return 0;
  },

  // 画孔
  draw: function(canvas) {
    const r = this._params.height*PPI/2;

    this.getCentres(canvas.width/PPI, canvas.height/PPI)
      .forEach(function(point) {
        canvas.center(point[0]*PPI, point[1]*PPI).hex(r);
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
    return 'Hex';
  },

  // 文字描述
  getDescription: function() {
    const params = this._params;
    const pattern = params.pattern == 'd90' ? 'Straight' : 'Staggered';
    return params.size + '" Hex '+params.centers+'" '+pattern+' Centers';
  },

  // 孔面积
  getSlotArea: function() {
    const params = this._params;
    const r = params.height/2;
    const h = params.width/2;
    return r*h*3;
  },
});
