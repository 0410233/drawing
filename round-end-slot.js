
// 方头孔
function RoundEndSlot(parameters) {
  SquareEndSlot.call(this, parameters);
}

RoundEndSlot.classExtend(SquareEndSlot, {

  // 画孔
  draw: function(canvas) {
    const width = this._params.width*PPI;
    const height = this._params.height*PPI;
    const radius = height/2;

    this.getCentres(canvas.width/PPI, canvas.height/PPI)
      .forEach(point => canvas.center(point[0]*PPI, point[1]*PPI).roundRect(width, height, radius));

    return this;
  },

  // 可用属性
  getAvailableProps: function() {
    return ['width','height','vert_gutter','hori_gutter'];
  },

  // 可用形制
  getAvailablePatterns: function() {
    return ['hori','vert','d90'];
  },

  // 文字描述
  getDescription: function() {
    const params = this._params;
    const msg = render('{width}" X {height}" Round End Slot with {vert_gutter}" Side Bars and {hori_gutter} End Bars', params);
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
    const width = this._params.width;
    const height = this._params.height;
    return width*(width-height)+PI*(height/2)*(height/2);
  },
});
