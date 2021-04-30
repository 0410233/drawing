// 生成画布对象
const canvas = new Canvas('canvas');

const controller = new Vue({
  el: '#controller',
  data: function() {
    return {
      slot: {
        name: 'RoundSlot',
        pattern: 'd60',
        size: null,
        centers: null,
        width: null,
        height: null,
        gap_y: null,
        gap_x: null,
        finish_type: 'unfinished',
      },
      mm: {
        size: null,
        centers: null,
        width: null,
        height: null,
        gap_y: null,
        gap_x: null,
      },
      message: {
        error: null,
        desc: null,
        psi: null,
        oa: null,
      },
      drawed: false,
      loading: false,
      slots: {
        'RoundSlot': {
          label: 'Round',
          slot: new RoundSlot(),
        },
        'SquareSlot': {
          label: 'Square',
          slot: new SquareSlot(),
        },
        'HexSlot': {
          label: 'Hex',
          slot: new HexSlot(),
        },
        'RoundEndSlot': {
          label: 'Round End Slot',
          slot: new RoundEndSlot(),
        },
        'SquareEndSlot': {
          label: 'Square End Slot',
          slot: new SquareEndSlot(),
        },
      },
      patterns: {
        d60: '60 Deg',
        d45: '45 Deg',
        hori: 'Side Staggered',
        vert: 'End Staggered',
        d90: 'Straight',
      },
    };
  },

  computed: {
    availableProps: function() {
      return this.currentSlot.getAvailableProps();
    },

    availablePatterns: function() {
      const patterns = this.currentSlot.getAvailablePatterns();
      if (patterns.indexOf(this.slot.pattern) < 0) {
        this.slot.pattern = patterns[0];
      }
      const labels = this.patterns;
      return patterns.map(function(pattern) {
        return {name:pattern,label:labels[pattern]};
      });
    },

    currentSlot: function() {
      return this.slots[this.slot.name].slot;
    },
  },

  methods: {
    checkNumber: function(event) {
      // 不允许正负号
      if (event.key == '-' || event.key == '+') {
        event.preventDefault();
      }
    },

    handleInchChange: function(prop) {
       const num = this.slot[prop]*25.4;
       this.mm[prop] = toNumber(num.toFixed(4));
    },

    handleMmChange: function(prop) {
      const num = this.mm[prop]/25.4;
      this.slot[prop] = toNumber(num.toFixed(4));
    },

    draw: function() {
      this.drawed = false;

      const msg = this.message;
      msg.error = null;
      msg.desc = null;
      msg.psi = null;
      msg.oa = null;

      const slotData = this.slot;
      const props = {
        pattern: slotData.pattern,
        finish_type: slotData.finish_type,
      };
      this.availableProps.forEach(function(prop) {
        props[prop] = toNumber(slotData[prop])
      });

      const slot = this.currentSlot;
      const error = slot.init(props).validate();
      if (error) {
        this.message.error = error;
      } else {
        canvas.clear().fillStyle('#0d4c61');
        slot.draw(canvas);
        msg.desc = slot.getDescription();
        msg.psi = slot.getHolesPerSquareInch();
        msg.oa = slot.getOpenArea();
        this.drawed = true;
      }
    },

    downloadAsPDF: function() {
      this.loading = true;

      const finishTypeMap = {
        unfinished: 'Unfinished',
        random: 'Finished Random',
        square: 'Finished Square',
        finished: 'Finished',
      };

      const slotData = this.slot;
      const slot = this.currentSlot;
      const props = slot.getAvailableProps();

      const data = new FormData;

      // 描述文字
      data.append('description', slot.getDescription());

      // Hole Type:
      data.append('hole_type', this.slots[slotData.name].label);

      // Finish Type:
      data.append('finish_type', finishTypeMap[this.slot.finish_type]);

      // Hole Size:
      data.append('hole_size', props.indexOf('size') >= 0 ? slotData.size : 0);

      // Centers:
      data.append('centers', props.indexOf('centers') >= 0 ? slotData.centers : 0);

      // Slot Length:
      data.append('slot_length', props.indexOf('width') >= 0 ? slotData.width : 0);

      // Slot Width:
      data.append('slot_width', props.indexOf('height') >= 0 ? slotData.height : 0);

      // Side Bar:
      data.append('side_bar', props.indexOf('gap_y') >= 0 ? slotData.gap_y : 0);

      // End Bar:
      data.append('end_bar', props.indexOf('gap_x') >= 0 ? slotData.gap_x : 0);

      // Pattern Type:
      data.append('pattern_type', this.patterns[slotData.pattern]);

      // Holes PSI:
      data.append('holes_psi', slot.getHolesPerSquareInch().toFixed(2));

      // Open Area:
      data.append('open_area', (slot.getOpenArea()*100).toFixed(2));

      const app = this;

      canvas.canvas.toBlob(function(blob) {
        data.append('drawing', blob);
        data.append('handle', 'convert');

        axios.post('/subsystem/drawing/index.php', data, {headers: { "Content-Type": "multipart/form-data" }})
          .then(function(response) {
            window.open('/subsystem/drawing/index.php?handle=download&uid='+response.data.uid);
            app.loading = false;
          });
      }, 'image/png');
    },
  },
});
