
// 方头孔
function RoundEndSlot(parameters) {
  SquareEndSlot.call(this, parameters);
}

RoundEndSlot.classExtend(SquareEndSlot, {
  // 画孔
  draw: function() {
    const width = this._params.width;
    const height = this._params.height;
    this._canvas.center(this._centerX, this._centerY).roundRect(width, height, height/2);

    return this.next();
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
    return width*(width-height*2)+Math.PI*((height/2)*(height/2));
  },
});
