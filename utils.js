
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
  return template.replace(/\{.*?\}/g, match => {
    const m = match.slice(1,-1).trim();
    return parameters[m] != null ? parameters[m] : match;
  });
}

function n(val) {
  val = Number(val);
  return isNaN(val) ? 0 : Math.abs(val);
}

function i(num) {
  return Math.round(num);
}
