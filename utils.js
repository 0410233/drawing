
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

// classExtend
Function.prototype.classExtend = function classExtend(supper, methods) {
  this.prototype = Object.assign(Object.create(supper.prototype), {
    constructor: this,
  }, methods || {});
};

// 翻译函数
const __ = (function() {
  const translations = {
    'Slot 仅供继承': 'Slot 仅供继承',
    '方法必须重写': '方法必须重写',
    '孔径无效': '孔径无效',
    '形制无效': '形制无效',
    '中心距无效': '中心距无效',
    '方法必须重写': '方法必须重写',
    '方法必须重写': '方法必须重写',
  };

  return function __(text) {
    return translations[text] || text;
  }
})();

function i(num) {
  return Math.round(num);
}

function render(template, parameters) {
  return template.replace(/\{.*?\}/g, match => {
    const m = match.slice(1,-1).trim();
    return parameters[m] != null ? parameters[m] : match;
  });
}

function inchToPx(inch) {
  return inch*100;
}

function toNumber(val) {
  val = typeof val === 'number' ? val : parseFloat(val);
  return isFinite(val) ? val : 0;
}

const PI = Math.PI;
const RAD = PI/180;
const cos = Math.cos;
const sin = Math.sin;

// px per inch
const PPI = 100;
