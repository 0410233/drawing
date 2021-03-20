
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

    this.getCentrePoints(canvas.width/PPI, canvas.height/PPI)
      .forEach(point => canvas.center(point[0]*PPI, point[1]*PPI).roundRect(width, height, radius));

    return this;
  },

  // 文字描述
  description: function() {
    const params = this._params;
    const patterns = {
      vert: 'End Staggered',
      hori: 'Side Staggered',
      d90: 'Straight Centers',
    };
    return `${params.width}" X ${params.height}" Round End Slot with ${params.vert_gutter}" Side Bars and ${params.hori_gutter} End Bars, ${patterns[params.pattern]}`;
  },

  // 孔面积
  slotArea: function() {
    const width = this._params.width;
    const height = this._params.height;
    return width*(width-height*2)+PI*((height/2)*(height/2));
  },
});
