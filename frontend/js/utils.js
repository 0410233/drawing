
// Object.assign PollyFill
if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource !== null && nextSource !== undefined) {
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function (callback, type, quality) {
      var canvas = this;
      setTimeout(function() {
        var binStr = atob( canvas.toDataURL(type, quality).split(',')[1] );
        var len = binStr.length;
        var arr = new Uint8Array(len);

        for (var i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i);
        }

        callback(new Blob([arr], { type: type || 'image/png' }));
      });
    }
  });
}

const PI = Math.PI;
const RAD = PI/180;
const cos = Math.cos;
const sin = Math.sin;
const abs = Math.abs;

// px per inch
const PPI = 96;

// classExtend
Function.prototype.classExtend = function classExtend(supper, methods) {
  this.prototype = Object.assign(Object.create(supper.prototype), {
    constructor: this,
  }, methods || {});
};

function render(template, parameters) {
  return template.replace(/\{.*?\}/g, function(match) {
    const m = match.slice(1,-1).trim();
    return parameters[m] != null ? parameters[m] : match;
  });
}

function toNumber(val) {
  val = Number(val);
  return isNaN(val) ? 0 : val;
}

function toInt(num) {
  return Math.round(num);
}
